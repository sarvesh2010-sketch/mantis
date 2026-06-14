import os
import tempfile
import uuid
import asyncio
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from models.schemas import DocumentLinkCreate
from database import supabase
from services.pdf_service import extract_chunks, get_page_count
from services.moss_service import create_product_index

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

async def _index_product(product_id: str):
    """Background task: pull all chunks for a product and rebuild MOSS index."""
    chunks = supabase.table("document_chunks").select("*").eq("product_id", product_id).execute()
    if not chunks.data:
        return

    try:
        await create_product_index(product_id, chunks.data)
        supabase.table("products").update(
            {"moss_index_id": f"product-{product_id}"}
        ).eq("id", product_id).execute()
        # Mark all docs as indexed
        supabase.table("knowledge_documents").update(
            {"indexed": True, "indexing_error": None}
        ).eq("product_id", product_id).execute()
    except Exception as e:
        supabase.table("knowledge_documents").update(
            {"indexing_error": str(e)}
        ).eq("product_id", product_id).execute()

async def _parse_and_index_document(product_id: str, doc_id: str, file_bytes: bytes):
    """Background task: Parse PDF, save chunks, and rebuild MOSS index."""
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        # Run CPU-intensive PDF parsing in a separate thread to avoid blocking the main event loop
        page_count = await asyncio.to_thread(get_page_count, tmp_path)
        chunks = await asyncio.to_thread(extract_chunks, tmp_path, doc_id, product_id)
    except Exception as e:
        supabase.table("knowledge_documents").update({
            "indexing_error": f"PDF parsing error: {str(e)}",
            "indexed": False
        }).eq("id", doc_id).execute()
        return
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

    try:
        # Update document record with page and chunk count
        supabase.table("knowledge_documents").update({
            "page_count": page_count,
            "chunk_count": len(chunks)
        }).eq("id", doc_id).execute()

        # Save chunks to DB
        chunk_rows = [{
            "id": c["id"],
            "document_id": doc_id,
            "product_id": product_id,
            "chunk_index": c["chunk_index"],
            "content": c["content"],
            "page_number": c["page_number"],
            "section_tag": c["section_tag"],
            "char_count": c["char_count"],
        } for c in chunks]

        # Insert chunks in batches of 100
        for i in range(0, len(chunk_rows), 100):
            supabase.table("document_chunks").insert(chunk_rows[i:i+100]).execute()

        # Rebuild MOSS index
        await _index_product(product_id)

    except Exception as e:
        supabase.table("knowledge_documents").update({
            "indexing_error": f"Database indexing error: {str(e)}",
            "indexed": False
        }).eq("id", doc_id).execute()

@router.post("/upload/{product_id}")
async def upload_document(
    product_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(...),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    doc_id = str(uuid.uuid4())
    storage_path = f"products/{product_id}/{doc_id}.pdf"

    # Upload to Supabase Storage
    supabase.storage.from_("knowledge").upload(storage_path, file_bytes, {"content-type": "application/pdf"})
    file_url = supabase.storage.from_("knowledge").get_public_url(storage_path)

    # Save initial document record (status: indexing)
    supabase.table("knowledge_documents").insert({
        "id": doc_id,
        "product_id": product_id,
        "title": title,
        "type": "pdf",
        "file_url": file_url,
        "page_count": 0,
        "chunk_count": 0,
        "indexed": False,
    }).execute()

    # Trigger background PDF parsing & MOSS indexing
    background_tasks.add_task(_parse_and_index_document, product_id, doc_id, file_bytes)

    return {
        "document_id": doc_id,
        "title": title,
        "page_count": 0,
        "chunk_count": 0,
        "file_url": file_url,
        "message": "Document uploaded and indexing started"
    }

@router.post("/link/{product_id}")
async def add_link(product_id: str, body: DocumentLinkCreate, background_tasks: BackgroundTasks):
    result = supabase.table("knowledge_documents").insert({
        "product_id": product_id,
        "title": body.title,
        "type": body.type,
        "external_url": body.external_url,
        "indexed": False,
    }).execute()
    return result.data[0]

@router.delete("/{document_id}")
async def delete_document(document_id: str, background_tasks: BackgroundTasks):
    try:
        doc = supabase.table("knowledge_documents").select("*").eq("id", document_id).maybe_single().execute()
        if not doc or not doc.data:
            raise HTTPException(status_code=404, detail="Document not found")
    except Exception:
        raise HTTPException(status_code=404, detail="Document not found")

    supabase.table("document_chunks").delete().eq("document_id", document_id).execute()
    supabase.table("knowledge_documents").delete().eq("id", document_id).execute()

    # Re-index product
    product_id = doc.data["product_id"]
    background_tasks.add_task(_index_product, product_id)

    return {"message": "Document deleted and index rebuilding"}
