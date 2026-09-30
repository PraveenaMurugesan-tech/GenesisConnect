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
# ENQUIRY DOCUMENT UPLOADS (STRICTLY PRIVATE)
# ==============================================================================
@admin_router.post(
    "/enquiry-document",
    summary="Upload Enquiry Attachment (Admin)",
    response_description="Returns uploaded document storage key and metadata (strictly private)",
)
async def admin_upload_enquiry_document(
    file: UploadFile = File(..., description="Customer requirement PDF document"),
    current_admin: User = Depends(get_current_admin),
) -> Dict[str, Any]:
    """
    Admin endpoint to upload/attach technical requirement documentation.
    Strictly validates PDF format and stores within the private bucket.
    """
    contents = await file.read()
    try:
        result = storage_service.upload_enquiry_document(
            file_bytes=contents,
            original_filename=file.filename or "requirement.pdf",
            content_type=file.content_type or "application/pdf",
        )
        return {
            "status": "success",
            "message": "Enquiry document stored in private vault.",
            **result,
        }
    except (InvalidFileTypeError, FileValidationError) as e:
        logger.warning(f"Enquiry document validation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except FileSizeLimitExceededError as e:
        logger.warning(f"Enquiry document size exceeded: {e}")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=str(e),
        )
    except StorageProviderError as e:
        logger.error(f"Storage provider failed on enquiry document upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Storage provider failure. Please check storage credentials and network connectivity.",
        )
    except Exception as e:
        logger.error(f"Unexpected error uploading enquiry document: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the enquiry document.",
        )


@router.post(
    "/enquiry-document",
    summary="Upload Customer Requirement Document",
    response_description="Returns secure storage key for enquiry form attachment",
)
async def public_upload_enquiry_document(
    file: UploadFile = File(..., description="Customer technical specification PDF"),
) -> Dict[str, Any]:
    """
    Public customer endpoint to upload equipment specifications during customized requirement submission.
    - Allowed type: PDF only.
    - Validates binary magic byte (%PDF-).
    - File size limit enforced from environment.
    - Files are stored in a private bucket; NO public URL is ever issued.
    """
    contents = await file.read()
    try:
        result = storage_service.upload_enquiry_document(
            file_bytes=contents,
            original_filename=file.filename or "requirement.pdf",
            content_type=file.content_type or "application/pdf",
        )
        return {
            "status": "success",
            "message": "Technical requirement document uploaded securely.",
            **result,
        }
    except (InvalidFileTypeError, FileValidationError) as e:
        logger.warning(f"Customer document validation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except FileSizeLimitExceededError as e:
        logger.warning(f"Customer document size exceeded: {e}")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=str(e),
        )
    except StorageProviderError as e:
        logger.error(f"Storage provider failed on customer document upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Storage provider failure. Please check storage credentials and network connectivity.",
        )
    except Exception as e:
        logger.error(f"Unexpected error uploading customer document: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your document.",
        )



# ==============================================================================
# SECURE ENQUIRY DOCUMENT ACCESS (ADMIN ONLY)
# ==============================================================================
@admin_router.get(
    "/enquiry-document-url",
    summary="Get Secure Signed URL for Customer Enquiry Document",
    response_description="Returns a temporary signed URL for authorized admin viewing",
)
def admin_get_enquiry_document_url(
    storage_key: str = Query(..., description="Storage key of the private customer document"),
    expires_in: int = Query(3600, ge=60, le=86400, description="URL validity in seconds (default: 1 hour)"),
    current_admin: User = Depends(get_current_admin),
) -> Dict[str, Any]:
    """
    Generates a secure, temporary signed URL allowing an authorized administrator
    to inspect customer technical requirement attachments.
    Never exposes customer documents to public unauthenticated users.
    """
    # Sanitize storage_key to prevent directory traversal
    if ".." in storage_key or storage_key.startswith("/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid storage key parameter. Path traversal tokens are forbidden.",
        )

    try:
        signed_url = storage_service.get_enquiry_document_signed_url(
            storage_key=storage_key,
            expires_in=expires_in,
        )
        return {
            "status": "success",
            "storage_key": storage_key,
            "signed_url": signed_url,
            "expires_in_seconds": expires_in,
        }
    except Exception as e:
        logger.error(f"Failed to generate signed document URL for key '{storage_key}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate temporary signed download URL.",
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
