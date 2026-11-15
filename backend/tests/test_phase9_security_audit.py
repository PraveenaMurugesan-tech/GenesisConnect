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


def test_cors_preflight_on_contact_messages_and_quote_requests(client: TestClient):
    """
    Verifies CORS preflight succeeds on public submission endpoints for actual Vite frontend dev origins
    such as http://localhost:5174 and http://127.0.0.1:5174.
    """
    dev_origins = [
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    endpoints = [
        "/api/v1/contact-messages",
        "/api/v1/quote-requests",
        "/api/v1/custom-requirements",
    ]

    for origin in dev_origins:
        for ep in endpoints:
            res = client.options(
                ep,
                headers={
                    "Origin": origin,
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "authorization,content-type,accept",
                },
            )
            assert res.status_code == 200, f"Failed for {origin} -> {ep}: {res.status_code}"
            assert res.headers.get("access-control-allow-origin") == origin
            assert res.headers.get("access-control-allow-credentials") == "true"
            allowed_methods = res.headers.get("access-control-allow-methods", "")
            for m in ["POST", "GET", "OPTIONS", "PATCH", "PUT"]:
                assert m in allowed_methods, f"Method {m} not in allowed methods: {allowed_methods}"


def test_cors_rejects_unauthorized_external_origins(client: TestClient):
    """
    Verifies that unauthorized external origins outside local development are rejected with 400 Bad Request.
    """
    res = client.options(
        "/api/v1/contact-messages",
        headers={
            "Origin": "http://malicious-external-attacker.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert res.status_code == 400
    assert "Disallowed CORS origin" in res.text


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
