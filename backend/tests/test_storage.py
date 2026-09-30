# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 8 Storage Service & Upload Endpoints Test Suite
# ==============================================================================

import io
import pytest
from fastapi.testclient import TestClient
from app.services.storage import (
    storage_service,
    validate_upload,
    FileValidationError,
    FileSizeLimitExceededError,
    InvalidFileTypeError,
    MemoryStorageProvider,
)
from app.core.config import settings

# Sample valid binary headers
VALID_JPEG_BYTES = b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 100
VALID_PNG_BYTES = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR" + b"\x00" * 100
VALID_WEBP_BYTES = b"RIFF\x20\x00\x00\x00WEBPVP8 " + b"\x00" * 100
VALID_PDF_BYTES = b"%PDF-1.7\n%\xe2\xe3\xcf\xd3\n1 0 obj\n<<>>\nendobj\n%%EOF"


@pytest.fixture(autouse=True)
def use_memory_storage():
    """Use isolated in-memory storage provider for all storage unit tests."""
    original_provider = storage_service.provider
    mem_provider = MemoryStorageProvider()
    storage_service.set_provider(mem_provider)
    yield mem_provider
    storage_service.set_provider(original_provider)


# ==============================================================================
# 1. Binary Validation Unit Tests
# ==============================================================================
def test_validate_image_jpeg_success():
    storage_key, filename = validate_upload(
        file_bytes=VALID_JPEG_BYTES,
        original_filename="industrial_ups_front.jpg",
        content_type="image/jpeg",
        upload_type="product_image",
    )
    assert storage_key.startswith("products/images/")
    assert storage_key.endswith(".jpg")
    assert filename == "industrial_ups_front.jpg"


def test_validate_image_png_success():
    storage_key, filename = validate_upload(
        file_bytes=VALID_PNG_BYTES,
        original_filename="stabilizer_schematic.png",
        content_type="image/png",
        upload_type="product_image",
    )
    assert storage_key.startswith("products/images/")
    assert storage_key.endswith(".png")


def test_validate_image_webp_success():
    storage_key, filename = validate_upload(
        file_bytes=VALID_WEBP_BYTES,
        original_filename="cath_lab_ups.webp",
        content_type="image/webp",
        upload_type="product_image",
    )
    assert storage_key.startswith("products/images/")
    assert storage_key.endswith(".webp")


def test_validate_datasheet_pdf_success():
    storage_key, filename = validate_upload(
        file_bytes=VALID_PDF_BYTES,
        original_filename="Industrial_UPS_Datasheet.pdf",
        content_type="application/pdf",
        upload_type="product_datasheet",
    )
    assert storage_key.startswith("products/datasheets/")
    assert storage_key.endswith(".pdf")


def test_validate_enquiry_document_success():
    storage_key, filename = validate_upload(
        file_bytes=VALID_PDF_BYTES,
        original_filename="Hospital_Single_Line_Diagram.pdf",
        content_type="application/pdf",
        upload_type="enquiry_document",
    )
    assert storage_key.startswith("enquiries/documents/")
    assert storage_key.endswith(".pdf")


def test_reject_dangerous_script_and_executable_extensions():
    dangerous_names = [
        "malware.exe", "script.sh", "exploit.bat", "webshell.php",
        "vector.js", "page.html", "payload.vbs", "library.dll",
    ]
    for name in dangerous_names:
        with pytest.raises(InvalidFileTypeError):
            validate_upload(
                file_bytes=b"MZ\x90\x00\x03\x00\x00\x00",
                original_filename=name,
                content_type="application/octet-stream",
                upload_type="product_image",
            )


def test_reject_magic_byte_mismatch():
    """Ensure a file named .jpg containing plain text is rejected by magic byte inspection."""
    fake_image_bytes = b"Hello, this is just plain text masquerading as an image."
    with pytest.raises(InvalidFileTypeError):
        validate_upload(
            file_bytes=fake_image_bytes,
            original_filename="fake_photo.jpg",
            content_type="image/jpeg",
            upload_type="product_image",
        )


