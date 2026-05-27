"""
LexAI PDF Parser
================
Extract text from PDFs using PyMuPDF with structured page-level output
and heading detection based on font size heuristics.
"""

from typing import Any

import pymupdf  # PyMuPDF >= 1.24 exposes the top-level 'pymupdf' import


def _average_font_size(blocks: list[dict]) -> float:
    """Compute the weighted-average font size across all text spans.

    Args:
        blocks: The block list from ``page.get_text('dict')['blocks']``.

    Returns:
        The average font size (defaults to 12.0 when no text is found).
    """
    total_size = 0.0
    total_chars = 0
    for block in blocks:
        if block.get("type") != 0:  # 0 = text block
            continue
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                text = span.get("text", "").strip()
                if text:
                    total_size += span.get("size", 12.0) * len(text)
                    total_chars += len(text)
    return total_size / total_chars if total_chars else 12.0


def _extract_headings(blocks: list[dict], avg_size: float) -> list[str]:
    """Identify headings as spans whose font size exceeds 1.2× the average.

    Args:
        blocks: The block list from ``page.get_text('dict')['blocks']``.
        avg_size: The average font size for comparison.

    Returns:
        A deduplicated list of heading strings.
    """
    headings: list[str] = []
    seen: set[str] = set()
    threshold = avg_size * 1.2
    for block in blocks:
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                text = span.get("text", "").strip()
                size = span.get("size", 0)
                if text and size > threshold and text not in seen:
                    headings.append(text)
                    seen.add(text)
    return headings


def parse_pdf(pdf_bytes: bytes) -> dict[str, Any]:
    """Parse a PDF from raw bytes and extract structured text.

    Uses PyMuPDF to read each page, extract plain text and detect headings
    based on font-size heuristics.

    Args:
        pdf_bytes: The raw PDF file content.

    Returns:
        A dict with keys:
        - ``pages``: list of ``{page_num, text, headings}``
        - ``full_text``: concatenated text from all pages
        - ``page_count``: total number of pages

    Raises:
        ValueError: If the bytes cannot be opened as a PDF.
    """
    try:
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    except Exception as exc:
        raise ValueError(f"Failed to open PDF: {exc}") from exc

    pages: list[dict[str, Any]] = []
    full_text_parts: list[str] = []

    for page_num in range(len(doc)):
        page = doc[page_num]

        # Plain text for content
        plain_text: str = page.get_text("text") or ""

        # Structured dict for heading detection
        try:
            page_dict: dict = page.get_text("dict")
            blocks: list[dict] = page_dict.get("blocks", [])
        except Exception:
            blocks = []

        avg_size = _average_font_size(blocks)
        headings = _extract_headings(blocks, avg_size)

        pages.append({
            "page_num": page_num + 1,
            "text": plain_text,
            "headings": headings,
        })
        full_text_parts.append(plain_text)

    doc.close()

    full_text = "\n".join(full_text_parts)

    return {
        "pages": pages,
        "full_text": full_text,
        "page_count": len(pages),
    }
