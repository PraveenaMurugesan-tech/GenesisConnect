import uuid
from typing import Optional
from app.core.config import settings

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None


class SupabaseStorageService:
    """Service client for managing file uploads and downloads using Supabase Storage."""

    def __init__(self) -> None:
        self.client: Optional[Client] = None
        if create_client and settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            except Exception:
                self.client = None

    def upload_file(
        self,
        file_bytes: bytes,
        original_filename: str,
        bucket_name: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        """
        Uploads a binary file to a designated Supabase Storage bucket.
        Returns the generated public URL or file path reference.
        """
        ext = original_filename.split(".")[-1] if "." in original_filename else "bin"
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        path = f"uploads/{unique_filename}"

        if self.client:
            self.client.storage.from_(bucket_name).upload(
                path=path,
                file=file_bytes,
                file_options={"content-type": content_type},
            )
            return self.get_public_url(bucket_name, path)

        # Fallback simulated URL for local/development environments
        return f"/mock-storage/{bucket_name}/{path}"

    def get_public_url(self, bucket_name: str, file_path: str) -> str:
        """Retrieves the public CDN URL for an asset in a public bucket."""
        if self.client:
            return self.client.storage.from_(bucket_name).get_public_url(file_path)
        return f"https://mock-supabase.local/storage/v1/object/public/{bucket_name}/{file_path}"

    def get_signed_url(self, bucket_name: str, file_path: str, expires_in: int = 3600) -> str:
        """Retrieves a secure signed download URL for private documents."""
        if self.client:
            res = self.client.storage.from_(bucket_name).create_signed_url(file_path, expires_in)
            return res.get("signedURL", "")
        return f"https://mock-supabase.local/storage/v1/object/signed/{bucket_name}/{file_path}?token=mock"


storage_service = SupabaseStorageService()
