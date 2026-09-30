# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# High-Level Storage Service Orchestrator
# ==============================================================================

import logging
from typing import Dict, Any, Optional
from app.core.config import settings
from app.services.storage.providers import (
    BaseStorageProvider,
    SupabaseStorageProvider,
    LocalStorageProvider,
    MemoryStorageProvider,
)
from app.services.storage.validation import validate_upload

logger = logging.getLogger("genesisconnect.storage")


class StorageService:
    """
    Central storage service orchestrator.
    Handles validation, sanitization, path formatting, and delegates to the configured provider.
    """

    def __init__(self, provider: Optional[BaseStorageProvider] = None) -> None:
        if provider:
            self.provider = provider
        else:
            self.provider = self._create_provider()

    def _create_provider(self) -> BaseStorageProvider:
        prov = (settings.STORAGE_PROVIDER or "supabase").lower().strip()
        if prov == "memory":
            logger.info("Initializing in-memory storage provider.")
            return MemoryStorageProvider()
        elif prov == "local":
            logger.info("Initializing local disk storage provider.")
            return LocalStorageProvider()
        else:
            return SupabaseStorageProvider()

    def set_provider(self, provider: BaseStorageProvider) -> None:
        """Allows runtime swapping of storage provider (e.g. in test suites)."""
        self.provider = provider

    def upload_product_image(
        self,
        file_bytes: bytes,
        original_filename: str,
        content_type: str,
    ) -> Dict[str, Any]:
        """
        Validates, sanitizes, and uploads a product photo to the public product images bucket.
        Returns storage key, sanitized filename, bucket, and public CDN URL.
        """
        storage_key, sanitized_name = validate_upload(
            file_bytes=file_bytes,
            original_filename=original_filename,
            content_type=content_type,
            upload_type="product_image",
        )
        bucket = settings.SUPABASE_STORAGE_BUCKET_PRODUCT_IMAGES

        self.provider.upload_file(
            file_bytes=file_bytes,
            storage_key=storage_key,
            bucket_name=bucket,
            content_type=content_type,
        )

        public_url = self.provider.get_public_url(bucket_name=bucket, storage_key=storage_key)
        return {
            "storage_key": storage_key,
            "filename": sanitized_name,
            "bucket": bucket,
            "url": public_url,
            "size_bytes": len(file_bytes),
        }

    def upload_product_datasheet(
        self,
        file_bytes: bytes,
        original_filename: str,
        content_type: str,
    ) -> Dict[str, Any]:
        """
        Validates, sanitizes, and uploads a technical PDF datasheet to the datasheets bucket.
        Returns storage key, sanitized filename, bucket, and asset URL.
        """
        storage_key, sanitized_name = validate_upload(
            file_bytes=file_bytes,
            original_filename=original_filename,
            content_type=content_type,
            upload_type="product_datasheet",
        )
        bucket = settings.SUPABASE_STORAGE_BUCKET_PRODUCT_DOCS

        self.provider.upload_file(
            file_bytes=file_bytes,
            storage_key=storage_key,
            bucket_name=bucket,
            content_type=content_type,
        )

        public_url = self.provider.get_public_url(bucket_name=bucket, storage_key=storage_key)
        return {
            "storage_key": storage_key,
            "filename": sanitized_name,
            "bucket": bucket,
            "url": public_url,
            "size_bytes": len(file_bytes),
        }

    def upload_enquiry_document(
        self,
        file_bytes: bytes,
        original_filename: str,
        content_type: str,
    ) -> Dict[str, Any]:
        """
        Validates, sanitizes, and uploads a customer requirement specification PDF
        to the strictly private requirement-documents bucket.
        CRITICAL: Never returns a public URL. Customer documents remain private.
        """
        storage_key, sanitized_name = validate_upload(
            file_bytes=file_bytes,
            original_filename=original_filename,
            content_type=content_type,
            upload_type="enquiry_document",
        )
        bucket = settings.SUPABASE_STORAGE_BUCKET_REQUIREMENTS

        self.provider.upload_file(
            file_bytes=file_bytes,
            storage_key=storage_key,
            bucket_name=bucket,
            content_type=content_type,
        )

        return {
            "storage_key": storage_key,
            "filename": sanitized_name,
            "bucket": bucket,
            "size_bytes": len(file_bytes),
        }

    def get_enquiry_document_signed_url(
        self,
        storage_key: str,
        expires_in: Optional[int] = None,
    ) -> str:
        """
        Generates a time-limited signed URL for an authorized admin to download
        a private enquiry attachment.
        """
        bucket = settings.SUPABASE_STORAGE_BUCKET_REQUIREMENTS
        expiry = expires_in or settings.SIGNED_URL_EXPIRATION_SECONDS
        return self.provider.get_signed_url(
            bucket_name=bucket,
            storage_key=storage_key,
            expires_in=expiry,
        )

    # --------------------------------------------------------------------------
    # Backward compatibility helpers
    # --------------------------------------------------------------------------
    def upload_file(
        self,
        file_bytes: bytes,
        original_filename: str,
        bucket_name: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        """
        Backward-compatible helper matching legacy signature.
        """
        if bucket_name == settings.SUPABASE_STORAGE_BUCKET_PRODUCT_DOCS:
            res = self.upload_product_datasheet(file_bytes, original_filename, content_type)
            return res["url"]
        elif bucket_name == settings.SUPABASE_STORAGE_BUCKET_REQUIREMENTS:
            res = self.upload_enquiry_document(file_bytes, original_filename, content_type)
            return res["storage_key"]
        else:
            res = self.upload_product_image(file_bytes, original_filename, content_type)
            return res["url"]

    def get_public_url(self, bucket_name: str, file_path: str) -> str:
        return self.provider.get_public_url(bucket_name, file_path)

    def get_signed_url(self, bucket_name: str, file_path: str, expires_in: int = 3600) -> str:
        return self.provider.get_signed_url(bucket_name, file_path, expires_in)


storage_service = StorageService()