def test_reject_file_size_exceeded():
    """File exceeding the configured MB limit is rejected."""
    oversized_bytes = b"\xff\xd8\xff\xe0" + b"\x00" * (settings.PRODUCT_IMAGE_MAX_SIZE_MB * 1024 * 1024 + 1024)
    with pytest.raises(FileSizeLimitExceededError):
        validate_upload(
            file_bytes=oversized_bytes,
            original_filename="giant_ups.jpg",
            content_type="image/jpeg",
            upload_type="product_image",
        )


def test_filename_sanitization_removes_traversal():
    storage_key, filename = validate_upload(
        file_bytes=VALID_PDF_BYTES,
        original_filename="../../../../../etc/passwd/spec.pdf",
        content_type="application/pdf",
        upload_type="product_datasheet",
    )
    assert ".." not in storage_key
    assert ".." not in filename
    assert filename == "spec.pdf"


# ==============================================================================
# 2. Storage Endpoints API Integration Tests
# ==============================================================================
def test_admin_upload_product_image_endpoint(client: TestClient, admin_headers: dict):
    response = client.post(
        "/api/v1/admin/storage/product-image",
        headers=admin_headers,
        files={"file": ("ups_catalog.jpg", io.BytesIO(VALID_JPEG_BYTES), "image/jpeg")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "products/images/" in data["storage_key"]
    assert "url" in data
    assert data["bucket"] == settings.SUPABASE_STORAGE_BUCKET_PRODUCT_IMAGES


def test_admin_upload_product_image_unauthorized(client: TestClient):
    response = client.post(
        "/api/v1/admin/storage/product-image",
        files={"file": ("ups.jpg", io.BytesIO(VALID_JPEG_BYTES), "image/jpeg")},
    )
    assert response.status_code == 401


def test_admin_upload_product_datasheet_endpoint(client: TestClient, admin_headers: dict):
    response = client.post(
        "/api/v1/admin/storage/product-datasheet",
        headers=admin_headers,
        files={"file": ("specs.pdf", io.BytesIO(VALID_PDF_BYTES), "application/pdf")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "products/datasheets/" in data["storage_key"]
    assert data["bucket"] == settings.SUPABASE_STORAGE_BUCKET_PRODUCT_DOCS


def test_public_upload_enquiry_document_no_public_url(client: TestClient):
    """Customer technical requirement upload must NOT return a public URL."""
    response = client.post(
        "/api/v1/storage/enquiry-document",
        files={"file": ("hospital_sld.pdf", io.BytesIO(VALID_PDF_BYTES), "application/pdf")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "enquiries/documents/" in data["storage_key"]
    assert data["bucket"] == settings.SUPABASE_STORAGE_BUCKET_REQUIREMENTS
    # Critical security invariant: customer documents have no public CDN URL
    assert "url" not in data


def test_admin_get_enquiry_signed_url_success(client: TestClient, admin_headers: dict):
    response = client.get(
        "/api/v1/admin/storage/enquiry-document-url",
        headers=admin_headers,
        params={"storage_key": "enquiries/documents/test_doc_123.pdf", "expires_in": 1800},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "signed_url" in data
    assert data["expires_in_seconds"] == 1800


def test_admin_get_enquiry_signed_url_unauthorized(client: TestClient):
    response = client.get(
        "/api/v1/admin/storage/enquiry-document-url",
        params={"storage_key": "enquiries/documents/test_doc_123.pdf"},
    )
    assert response.status_code == 401


def test_signed_url_rejects_path_traversal(client: TestClient, admin_headers: dict):
    response = client.get(
        "/api/v1/admin/storage/enquiry-document-url",
        headers=admin_headers,
        params={"storage_key": "../../etc/shadow"},
    )
    assert response.status_code == 400
    assert "Path traversal" in response.json()["detail"]
