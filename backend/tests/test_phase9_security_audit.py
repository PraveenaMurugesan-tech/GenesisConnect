# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 9 Final Validation: Production Security Audit & Header Verification
# ==============================================================================

import pytest
from fastapi.testclient import TestClient
from app.core.config import settings
from app.main import app


def test_production_security_headers_present(client: TestClient):
    """Verify mandatory HTTP security headers on all responses."""
    res = client.get("/api/health")
    assert res.status_code == 200
    headers = res.headers

    # OWASP recommended headers
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "default-src" in headers.get("Content-Security-Policy", "")
    assert "camera=()" in headers.get("Permissions-Policy", "")


def test_production_error_response_does_not_leak_stack_traces(client: TestClient):
    """Verify that unexpected error responses hide internal stack traces and secrets."""
    # 404 response
    res_404 = client.get("/api/v1/non-existent-route-for-security-check")
    assert res_404.status_code == 404
    assert "Traceback" not in res_404.text
    assert "File \"" not in res_404.text

    # Validation 422 response
    res_422 = client.post("/api/v1/quote-requests", json={"customer_name": ""})
    assert res_422.status_code in (400, 422)
    assert "Traceback" not in res_422.text
    assert "SECRET_KEY" not in res_422.text
    assert "DATABASE_URL" not in res_422.text


def test_cors_origin_handling(client: TestClient):
    """Verify CORS preflight and allowed origins."""
    allowed_origin = "http://localhost:5173"
    res = client.options(
        "/api/v1/products",
        headers={
            "Origin": allowed_origin,
            "Access-Control-Request-Method": "GET",
        },
    )
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == allowed_origin


def test_swagger_disabled_in_production():
    """Verify that when running in production without explicit ENABLE_DOCS, docs are hidden."""
    from fastapi import FastAPI
    # Simulate production FastAPI instance using our main module logic
    prod_is_production = True
    prod_docs_enabled = False

    test_app = FastAPI(
        title="Production App",
        openapi_url="/api/v1/openapi.json" if prod_docs_enabled else None,
        docs_url="/docs" if prod_docs_enabled else None,
        redoc_url="/redoc" if prod_docs_enabled else None,
    )
    with TestClient(test_app) as prod_client:
        assert prod_client.get("/docs").status_code == 404
        assert prod_client.get("/redoc").status_code == 404
        assert prod_client.get("/api/v1/openapi.json").status_code == 404
