from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from app.api.deps import get_current_admin
from app.models.user import User
from app.services.storage import storage_service
from app.core.config import settings

router = APIRouter(prefix="/storage", tags=["Storage & Uploads"])


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    bucket_type: str = Form("product-images"),
    current_admin: User = Depends(get_current_admin),
):
    """Admin endpoint to upload media or documents directly to designated Supabase bucket."""
    valid_buckets = {
        "product-images": settings.SUPABASE_STORAGE_BUCKET_PRODUCT_IMAGES,
        "product-datasheets": settings.SUPABASE_STORAGE_BUCKET_PRODUCT_DOCS,
        "requirement-documents": settings.SUPABASE_STORAGE_BUCKET_REQUIREMENTS,
    }

    target_bucket = valid_buckets.get(bucket_type, settings.SUPABASE_STORAGE_BUCKET_PRODUCT_IMAGES)
    contents = await file.read()

    try:
        url = storage_service.upload_file(
            file_bytes=contents,
            original_filename=file.filename or "upload.bin",
            bucket_name=target_bucket,
            content_type=file.content_type or "application/octet-stream",
        )
        return {
            "filename": file.filename,
            "bucket": target_bucket,
            "url": url,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}",
        )
