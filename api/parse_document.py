"""
LexAI — Document Ingestion & In-flight Analysis Pipeline
======================================================
POST /api/parse-document

Accepts a multipart/form-data PDF upload, extracts text, classifies the
document, segments it into clauses, executes classification and risk scoring,
runs Claude LLM synthesis, and returns the complete final AnalysisResults JSON.
No database or caching required.
"""

from http.server import BaseHTTPRequestHandler
import hashlib
import json
import os
import sys
import re
from datetime import datetime, timezone
import uuid

# Vercel local-import shim
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lib.pdf_parser import parse_pdf
from lib.doc_classifier import classify_document
from lib.clause_splitter import split_into_clauses
from lib.clause_classifier import classify_clauses
from lib.risk_scorer import score_risks
from lib.missing_clauses import detect_missing_clauses
from lib.llm_synthesis import synthesize_analysis


# ---------------------------------------------------------------------------
# Multipart parser — lightweight, no external dependency
# ---------------------------------------------------------------------------


def _parse_multipart(content_type: str, body: bytes) -> dict:
    """Parse multipart/form-data body into a dict of fields.

    Returns a dict where file fields have value ``{filename, content_type, data}``.
    """
    match = re.search(r"boundary=(.+?)(?:;|$)", content_type)
    if not match:
        raise ValueError("Missing boundary in Content-Type")

    boundary = match.group(1).strip().strip('"').encode()
    delimiter = b"--" + boundary
    parts = body.split(delimiter)

    fields: dict = {}
    for part in parts:
        if not part or part == b"--\r\n" or part.strip() == b"--":
            continue

        if b"\r\n\r\n" in part:
            header_section, file_data = part.split(b"\r\n\r\n", 1)
        elif b"\n\n" in part:
            header_section, file_data = part.split(b"\n\n", 1)
        else:
            continue

        if file_data.endswith(b"\r\n"):
            file_data = file_data[:-2]
        elif file_data.endswith(b"\n"):
            file_data = file_data[:-1]

        headers_text = header_section.decode("utf-8", errors="replace")

        name_match = re.search(r'name="([^"]+)"', headers_text)
        if not name_match:
            continue
        field_name = name_match.group(1)

        filename_match = re.search(r'filename="([^"]*)"', headers_text)
        if filename_match:
            filename = filename_match.group(1)
            ct_match = re.search(r"Content-Type:\s*(.+?)(?:\r?\n|$)", headers_text, re.IGNORECASE)
            file_ct = ct_match.group(1).strip() if ct_match else "application/octet-stream"
            fields[field_name] = {
                "filename": filename,
                "content_type": file_ct,
                "data": file_data,
            }
        else:
            fields[field_name] = file_data.decode("utf-8", errors="replace").strip()

    return fields


# ---------------------------------------------------------------------------
# Handler
# ---------------------------------------------------------------------------


