"""
LexAI PDF Parser
================
Extract text from PDFs using pypdf — a pure-Python library that has zero C-extensions,
ensuring 100% compatibility and zero dynamic shared library errors in serverless environments.
"""

import io
from typing import Any
import pypdf


def parse_pdf(pdf_bytes: bytes) -> dict[str, Any]:
    """Parse a PDF from raw bytes and extract structured page-level text.

    Uses the pure-Python pypdf library, ensuring high stability in Vercel.

    Args:
        pdf_bytes: The raw PDF file content.

    Returns:
        A dict with keys:
        - ``pages``: list of ``{page_num, text, headings}``
        - ``full_text``: concatenated text from all pages
        - ``page_count``: total number of pages

    Raises:
        ValueError: If the bytes cannot be parsed as a PDF.
    """
    try:
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    except Exception as exc:
        raise ValueError(f"Failed to open PDF: {exc}") from exc

    pages: list[dict[str, Any]] = []
    full_text_parts: list[str] = []

    for page_idx, page in enumerate(reader.pages):
        # Extract text page by page
        plain_text: str = page.extract_text() or ""
        
        pages.append({
            "page_num": page_idx + 1,
            "text": plain_text,
            "headings": [],  # pypdf focuses on pure text extraction, fallback empty list
        })
        full_text_parts.append(plain_text)

    full_text = "\n".join(full_text_parts)

    return {
        "pages": pages,
        "full_text": full_text,
        "page_count": len(pages),
    }
