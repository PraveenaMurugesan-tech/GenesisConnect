# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Storage Providers: Base, Supabase, Local & In-Memory
# ==============================================================================

import os
import logging
from abc import ABC, abstractmethod
from typing import Optional, Dict
from app.core.config import settings
from app.services.storage.exceptions import StorageProviderError

logger = logging.getLogger("genesisconnect.storage")

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None


class BaseStorageProvider(ABC):
    """Abstract interface defining the contract for object storage providers."""

    @abstractmethod
    def upload_file(
        self,
        file_bytes: bytes,
        storage_key: str,
        bucket_name: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        """Uploads file bytes to the specified bucket at storage_key. Returns identifier or URL."""
        pass

    @abstractmethod
    def get_public_url(self, bucket_name: str, storage_key: str) -> str:
        """Generates a permanent public CDN URL for public assets."""
        pass

    @abstractmethod
    def get_signed_url(self, bucket_name: str, storage_key: str, expires_in: int = 3600) -> str:
        """Generates a time-limited signed URL for private documents."""
        pass

    @abstractmethod
    def delete_file(self, bucket_name: str, storage_key: str) -> bool:
        """Deletes a file from the specified bucket."""
        pass


class SupabaseStorageProvider(BaseStorageProvider):
    """
    Production-grade Supabase Object Storage provider.
    Uses supabase-py SDK. If credentials are not configured or client fails,
    provides safe logging and predictable mock fallback during development.
    """

    def __init__(
        self,
        url: Optional[str] = None,
        key: Optional[str] = None,
        service_role_key: Optional[str] = None,
    ) -> None:
        self.client: Optional[Client] = None
        supabase_url = url or settings.SUPABASE_URL
        # Prefer service role key for backend administration if present
        supabase_key = service_role_key or settings.SUPABASE_SERVICE_ROLE_KEY or key or settings.SUPABASE_KEY

        if create_client and supabase_url and supabase_key:
            try:
                self.client = create_client(supabase_url, supabase_key)
                logger.info("Supabase storage client initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Supabase storage client: {e}")
                self.client = None
        else:
            logger.info("Supabase credentials not fully configured; operating in simulated mode.")

    def upload_file(
        self,
        file_bytes: bytes,
        storage_key: str,
        bucket_name: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        if self.client:
            try:
                self.client.storage.from_(bucket_name).upload(
                    path=storage_key,
                    file=file_bytes,
                    file_options={"content-type": content_type, "upsert": "true"},
                )
                logger.info(f"Uploaded {storage_key} to bucket '{bucket_name}'.")
                return storage_key
            except Exception as e:
                logger.error(f"Supabase upload failed for {storage_key} in {bucket_name}: {e}")
                raise StorageProviderError(f"Upload to storage provider failed: {str(e)}")

        # Simulated fallback for development/testing without live Supabase
        logger.info(f"[SIMULATED] Stored {storage_key} in bucket '{bucket_name}'.")
        return storage_key

    def get_public_url(self, bucket_name: str, storage_key: str) -> str:
        if self.client:
            try:
                return self.client.storage.from_(bucket_name).get_public_url(storage_key)
            except Exception as e:
                logger.error(f"Failed to generate public URL for {storage_key}: {e}")
                raise StorageProviderError(f"Could not generate public asset URL: {str(e)}")

        base_url = settings.SUPABASE_URL.rstrip("/") if settings.SUPABASE_URL else "https://supabase.local"
        return f"{base_url}/storage/v1/object/public/{bucket_name}/{storage_key}"

    def get_signed_url(self, bucket_name: str, storage_key: str, expires_in: int = 3600) -> str:
        if self.client:
            try:
                res = self.client.storage.from_(bucket_name).create_signed_url(storage_key, expires_in)
                if isinstance(res, dict) and "signedURL" in res:
                    return res["signedURL"]
                elif isinstance(res, str):
                    return res
                raise StorageProviderError("Signed URL response format unrecognized.")
            except Exception as e:
                logger.error(f"Failed to generate signed URL for {storage_key}: {e}")
                raise StorageProviderError(f"Could not generate secure signed URL: {str(e)}")

        base_url = settings.SUPABASE_URL.rstrip("/") if settings.SUPABASE_URL else "https://supabase.local"
        return f"{base_url}/storage/v1/object/sign/{bucket_name}/{storage_key}?token=mock_token_expires_{expires_in}s"

    def delete_file(self, bucket_name: str, storage_key: str) -> bool:
        if self.client:
            try:
                self.client.storage.from_(bucket_name).remove([storage_key])
                return True
            except Exception as e:
                logger.error(f"Failed to delete {storage_key} from {bucket_name}: {e}")
                return False
        return True


class LocalStorageProvider(BaseStorageProvider):
    """
    Local filesystem storage provider for offline development and testing.
    """

    def __init__(self, base_directory: Optional[str] = None) -> None:
        self.base_dir = base_directory or settings.LOCAL_STORAGE_PATH
        os.makedirs(self.base_dir, exist_ok=True)

    def _get_target_path(self, bucket_name: str, storage_key: str) -> str:
        safe_key = storage_key.replace("/", os.sep)
        full_path = os.path.join(self.base_dir, bucket_name, safe_key)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        return full_path

    def upload_file(
        self,
        file_bytes: bytes,
        storage_key: str,
        bucket_name: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        target_path = self._get_target_path(bucket_name, storage_key)
        try:
            with open(target_path, "wb") as f:
                f.write(file_bytes)
            return storage_key
        except Exception as e:
            raise StorageProviderError(f"Local storage write failed: {str(e)}")

    def get_public_url(self, bucket_name: str, storage_key: str) -> str:
        return f"/api/v1/storage/local/{bucket_name}/{storage_key}"

    def get_signed_url(self, bucket_name: str, storage_key: str, expires_in: int = 3600) -> str:
        return f"/api/v1/storage/local/{bucket_name}/{storage_key}?token=signed_local_{expires_in}"

    def delete_file(self, bucket_name: str, storage_key: str) -> bool:
        target_path = self._get_target_path(bucket_name, storage_key)
        if os.path.exists(target_path):
            try:
                os.remove(target_path)
                return True
            except Exception:
                return False
        return True


class MemoryStorageProvider(BaseStorageProvider):
    """
    Hermetic In-Memory storage provider for automated testing without disk or network side effects.
    """

    def __init__(self) -> None:
        self._storage: Dict[str, bytes] = {}

    def _make_key(self, bucket_name: str, storage_key: str) -> str:
        return f"{bucket_name}::{storage_key}"

    def upload_file(
        self,
        file_bytes: bytes,
        storage_key: str,
        bucket_name: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        key = self._make_key(bucket_name, storage_key)
        self._storage[key] = file_bytes
        return storage_key

    def get_public_url(self, bucket_name: str, storage_key: str) -> str:
        return f"https://memory-storage.local/{bucket_name}/{storage_key}"

    def get_signed_url(self, bucket_name: str, storage_key: str, expires_in: int = 3600) -> str:
        return f"https://memory-storage.local/signed/{bucket_name}/{storage_key}?expires={expires_in}"

    def delete_file(self, bucket_name: str, storage_key: str) -> bool:
        key = self._make_key(bucket_name, storage_key)
        if key in self._storage:
            del self._storage[key]
            return True
        return False
