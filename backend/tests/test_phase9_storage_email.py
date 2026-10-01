# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 9 Final Validation: Storage Privacy & Email Resilience Integrations
# ==============================================================================

import io
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.services.storage import storage_service, MemoryStorageProvider
from app.services.email import email_service
from app.services.email.providers import BaseEmailProvider


VALID_PDF_BYTES = b"%PDF-1.7\n%\xe2\xe3\xcf\xd3\n1 0 obj\n<<>>\nendobj\n%%EOF"


@pytest.fixture(autouse=True)
def setup_memory_storage():
    """Isolate storage operations in memory."""
    orig = storage_service.provider
    mem = MemoryStorageProvider()
    storage_service.set_provider(mem)
    yield mem
    storage_service.set_provider(orig)


def test_customer_document_privacy_and_signed_url(client: TestClient, admin_headers: dict):
    """Verify customer documents are uploaded privately and only accessible via signed URLs."""
    # 1. Public upload of requirement PDF
    pdf_file = io.BytesIO(VALID_PDF_BYTES)
    res_upload = client.post(
        "/api/v1/storage/enquiry-document",
        files={"file": ("hospital_power_sld.pdf", pdf_file, "application/pdf")},
    )
    assert res_upload.status_code == 200
    data = res_upload.json()
    assert "storage_key" in data
    storage_key = data["storage_key"]
    # Ensure no public URL is provided for customer documents
    assert "public_url" not in data or data.get("public_url") is None

    # 2. Unauthenticated user cannot request signed URL
    unauth_res = client.get(f"/api/v1/admin/storage/enquiry-document-url?storage_key={storage_key}")
    assert unauth_res.status_code == 401

    # 3. Path traversal attack is rejected
    traversal_res = client.get(
        "/api/v1/admin/storage/enquiry-document-url?storage_key=../../etc/passwd",
        headers=admin_headers,
    )
    assert traversal_res.status_code == 400

    # 4. Authenticated admin can retrieve signed URL
    auth_res = client.get(
        f"/api/v1/admin/storage/enquiry-document-url?storage_key={storage_key}",
        headers=admin_headers,
    )
    assert auth_res.status_code == 200
    assert "signed_url" in auth_res.json()
    assert storage_key in auth_res.json()["signed_url"]


class FailingEmailProvider(BaseEmailProvider):
    """Simulates an external email provider outage."""
    def send_email(self, to_email: str, subject: str, html_body: str, text_body: str) -> bool:
        raise ConnectionError("SMTP Connection to mail server timed out.")


def test_enquiry_persists_even_when_email_provider_fails(client: TestClient):
    """Verify that an email dispatch failure does NOT abort enquiry creation or fail the request."""
    original_provider = email_service.provider
    email_service.set_provider(FailingEmailProvider())

    try:
        quote_payload = {
            "customer_name": "R. Sundararajan",
            "company_name": "Tirupur Textile Mills",
            "email": "rsundar@tirupurtextiles.co.in",
            "phone": "+91 94433 22110",
            "requirement": "Need 500 kVA Active Harmonic Filter for spinning unit.",
            "message": "Testing resilience against transactional email service outage.",
        }
        res = client.post("/api/v1/quote-requests", json=quote_payload)
        # The quote must succeed with 201 Created despite the email outage
        assert res.status_code == 201
        data = res.json()
        assert data["customer_name"] == quote_payload["customer_name"]
        assert data["status"] == "NEW"
        assert "id" in data
    finally:
        email_service.set_provider(original_provider)
