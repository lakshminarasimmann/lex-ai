"""
LexAI Missing Clause Detection
================================
Detect clauses that are standard for a given document type but absent
from the analysed document, using keyword-matching against a curated
clause library.
"""

import json
import os
from typing import Any


_STANDARD_CLAUSES: dict[str, Any] | None = None


def _load_standard_clauses() -> dict[str, Any]:
    """Load and cache the standard_clauses.json reference data.

    Returns:
        The parsed JSON object keyed by document type.
    """
    global _STANDARD_CLAUSES
    if _STANDARD_CLAUSES is not None:
        return _STANDARD_CLAUSES

    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "standard_clauses.json")
    try:
        with open(json_path, "r", encoding="utf-8") as fh:
            _STANDARD_CLAUSES = json.load(fh)
    except FileNotFoundError:
        _STANDARD_CLAUSES = {}
    return _STANDARD_CLAUSES


def _clause_present(keywords: list[str], clause_texts: list[str]) -> bool:
    """Check whether ANY keyword phrase appears in ANY clause text.

    Comparison is case-insensitive.

    Args:
        keywords: Keyword phrases expected for this standard clause.
        clause_texts: Lowercased texts of all actual clauses.

    Returns:
        *True* if at least one keyword is found in at least one clause.
    """
    for kw in keywords:
        kw_lower = kw.lower()
        for ct in clause_texts:
            if kw_lower in ct:
                return True
    return False


def detect_missing_clauses(
    doc_type: str,
    clauses: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Identify standard clauses that are missing from the document.

    For the given *doc_type*, looks up the expected clauses in
    ``standard_clauses.json`` and checks each one's ``keywords`` against
    the actual clause texts.  Any clause whose keywords are completely
    absent is flagged as ``missing``.

    Args:
        doc_type: The snake_case document type (e.g. ``rental_agreement``).
        clauses: The document's extracted clause dicts (each with ``text``).

    Returns:
        A list of missing-clause dicts, each with:
        ``{id, name, why_matters, template_clause, status: 'missing'}``
    """
    library = _load_standard_clauses()

    # Normalise doc_type key
    doc_type_key = doc_type.lower().replace(" ", "_").replace("-", "_")

    expected = library.get(doc_type_key, [])
    if not expected:
        return []

    # Pre-lowercase all clause texts for efficient matching
    clause_texts: list[str] = [c.get("text", "").lower() for c in clauses]

    missing: list[dict[str, Any]] = []
    for std in expected:
        keywords: list[str] = std.get("keywords", [])
        if not keywords:
            continue

        if not _clause_present(keywords, clause_texts):
            missing.append({
                "id": std.get("id", "unknown"),
                "name": std.get("name", "Unknown Clause"),
                "why_matters": std.get("why_matters", ""),
                "template_clause": std.get("template_clause", ""),
                "status": "missing",
            })

    return missing
