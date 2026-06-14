import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from database import supabase
from services.image_service import analyze_product_image

router = APIRouter(prefix="/image", tags=["image"])

@router.post("/upload/{product_id}")
async def upload_image(product_id: str, file: UploadFile = File(...)):
    """Upload a diagnostic image to Supabase Storage and return public URL."""
    file_bytes = await file.read()
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["jpg", "jpeg", "png", "webp"]:
        raise HTTPException(status_code=400, detail="Only JPG/PNG/WebP allowed")

    img_id = str(uuid.uuid4())
    path = f"diagnostic/{product_id}/{img_id}.{ext}"
    supabase.storage.from_("knowledge").upload(path, file_bytes, {"content-type": f"image/{ext}"})
    url = supabase.storage.from_("knowledge").get_public_url(path)

    # Pre-analyze the image
    analysis = await analyze_product_image(url)

    return {"image_url": url, "analysis": analysis}
