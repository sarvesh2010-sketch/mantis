import time
from typing import List, Dict, Tuple
from moss import MossClient, QueryOptions
from moss_client import get_moss

async def create_product_index(product_id: str, chunks: List[Dict]) -> None:
    """Create or overwrite a MOSS index for a product with its document chunks."""
    client = get_moss()
    index_name = f"product-{product_id}"

    documents = [
        {
            "id": chunk["id"],
            "text": chunk["content"],
            "metadata": {
                "document_id": chunk["document_id"],
                "product_id": chunk["product_id"],
                "page_number": chunk.get("page_number", 0),
                "section_tag": chunk.get("section_tag", "general"),
                "chunk_index": chunk["chunk_index"],
            }
        }
        for chunk in chunks
    ]

    await client.create_index(index_name, documents)
    await client.load_index(index_name)

async def query_product_index(
    product_id: str,
    query: str,
    top_k: int = 5,
    section_filter: str | None = None
) -> Tuple[List[Dict], int]:
    """
    Query MOSS for relevant chunks.
    Returns (results, time_taken_ms).
    Uses hybrid search (semantic + keyword).
    Optionally filters by section_tag via metadata filter.
    """
    client = get_moss()
    index_name = f"product-{product_id}"

    # Ensure index is loaded
    try:
        await client.load_index(index_name)
    except Exception:
        pass  # already loaded

    options = QueryOptions(top_k=top_k)

    # Add metadata filter if section specified
    if section_filter:
        options.filter = {"section_tag": {"$eq": section_filter}}

    start = time.time()
    results = await client.query(index_name, query, options)
    elapsed_ms = int((time.time() - start) * 1000)

    return results.docs, elapsed_ms

async def delete_product_index(product_id: str) -> None:
    client = get_moss()
    index_name = f"product-{product_id}"
    try:
        await client.delete_index(index_name)
    except Exception:
        pass
