"""
LexAI — Contract Comparison Endpoint (In-flight comparison)
===========================================================
POST /api/compare

Compares two contract drafts directly from their client-passed clause lists.
No database lookups required.
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from typing import Any, Optional

import google.generativeai as genai

# Vercel local-import shim
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


class handler(BaseHTTPRequestHandler):
    """POST /api/compare — Compare two agreements in-flight."""

    def do_POST(self):
        """Handle document comparison using client-passed clause segments."""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                return self._error(400, "Empty request body")

            body = json.loads(self.rfile.read(content_length))
            clauses_1 = body.get("clauses_1", [])
            clauses_2 = body.get("clauses_2", [])

            if not clauses_1 or not clauses_2:
                return self._error(400, "Both clauses_1 and clauses_2 are required fields")

            # Format clause text lists for Claude context
            c1_str = "\n".join([f"- Clause {c.get('index', idx)}: {c.get('text', '')[:400]}" for idx, c in enumerate(clauses_1[:15])])
            c2_str = "\n".join([f"- Clause {c.get('index', idx)}: {c.get('text', '')[:400]}" for idx, c in enumerate(clauses_2[:15])])

            # Setup Gemini API
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                return self._error(500, "GEMINI_API_KEY is not configured on the server")

            genai.configure(api_key=api_key)

            prompt = (
                f"You are a senior contract analyst. Compare these two documents:\n\n"
                f"Document A (Original Baseline):\n{c1_str}\n\n"
                f"Document B (Revised Draft):\n{c2_str}\n\n"
                f"Identify the key differences. Focus on additions, removals, and significant modifications. "
                f"For each key difference, assess if it is 'better' (advantageous), 'worse' (disadvantageous), "
                f"or 'neutral' for the signing party of the original contract. Explain the impact in 1-2 simple sentences.\n\n"
                f"Format your response as a strict JSON object with this exact structure:\n"
                f"{{\n"
                f"  \"changes\": [\n"
                f"    {{\n"
                f"      \"clause\": \"Name/Summary of clause change (e.g. Indemnity Liability limit reduced)\",\n"
                f"      \"changeType\": \"added\" | \"removed\" | \"modified\",\n"
                f"      \"impact\": \"better\" | \"worse\" | \"neutral\",\n"
                f"      \"explanation\": \"Simple plain English explanation of what this change means for the signer.\"\n"
                f"    }}\n"
                f"  ]\n"
                f"}}\n"
                f"Do not include any intro or wrap text. Return ONLY the JSON object."
            )

            # Call Gemini
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction="You are a precise contract comparison system. Always output valid JSON only."
            )
            resp = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    max_output_tokens=1500,
                    response_mime_type="application/json"
                )
            )

            try:
                response_text = resp.text.strip() if resp.text else "{}"
            except Exception:
                response_text = "{}"
            
            # Clean up response markdown block wrappers if present
            if response_text.startswith("```json"):
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif response_text.startswith("```"):
                response_text = response_text.split("```")[1].split("```")[0].strip()

            try:
                result_json = json.loads(response_text)
            except json.JSONDecodeError:
                result_json = {"changes": [], "raw_response": response_text}

            return self._json(200, result_json)

        except Exception as exc:
            return self._error(500, f"Comparison failed: {str(exc)}")

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
