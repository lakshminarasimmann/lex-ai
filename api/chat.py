"""
LexAI — Document Q&A Chat Endpoint (In-flight RAG)
===================================================
POST /api/chat

Accepts {message, history, clauses, doc_type} and uses Claude to answer questions
about the document using the client-passed clauses list as context.
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


def _find_relevant_clauses(query: str, clauses: list[dict], limit: int = 5) -> list[dict]:
    """Find the most relevant clauses for a query using simple word matching."""
    query_words = set(query.lower().split())
    scored_clauses = []
    
    for c in clauses:
        text = c.get("text", "").lower()
        score = 0
        for word in query_words:
            if len(word) > 3 and word in text:
                score += 1
                
        scored_clauses.append((score, c))
        
    scored_clauses.sort(key=lambda x: x[0], reverse=True)
    return [c for score, c in scored_clauses if score > 0][:limit]


class handler(BaseHTTPRequestHandler):
    """POST /api/chat — Chat with a legal document using in-flight state."""

    def do_POST(self):
        """Handle legal Q&A requests using client-supplied context."""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                return self._error(400, "Empty request body")

            body = json.loads(self.rfile.read(content_length))
            message = body.get("message")
            history = body.get("history", [])
            clauses = body.get("clauses", [])
            doc_type = body.get("doc_type", "agreement")

            if not message:
                return self._error(400, "message is a required field")

            # Extract RAG context in-memory from passed clauses
            relevant = []
            if clauses:
                relevant = _find_relevant_clauses(message, clauses)
                if not relevant:
                    # Fallback to top risks if no direct word match
                    relevant = sorted(clauses, key=lambda c: c.get("riskScore", 0), reverse=True)[:5]

            # Build context string
            context_str = ""
            for rc in relevant:
                category = rc.get("category", "General")
                level = rc.get("riskLevel", "low")
                context_str += f"\n- [{category}] (Risk: {level}): {rc.get('text', '')}\n"

            # Setup Gemini Client
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                return self._error(500, "GEMINI_API_KEY is not configured on the server")

            genai.configure(api_key=api_key)

            # Build message history for Gemini
            gemini_contents = []
            for h in history[-6:]:
                role = "user" if h.get("role") == "user" else "model"
                gemini_contents.append({
                    "role": role,
                    "parts": [h.get("content", "")]
                })

            prompt = (
                f"Document Context:\n{context_str}\n\n"
                f"Question: {message}\n\n"
                f"Please answer the question based on the document context. "
                f"If the answer cannot be found in the context, draw on your general legal knowledge "
                f"for a '{doc_type}' to reply in plain, direct English, "
                f"but clearly state if you are drawing on general legal knowledge rather than the text itself."
            )
            
            gemini_contents.append({
                "role": "user",
                "parts": [prompt]
            })

            # Call Gemini API
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=(
                    "You are a helpful senior legal assistant. "
                    "You explain complex legal concepts in plain, direct English. "
                    "Do not sound overly bureaucratic. Never give direct professional legal advice. "
                    "Use formatting like bullet points or bold text to make explanations highly readable."
                )
            )
            resp = model.generate_content(
                gemini_contents,
                generation_config=genai.GenerationConfig(max_output_tokens=1000)
            )

            try:
                response_content = resp.text if resp.text else "I apologize, but I could not formulate an answer."
            except Exception:
                response_content = "I apologize, but I could not formulate an answer. The response may have been flagged or was invalid."

            return self._json(200, {
                "reply": response_content
            })

        except Exception as exc:
            return self._error(500, f"Chat processing failed: {str(exc)}")

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
