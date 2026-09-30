# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Storage & Secure File Upload Endpoints
# ==============================================================================

import logging
from typing import Dict, Any, Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    Query,
    status,
)
from app.api.deps import get_current_admin
from app.models.user import User
from app.services.storage import (
    storage_service,
    FileValidationError,
    FileSizeLimitExceededError,
    InvalidFileTypeError,
    StorageProviderError,
)
from app.core.config import settings

logger = logging.getLogger("genesisconnect.api.storage")

# Standard storage router (mounted at /api/v1/storage)
router = APIRouter(prefix="/storage", tags=["Storage & Uploads"])

# Dedicated admin storage router (mounted at /api/v1/admin/storage)
admin_router = APIRouter(prefix="/admin/storage", tags=["Admin Storage & Uploads"])


# ==============================================================================
# ADMIN PRODUCT IMAGE UPLOAD
# ==============================================================================
@admin_router.post(
    "/product-image",
    summary="Upload Product Image",
    response_description="Returns uploaded image storage key, CDN URL, and metadata",
)
async def admin_upload_product_image(
    file: UploadFile = File(..., description="Product image file (JPEG, PNG, or WebP)"),
    current_admin: User = Depends(get_current_admin),
) -> Dict[str, Any]:
    """
    Secure admin endpoint to upload a product catalogue photo.
    Validates MIME type, extension, magic bytes, and file size.
    Returns the public CDN URL to associate with a product entity.
    """
    contents = await file.read()
    try:
        result = storage_service.upload_product_image(
            file_bytes=contents,
            original_filename=file.filename or "product_image.jpg",
            content_type=file.content_type or "image/jpeg",
        )
        return {
            "status": "success",
            "message": "Product image uploaded successfully.",
            **result,
        }
    except (InvalidFileTypeError, FileValidationError) as e:
        logger.warning(f"Product image validation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except FileSizeLimitExceededError as e:
        logger.warning(f"Product image size exceeded: {e}")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=str(e),
        )
    except StorageProviderError as e:
        logger.error(f"Storage provider failed on product image upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Storage provider failure. Please check storage credentials and network connectivity.",
        )
    except Exception as e:
        logger.error(f"Unexpected error uploading product image: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the product image.",
        )


# ==============================================================================
# ADMIN PRODUCT DATASHEET UPLOAD
# ==============================================================================
@admin_router.post(
    "/product-datasheet",
    summary="Upload Product Technical Datasheet",
    response_description="Returns uploaded datasheet storage key, URL, and metadata",
)
async def admin_upload_product_datasheet(
    file: UploadFile = File(..., description="Technical datasheet PDF document"),
    current_admin: User = Depends(get_current_admin),
) -> Dict[str, Any]:
    """
    Secure admin endpoint to upload an equipment technical datasheet.
    Strictly validates PDF format, binary header, and file size limit.
    """
    contents = await file.read()
    try:
        result = storage_service.upload_product_datasheet(
            file_bytes=contents,
            original_filename=file.filename or "datasheet.pdf",
            content_type=file.content_type or "application/pdf",
        )
        return {
            "status": "success",
            "message": "Product datasheet uploaded successfully.",
            **result,
        }
    except (InvalidFileTypeError, FileValidationError) as e:
        logger.warning(f"Datasheet validation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except FileSizeLimitExceededError as e:
        logger.warning(f"Datasheet size exceeded: {e}")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=str(e),
        )
    except StorageProviderError as e:
        logger.error(f"Storage provider failed on datasheet upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Storage provider failure. Please check storage credentials and network connectivity.",
        )
    except Exception as e:
        logger.error(f"Unexpected error uploading datasheet: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the technical datasheet.",
        )


# ==============================================================================
# ADMIN FILE REMOVAL
# ==============================================================================
@admin_router.delete(
    "/file",
    summary="Delete File from Storage Bucket",
    response_description="Deletes an asset from storage",
)
def admin_delete_file(
    bucket: str = Query(..., description="Target storage bucket name"),
    storage_key: str = Query(..., description="Relative storage key path"),
    current_admin: User = Depends(get_current_admin),
) -> Dict[str, Any]:
    """
    Deletes an uploaded asset from storage.
    Restricted to authorized system administrators.
    """
    allowed_buckets = {
        settings.SUPABASE_STORAGE_BUCKET_PRODUCT_IMAGES,
        settings.SUPABASE_STORAGE_BUCKET_PRODUCT_DOCS,
        settings.SUPABASE_STORAGE_BUCKET_REQUIREMENTS,
    }
    if bucket not in allowed_buckets:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unauthorized target storage bucket.",
        )

    # Prevent path traversal
    if ".." in storage_key or storage_key.startswith("/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid storage key. Path traversal tokens are prohibited.",
        )

    success = storage_service.provider.delete_file(bucket_name=bucket, storage_key=storage_key)
    return {
        "status": "success" if success else "failed",
        "message": f"File '{storage_key}' processed for deletion in '{bucket}'.",
    }


# ==============================================================================
# ALIASES & BACKWARDS-COMPATIBLE ENDPOINTS UNDER /storage
# ==============================================================================
@router.post("/product-image", summary="Upload Product Image (Admin Alias)")
async def storage_upload_product_image_alias(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
):
    return await admin_upload_product_image(file=file, current_admin=current_admin)


@router.post("/product-datasheet", summary="Upload Product Datasheet (Admin Alias)")
async def storage_upload_product_datasheet_alias(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
):
    return await admin_upload_product_datasheet(file=file, current_admin=current_admin)


@router.post("/upload", summary="Legacy Upload Endpoint")
async def legacy_upload_file(
    file: UploadFile = File(...),
    bucket_type: str = Form("product-images"),
    current_admin: User = Depends(get_current_admin),
):
    """Legacy compatibility endpoint routing to new structured methods."""
    if bucket_type == "product-datasheets":
        return await admin_upload_product_datasheet(file=file, current_admin=current_admin)
    return await admin_upload_product_image(file=file, current_admin=current_admin)
