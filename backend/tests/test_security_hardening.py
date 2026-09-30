# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 8 Security Hardening & Rate Limiting Test Suite
# ==============================================================================

import logging
from datetime import timedelta
from fastapi.testclient import TestClient
from app.core.security import create_access_token
from app.core.sanitizer import sanitize_input_text
from app.core.rate_limiter import limiter
from app.core.logging_filter import SensitiveDataMaskingFilter
from app.core.config import settings


# ==============================================================================
# 1. HTTP Security Headers
# ==============================================================================
def test_http_security_headers_present_on_all_responses(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    headers = response.headers

    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "default-src" in headers.get("Content-Security-Policy", "")
    assert "camera=()" in headers.get("Permissions-Policy", "")


# ==============================================================================
# 2. Input Sanitization Engine
# ==============================================================================
def test_input_sanitizer_strips_scripts():
    malicious = "<script>alert('xss')</script>Industrial Power Load"
    cleaned = sanitize_input_text(malicious)
    assert cleaned == "Industrial Power Load"
    assert "<script>" not in cleaned


def test_input_sanitizer_strips_iframes_and_pseudo_protocols():
    attack = "<iframe src='evil.com'></iframe><a href='javascript:stealCookies()'>Click me</a>"
    cleaned = sanitize_input_text(attack)
    assert "<iframe" not in cleaned
    assert "javascript:" not in cleaned
    assert cleaned == "Click me"


def test_quote_submission_sanitizes_xss_payload(client: TestClient):
    response = client.post(
        "/api/v1/quote-requests",
        json={
            "customer_name": "Vijay <script>alert(1)</script>Kumar",
            "company_name": "<b>Industrial Tech Pvt Ltd</b>",
            "email": "vijay@industrialtech.in",
            "phone": "+91 99999 11111",
            "requirement": "Load with <iframe src='hack.com'></iframe> isolation",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["customer_name"] == "Vijay Kumar"
    assert data["company_name"] == "Industrial Tech Pvt Ltd"
    assert "<script>" not in data["customer_name"]
    assert "<b>" not in data["company_name"]
    assert "<iframe" not in data["requirement"]


# ==============================================================================
# 3. Rate Limiting / Abuse Protection
# ==============================================================================
def test_rate_limiter_allows_under_threshold():
    limiter.reset()
    test_ip = "192.168.1.100"
    for _ in range(settings.RATE_LIMIT_REQUESTS_PER_MINUTE):
        assert limiter.is_allowed(test_ip) is True


def test_rate_limiter_rejects_exceeded_threshold():
    limiter.reset()
    test_ip = "192.168.1.105"
    for _ in range(settings.RATE_LIMIT_REQUESTS_PER_MINUTE):
        limiter.is_allowed(test_ip)

    # Next attempt must be rejected
    assert limiter.is_allowed(test_ip) is False


# ==============================================================================
# 4. Sensitive Logging Masking Filter
# ==============================================================================
def test_logging_filter_masks_jwt_bearer_token():
    masking_filter = SensitiveDataMaskingFilter()
    record = logging.LogRecord(
        name="test",
        level=logging.INFO,
        pathname="",
        lineno=0,
        msg="Admin authenticated with Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.sig",
        args=(),
        exc_info=None,
    )
    masking_filter.filter(record)
    assert "eyJhbGciOi" not in record.msg
    assert "Bearer [REDACTED_TOKEN]" in record.msg


def test_logging_filter_masks_database_uri_passwords():
    masking_filter = SensitiveDataMaskingFilter()
    record = logging.LogRecord(
        name="test",
        level=logging.INFO,
        pathname="",
        lineno=0,
        msg="Connecting to postgresql://postgres:SuperSecretPassword123@localhost:5432/genesisconnect",
        args=(),
        exc_info=None,
    )
    masking_filter.filter(record)
    assert "SuperSecretPassword123" not in record.msg
    assert "postgresql://postgres:***@localhost:5432/genesisconnect" in record.msg


# ==============================================================================
# 5. JWT Authentication Security Review
# ==============================================================================
def test_expired_jwt_rejected(client: TestClient):
    # Create token expired 1 hour ago
    expired_token = create_access_token(subject=1, expires_delta=timedelta(hours=-1))
    response = client.get(
        "/api/v1/admin/dashboard",
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert response.status_code == 401


def test_tampered_jwt_signature_rejected(client: TestClient):
    valid_token = create_access_token(subject=1)
    tampered_token = valid_token[:-4] + "fake"
    response = client.get(
        "/api/v1/admin/dashboard",
        headers={"Authorization": f"Bearer {tampered_token}"},
    )
    assert response.status_code == 401
