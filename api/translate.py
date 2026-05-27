"""
LexAI — Legal Translation Endpoint
===================================
POST /api/translate

Translates legal analysis or clause explanations into target Indian languages:
'ta' (Tamil), 'hi' (Hindi), 'te' (Telugu) using Claude for superior legal context preservation.
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from typing import Any, Optional

import google.generativeai as genai

# Vercel local-import shim
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


_LANG_MAP = {
    "ta": "Tamil",
    "hi": "Hindi",
    "te": "Telugu"
}


class handler(BaseHTTPRequestHandler):
    """POST /api/translate — Translate legal text."""

    def do_POST(self):
        """Handle translation requests."""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                return self._error(400, "Empty request body")

            body = json.loads(self.rfile.read(content_length))
            text = body.get("text")
            target_lang = body.get("target_lang", "hi")

            if not text:
                return self._error(400, "text is a required field")

            if target_lang not in _LANG_MAP:
                return self._error(400, f"Unsupported target language. Supported: {list(_LANG_MAP.keys())}")

            lang_name = _LANG_MAP[target_lang]

            # Setup Gemini Client
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                return self._error(500, "GEMINI_API_KEY is not configured on the server")

            genai.configure(api_key=api_key)

            prompt = (
                f"You are a professional legal translator. "
                f"Translate the following English legal explanation/text into clear, natural, "
                f"and precise {lang_name}. Make sure to maintain the correct legal meaning but "
                f"keep it easy to understand for a layperson. Do not use overly complex academic vocabulary.\n\n"
                f"Text to translate:\n{text}\n\n"
                f"Return ONLY the translated text. Do not add any conversational introductions, "
                f"notes, or formatting."
            )

            # Call Gemini API
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=f"You are a helpful translator specializing in legal translation to {lang_name}."
            )
            resp = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(max_output_tokens=1000)
            )

            try:
                translated_text = resp.text.strip() if resp.text else ""
            except Exception:
                translated_text = "Translation is temporarily unavailable due to content safety flags."

            return self._json(200, {
                "translated_text": translated_text,
                "source_lang": "en",
                "target_lang": target_lang
            })

        except Exception as exc:
            return self._error(500, f"Translation failed: {str(exc)}")

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
