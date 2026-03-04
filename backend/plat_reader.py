"""
Plat Document Reader
Extracts legal descriptions, Section/Township/Range (STR) data,
ownership boundaries, and acreage from scanned plat documents.

Pipeline:
  PDF upload → page images (PyMuPDF, 300 DPI) → Claude vision → structured JSON
"""

import io
import base64
import json
import os
import re
from typing import Optional

import fitz  # PyMuPDF
from anthropic import Anthropic

# ---------------------------------------------------------------------------
# Claude client (shared with main.py; initialised lazily here so this module
# can be imported even when ANTHROPIC_API_KEY is absent)
# ---------------------------------------------------------------------------
_claude: Optional[Anthropic] = None


def _get_claude() -> Anthropic:
    global _claude
    if _claude is None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError("ANTHROPIC_API_KEY not configured")
        _claude = Anthropic(api_key=api_key)
    return _claude


# ---------------------------------------------------------------------------
# Plat extraction prompt
# ---------------------------------------------------------------------------
PLAT_SYSTEM_PROMPT = """You are a specialist in reading oil-and-gas plat documents and survey maps.
Your task is to extract structured information from each page of a plat document.

Extract ALL of the following that appear on the page:

1. **Legal Descriptions** – Complete STR (Section-Township-Range) identifiers such as
   "Sec 10, T13N, R13W" or "Section 10, Township 13 North, Range 13 West".
   Normalize to the format: {"section": "10", "township": "13N", "range": "13W"}.

2. **Block / Lot data** – Block numbers, lot numbers, tract identifiers (e.g. "Block 5, Lot 12").

3. **Survey / Abstract numbers** – Abstract number, survey name/number if present.

4. **Ownership / Grantee names** – Names of property owners, grantors, or grantees.

5. **Acreage / Net mineral acres** – Acreage figures associated with parcels or tracts.

6. **County and State** – County name and state abbreviation or full name.

7. **Date** – Any effective date, filing date, or plat date.

8. **Well names / API numbers** – If a well is referenced, capture name and API if visible.

9. **Notes** – Any other legally significant text (easements, reservations, exceptions).

Return a JSON object with this exact schema (omit keys not found on the page):
{
  "page": <int>,
  "legal_descriptions": [
    {"section": "<str>", "township": "<str>", "range": "<str>", "raw": "<original text>"}
  ],
  "blocks_lots": [
    {"block": "<str>", "lot": "<str>", "tract": "<str>"}
  ],
  "survey": {"abstract": "<str>", "survey_name": "<str>"},
  "owners": ["<name>", ...],
  "acreage": [
    {"parcel": "<identifier>", "acres": "<str>"}
  ],
  "county": "<str>",
  "state": "<str>",
  "date": "<str>",
  "wells": [
    {"name": "<str>", "api": "<str>"}
  ],
  "notes": "<str>"
}

Return ONLY the JSON object, no markdown fences.
"""


# ---------------------------------------------------------------------------
# Core functions
# ---------------------------------------------------------------------------

def pdf_to_images(pdf_bytes: bytes, dpi: int = 300) -> list[dict]:
    """
    Convert each page of a PDF to a PNG image.

    Returns a list of {"page": int, "image_b64": str, "width": int, "height": int}.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = []
    mat = fitz.Matrix(dpi / 72, dpi / 72)

    for page_num, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        png_bytes = pix.tobytes("png")
        b64 = base64.standard_b64encode(png_bytes).decode("utf-8")
        pages.append({
            "page": page_num,
            "image_b64": b64,
            "width": pix.width,
            "height": pix.height,
        })

    doc.close()
    return pages


def extract_plat_page(client: Anthropic, page_info: dict) -> dict:
    """
    Send one page image to Claude vision and return extracted structured data.
    """
    page_num = page_info["page"]

    message = client.messages.create(
        model="claude-sonnet-4-5",        # vision-capable, matches rest of backend
        max_tokens=4096,
        system=PLAT_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": page_info["image_b64"],
                        },
                    },
                    {
                        "type": "text",
                        "text": f"This is page {page_num} of the plat document. Extract all legal description and ownership data.",
                    },
                ],
            }
        ],
    )

    raw_text = message.content[0].text.strip()

    # Strip markdown fences if present
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError:
        # Return raw text in notes if Claude's response wasn't clean JSON
        data = {"page": page_num, "notes": raw_text, "_parse_error": True}

    data["page"] = page_num  # Ensure page number is always present
    return data


def read_plat(pdf_bytes: bytes, dpi: int = 300, max_pages: int = 20) -> dict:
    """
    Full pipeline: PDF bytes → list of per-page extractions + a merged summary.

    Returns:
    {
      "pages": [<per-page extraction>, ...],
      "summary": {
          "legal_descriptions": [...],   # deduplicated across all pages
          "owners": [...],
          "acreage_total": "<str or null>",
          "county": "<str>",
          "state": "<str>",
          "wells": [...],
      }
    }
    """
    client = _get_claude()
    page_images = pdf_to_images(pdf_bytes, dpi=dpi)

    if len(page_images) > max_pages:
        page_images = page_images[:max_pages]

    page_results = []
    for pg in page_images:
        result = extract_plat_page(client, pg)
        # Drop base64 from result to keep response lean
        result.pop("image_b64", None)
        page_results.append(result)

    # Build merged summary
    all_descriptions = []
    all_owners = set()
    all_wells = []
    county = None
    state = None
    total_acres = []

    for pg in page_results:
        for desc in pg.get("legal_descriptions", []):
            if desc not in all_descriptions:
                all_descriptions.append(desc)
        for owner in pg.get("owners", []):
            all_owners.add(owner)
        for well in pg.get("wells", []):
            if well not in all_wells:
                all_wells.append(well)
        if not county and pg.get("county"):
            county = pg["county"]
        if not state and pg.get("state"):
            state = pg["state"]
        for ac in pg.get("acreage", []):
            total_acres.append(ac)

    summary = {
        "legal_descriptions": all_descriptions,
        "owners": sorted(all_owners),
        "acreage": total_acres,
        "county": county,
        "state": state,
        "wells": all_wells,
    }

    return {"pages": page_results, "summary": summary}
