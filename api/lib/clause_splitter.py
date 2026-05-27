"""
LexAI Clause Splitter
=====================
Split legal document text into individual clause segments using
regex-based pattern matching for numbered sections, headings, and
paragraph breaks.
"""

import re
from typing import Any

# ---------------------------------------------------------------------------
# Splitting patterns (ordered by specificity)
# ---------------------------------------------------------------------------

# Numbered clauses: "1.1 ", "12. ", "3.4.5 "
_RE_NUMBERED = re.compile(r"^\s*\d+(?:\.\d+)*\.?\s+", re.MULTILINE)

# Lettered sub-clauses: "(a) ", "(iv) ", "(B) "
_RE_LETTERED = re.compile(r"^\s*\([a-zA-Z0-9]+\)\s+", re.MULTILINE)

# Capital-letter clauses: "A) ", "B) "
_RE_CAPITAL = re.compile(r"^\s*[A-Z]\)\s+", re.MULTILINE)

# ALL-CAPS headings (≥ 5 chars)
_RE_ALL_CAPS = re.compile(r"^[A-Z][A-Z\s]{4,}$", re.MULTILINE)

# Double-newline paragraph separator
_RE_PARAGRAPH = re.compile(r"\n\s*\n")


def _find_split_positions(full_text: str) -> list[int]:
    """Return sorted, deduplicated split positions in the text.

    Each position marks the *start* of a new clause/section.
    """
    positions: set[int] = set()

    for pattern in (_RE_NUMBERED, _RE_LETTERED, _RE_CAPITAL, _RE_ALL_CAPS):
        for m in pattern.finditer(full_text):
            positions.add(m.start())

    # Paragraph breaks → position right after the blank line(s)
    for m in _RE_PARAGRAPH.finditer(full_text):
        positions.add(m.end())

    return sorted(positions)


def _locate_page(offset: int, page_boundaries: list[int]) -> int:
    """Map a character offset to a 1-based page number.

    Args:
        offset: Character offset within the full concatenated text.
        page_boundaries: Cumulative character counts at the *end* of each page.

    Returns:
        1-based page number.
    """
    for page_idx, boundary in enumerate(page_boundaries):
        if offset < boundary:
            return page_idx + 1
    return len(page_boundaries)


def split_into_clauses(
    full_text: str,
    headings: list[str] | None = None,
    pages: list[dict[str, Any]] | None = None,
) -> list[dict[str, Any]]:
    """Split a legal document's full text into clause segments.

    The function uses multiple regex strategies:
    1. Numbered sections (``1.``, ``1.1``, etc.)
    2. Lettered sub-sections (``(a)``, ``(iv)``)
    3. Capital-letter items (``A)``, ``B)``)
    4. ALL-CAPS headings
    5. Double-newline paragraph breaks

    Clauses shorter than 50 characters are filtered out.

    Args:
        full_text: The complete document text.
        headings: Optional list of detected heading strings (currently unused
            but reserved for future section-aware splitting).
        pages: Optional list of page dicts (with ``text`` key) used to map
            clauses back to page numbers.

    Returns:
        A list of clause dicts, each containing:
        ``{index, text, page_number, start_offset, end_offset}``
    """
    if not full_text or not full_text.strip():
        return []

    # Build page boundary map (cumulative char counts)
    page_boundaries: list[int] = []
    if pages:
        cumulative = 0
        for p in pages:
            cumulative += len(p.get("text", "")) + 1  # +1 for the join "\n"
            page_boundaries.append(cumulative)
    else:
        page_boundaries = [len(full_text)]

    positions = _find_split_positions(full_text)

    # If no patterns matched, fall back to double-newline splitting
    if not positions:
        segments = _RE_PARAGRAPH.split(full_text)
        clauses: list[dict[str, Any]] = []
        offset = 0
        for idx, seg in enumerate(segments):
            seg_stripped = seg.strip()
            if len(seg_stripped) < 50:
                offset += len(seg) + 2  # approx paragraph separator len
                continue
            start = full_text.find(seg, offset)
            if start == -1:
                start = offset
            end = start + len(seg)
            clauses.append({
                "index": len(clauses),
                "text": seg_stripped,
                "page_number": _locate_page(start, page_boundaries),
                "start_offset": start,
                "end_offset": end,
            })
            offset = end
        return clauses

    # Add 0 (start) and len(full_text) (end) as boundaries
    if 0 not in positions:
        positions.insert(0, 0)
    positions.append(len(full_text))

    clauses = []
    for i in range(len(positions) - 1):
        start = positions[i]
        end = positions[i + 1]
        text = full_text[start:end].strip()

        if len(text) < 50:
            continue

        clauses.append({
            "index": len(clauses),
            "text": text,
            "page_number": _locate_page(start, page_boundaries),
            "start_offset": start,
            "end_offset": end,
        })

    return clauses
