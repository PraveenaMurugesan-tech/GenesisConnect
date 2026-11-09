# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Documentation (Swagger UI, ReDoc, OpenAPI) Test Suite
# ==============================================================================

from fastapi.testclient import TestClient


def test_openapi_schema_endpoint(client: TestClient):
    """GET /openapi.json returns HTTP 200 with complete valid OpenAPI 3 schema."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    assert "application/json" in response.headers.get("content-type", "")

    data = response.json()
    assert "openapi" in data
    assert data["info"]["title"] == "GenesisConnect API"
    assert "paths" in data

    paths = data["paths"]
    # Verify core routes are registered
    assert "/api/health" in paths
    assert "/api/v1/health" in paths
    assert "/api/v1/auth/login" in paths
    assert "/api/v1/products" in paths
    assert "/api/v1/services" in paths
    assert "/api/v1/admin/dashboard" in paths


def test_api_v1_openapi_schema_endpoint(client: TestClient):
    """GET /api/v1/openapi.json returns HTTP 200 for versioned client compatibility."""
    response = client.get("/api/v1/openapi.json")
    assert response.status_code == 200
    assert "application/json" in response.headers.get("content-type", "")

    data = response.json()
    assert "openapi" in data
    assert data["info"]["title"] == "GenesisConnect API"


def test_swagger_ui_endpoint(client: TestClient):
    """GET /docs returns HTTP 200 HTML with Swagger UI assets and openapi spec reference."""
    response = client.get("/docs")
    assert response.status_code == 200
    assert "text/html" in response.headers.get("content-type", "")

    html = response.text
    assert "swagger-ui" in html
    assert "swagger-ui-bundle.js" in html
    assert "swagger-ui.css" in html
    assert "/openapi.json" in html


def test_redoc_endpoint(client: TestClient):
    """GET /redoc returns HTTP 200 HTML with ReDoc assets and openapi spec reference."""
    response = client.get("/redoc")
    assert response.status_code == 200
    assert "text/html" in response.headers.get("content-type", "")

    html = response.text
    assert "redoc" in html
    assert "redoc.standalone.js" in html
    assert "/openapi.json" in html


def test_content_security_policy_allows_documentation_assets(client: TestClient):
    """Ensure Content-Security-Policy permits CDN assets and scripts required by docs."""
    response = client.get("/docs")
    csp = response.headers.get("Content-Security-Policy", "")

    assert "default-src 'self'" in csp
    assert "https://cdn.jsdelivr.net" in csp
    assert "'unsafe-inline'" in csp
    assert "'unsafe-eval'" in csp