class handler(BaseHTTPRequestHandler):
    """POST /api/parse_document — ingest and analyze a PDF document in-flight."""

    def do_POST(self):
        """Handle PDF upload, analyze immediately, and return full JSON results."""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                return self._error(400, "Empty request body")

            body = self.rfile.read(content_length)
            content_type = self.headers.get("Content-Type", "")

            if "multipart/form-data" not in content_type:
                return self._error(400, "Content-Type must be multipart/form-data")

            # Parse multipart fields
            try:
                fields = _parse_multipart(content_type, body)
            except ValueError as e:
                return self._error(400, f"Invalid multipart data: {e}")

            # Extract file field
            file_field = None
            for key in ("file", "pdf", "document"):
                if key in fields and isinstance(fields[key], dict):
                    file_field = fields[key]
                    break

            if not file_field:
                return self._error(400, "No file field found. Use field name 'file', 'pdf', or 'document'.")

            file_name: str = file_field["filename"]
            file_data: bytes = file_field["data"]
            file_size = len(file_data)

            if not file_name.lower().endswith(".pdf"):
                return self._error(400, "Only PDF files are accepted")

            if file_size > 10 * 1024 * 1024:  # 10 MB
                return self._error(400, "File size exceeds 10 MB limit")

            if file_size == 0:
                return self._error(400, "Empty file")

            # Unique random doc ID for the in-flight state
            doc_id = "doc_" + uuid.uuid4().hex[:16]
            file_hash = hashlib.sha256(file_data).hexdigest()

            # 1. Parse PDF pages & text
            try:
                parsed = parse_pdf(file_data)
            except Exception as e:
                return self._error(400, f"PDF parsing failed: {e}")

            full_text: str = parsed["full_text"]
            pages: list = parsed["pages"]
            page_count: int = parsed["page_count"]

            if not full_text.strip():
                return self._error(400, "No text could be extracted from the PDF. The document may be scanned or image-only.")

            # 2. Classify document category
            try:
                classification = classify_document(full_text)
                doc_type = classification["doc_type"]
            except Exception:
                doc_type = "unknown"

            # 3. Split into clauses
            all_headings: list[str] = []
            for p in pages:
                all_headings.extend(p.get("headings", []))

            clauses_list = split_into_clauses(full_text, all_headings, pages)
            clause_count = len(clauses_list)

            # Map clauses into clean dictionary models
            clauses = []
            for idx, c in enumerate(clauses_list):
                clauses.append({
                    "id": f"clause_{idx}",
                    "documentId": doc_id,
                    "index": idx + 1,
                    "text": c.get("text", ""),
                    "pageNumber": c.get("page_number", 1),
                    "startOffset": c.get("start_offset", 0),
                    "endOffset": c.get("end_offset", 0),
                    "category": "miscellaneous",
                    "confidence": 0.0,
                    "riskScore": 0,
                    "riskLevel": "low",
                    "riskReason": None,
                    "explanation": None,
                    "counterClause": None
                })

            # 4. Classify clauses in batches
            try:
                classified_clauses = classify_clauses(clauses_list)
                for i, cc in enumerate(classified_clauses):
                    if i < len(clauses):
                        clauses[i]["category"] = cc.get("category", "miscellaneous")
                        clauses[i]["confidence"] = cc.get("confidence", 0.0)
            except Exception:
                # Fallback to general category classification if HF rate limited
                pass

            # 5. Score risks
            try:
                scored = score_risks(clauses)
                for i, sc in enumerate(scored):
                    if i < len(clauses):
                        clauses[i]["riskScore"] = sc.get("risk_score", 0)
                        clauses[i]["riskLevel"] = sc.get("risk_level", "low")
                        clauses[i]["riskReason"] = sc.get("risk_reason")
            except Exception:
                pass

            # 6. Detect missing clauses
            try:
                missing = detect_missing_clauses(doc_type, clauses_list)
            except Exception:
                missing = []

            # 7. LLM synthesis (Claude API)
            # Sort descending for LLM synthesis
            risky_clauses = sorted(clauses, key=lambda c: c.get("riskScore", 0), reverse=True)
            try:
                # Convert keys back to snake_case briefly to support synthesize_analysis format
                risky_clauses_snake = []
                for rc in risky_clauses:
                    risky_clauses_snake.append({
                        "index": rc["index"],
                        "text": rc["text"],
                        "category": rc["category"],
                        "risk_score": rc["riskScore"],
                        "risk_level": rc["riskLevel"],
                        "risk_reason": rc["riskReason"]
                    })
                
                synthesis = synthesize_analysis(doc_type, risky_clauses_snake, clauses)
                
                # Incorporate synthesis back into our clauses
                clause_analyses = synthesis.get("clause_analyses", [])
                clause_analysis_map = {ca.get("clause_index", -1): ca for ca in clause_analyses}
                
                for c in clauses:
                    ca = clause_analysis_map.get(c["index"])
                    if ca:
                        c["explanation"] = ca.get("explanation", "")
                        c["counterClause"] = ca.get("counter_clause", "")
            except Exception as e:
                # Handle API key failure or LLM crash gracefully
                synthesis = {
                    "document_summary": "Document analysis completed with rule scores. Detailed LLM summaries are currently unavailable.",
                    "top_things_to_know": ["Review individual critical risk flags.", "Examine missing structural clauses."],
                    "negotiation_guide": {
                        "push_back_clauses": [],
                        "dos": ["Read every clause fully.", "Seek clarification on ambiguous notice windows."],
                        "donts": ["Never sign verbal extensions.", "Do not agree to unlimited indemnities."],
                        "market_terms": []
                    }
                }

            # 8. Final calculations
            risk_scores = [c.get("riskScore", 0) for c in clauses]
            overall_score = round(sum(risk_scores) / len(risk_scores), 1) if risk_scores else 0

            # Compile into unified results
            results = {
                "document": {
                    "id": doc_id,
                    "fileName": file_name,
                    "fileSize": file_size,
                    "blobUrl": "",  # database-less, no external blobs
                    "docType": doc_type,
                    "pageCount": page_count,
                    "clauseCount": clause_count,
                    "fileHash": file_hash,
                    "createdAt": datetime.now(timezone.utc).isoformat(),
                },
                "clauses": clauses,
                "analysis": {
                    "id": "analysis_" + uuid.uuid4().hex[:16],
                    "documentId": doc_id,
                    "status": "completed",
                    "overallScore": overall_score,
                    "summary": synthesis.get("document_summary", ""),
                    "topThingsToKnow": synthesis.get("top_things_to_know", []),
                    "missingClauses": missing,
                    "negotiationGuide": synthesis.get("negotiation_guide", {}),
                    "stage": "completed",
                    "error": None,
                    "createdAt": datetime.now(timezone.utc).isoformat(),
                    "completedAt": datetime.now(timezone.utc).isoformat(),
                }
            }

            return self._json(200, results)

        except Exception as exc:
            return self._error(500, f"Analysis failed: {str(exc)}")

    # -- Helpers --

    def _json(self, status: int, data: dict) -> None:
        """Send a JSON response."""
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode())

    def _error(self, status: int, message: str) -> None:
        """Send a JSON error response."""
        self._json(status, {"error": message})

    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
