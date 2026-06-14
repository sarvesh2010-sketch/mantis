import pdfplumber
import re
import uuid
from typing import List, Dict

CHUNK_SIZE = 600        # characters per chunk
CHUNK_OVERLAP = 100     # overlap between chunks

SECTION_KEYWORDS = {
    "troubleshooting": ["troubleshoot", "problem", "issue", "fault", "error", "not working", "repair", "fix", "diagnos"],
    "maintenance": ["maintenance", "service", "clean", "replace", "interval", "schedule", "oil", "filter", "check"],
    "specifications": ["specification", "dimension", "capacity", "weight", "voltage", "power", "model", "rated"],
    "parts": ["part", "component", "spare", "assembly", "diagram", "exploded", "catalog", "item number"],
    "safety": ["warning", "caution", "danger", "safety", "hazard", "do not", "never"],
}

def classify_section(text: str) -> str:
    text_lower = text.lower()
    for section, keywords in SECTION_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return section
    return "general"

def extract_chunks(pdf_path: str, document_id: str, product_id: str) -> List[Dict]:
    chunks = []
    chunk_index = 0

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            text = re.sub(r'\s+', ' ', text).strip()
            if not text:
                continue

            # Slide window over page text
            start = 0
            while start < len(text):
                end = start + CHUNK_SIZE
                chunk_text = text[start:end]

                if len(chunk_text.strip()) < 50:
                    break

                chunks.append({
                    "id": str(uuid.uuid4()),
                    "document_id": document_id,
                    "product_id": product_id,
                    "chunk_index": chunk_index,
                    "content": chunk_text.strip(),
                    "page_number": page_num,
                    "section_tag": classify_section(chunk_text),
                    "char_count": len(chunk_text),
                })
                chunk_index += 1
                start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks

def get_page_count(pdf_path: str) -> int:
    with pdfplumber.open(pdf_path) as pdf:
        return len(pdf.pages)
