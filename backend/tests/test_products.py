# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — Product Catalogue API Tests
# Verifies Phase 4 API endpoints, slug lookups, filters, schemas & error handling
# ==============================================================================

import pytest
from fastapi.testclient import TestClient


def test_list_all_products(client: TestClient):
    """GET /api/v1/products returns all active catalogue products."""
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 9  # All 9 approved Genesis products
    for product in data:
        assert product["is_active"] is True
        assert product["isActive"] is True


def test_get_product_by_valid_slug(client: TestClient):
    """GET /api/v1/products/{slug} returns single product by URL-safe slug."""
    slug = "industrial-ups"
    response = client.get(f"/api/v1/products/{slug}")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "industrial-ups"
    assert data["name"] == "Industrial UPS"
    assert data["category"] == "UPS"
    assert "features" in data and len(data["features"]) > 0
    assert "specifications" in data and len(data["specifications"]) > 0
    assert data["isActive"] is True


def test_get_product_by_invalid_slug_returns_404(client: TestClient):
    """GET /api/v1/products/{slug} with non-existent slug returns 404 Not Found."""
    invalid_slug = "non-existent-generator-12345"
    response = client.get(f"/api/v1/products/{invalid_slug}")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert f"Product with slug '{invalid_slug}' not found" in data["detail"]


def test_filter_products_by_category(client: TestClient):
    """GET /api/v1/products?category=UPS filters products by category."""
    response = client.get("/api/v1/products?category=UPS")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    for item in data:
        assert item["category"] == "UPS"


def test_filter_products_by_medical_category(client: TestClient):
    """GET /api/v1/products?category=Medical Power Solutions filters medical equipment."""
    response = client.get("/api/v1/products?category=Medical Power Solutions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    slugs = [p["slug"] for p in data]
    assert "ct-scanner-ups" in slugs
    assert "emi-filter-ultrasound" in slugs
    assert "cath-laboratory-ups" in slugs


def test_search_products_by_keyword(client: TestClient):
    """GET /api/v1/products?search=CT Scanner returns matching equipment."""
    response = client.get("/api/v1/products?search=CT Scanner")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    names = [p["name"] for p in data]
    assert any("CT Scanner" in name for name in names)


def test_combined_search_and_category_filter(client: TestClient):
    """GET /api/v1/products?category=Voltage Stabilizers&search=IGBT returns combined matches."""
    response = client.get("/api/v1/products?category=Voltage Stabilizers&search=IGBT")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["slug"] == "igbt-static-voltage-stabilizers"
    assert data[0]["category"] == "Voltage Stabilizers"


def test_empty_product_search_result(client: TestClient):
    """GET /api/v1/products?search=unmatched_query_xyz returns an empty list without error."""
    response = client.get("/api/v1/products?search=unmatched_query_xyz9999")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_product_response_schema_compatibility(client: TestClient):
    """Verifies that product payload contains both frontend camelCase and backend snake_case properties."""
    response = client.get("/api/v1/products/ups-for-small-office")
    assert response.status_code == 200
    product = response.json()

    # Core identification fields
    assert "id" in product
    assert "name" in product
    assert "slug" in product
    assert "category" in product
    assert "description" in product

    # Structured technical specs
    assert "features" in product and isinstance(product["features"], list)
    assert "specifications" in product and isinstance(product["specifications"], list)

    # Dual compatibility fields for TypeScript Product contract
    assert "shortDescription" in product
    assert "short_description" in product
    assert "keyHighlights" in product
    assert "key_highlights" in product
    assert "isActive" in product
    assert "is_active" in product
    assert product["isActive"] == product["is_active"]
