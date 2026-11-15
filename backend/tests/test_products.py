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


def test_filter_products_by_genuine_company_categories(client: TestClient):
    """GET /api/v1/products?category=... correctly filters for all 7 genuine company categories."""
    category_slug_expectations = {
        "Industrial Online UPS": "industrial-ups",
        "Medical and CT Scanner UPS": "ct-scanner-ups",
        "IGBT Static Voltage Stabilizers": "igbt-static-voltage-stabilizers",
        "Servo Voltage Stabilizers": "servo-stabilizers",
        "CVCF Frequency Converters": "cvcf-systems",
        "Cath Lab UPS": "cath-laboratory-ups",
        "Other Power Conditioning Equipment": "custom-specialized-power-systems",
    }

    for category, expected_slug in category_slug_expectations.items():
        response = client.get(f"/api/v1/products?category={category}")
        assert response.status_code == 200, f"Failed for category: {category}"
        data = response.json()
        assert len(data) >= 1, f"No products found for category: {category}"
        slugs = [p["slug"] for p in data]
        assert expected_slug in slugs, f"Expected slug {expected_slug} not in {slugs} for category {category}"


def test_search_products_by_genuine_company_equipment_lines(client: TestClient):
    """GET /api/v1/products?search=... finds products matching genuine company equipment terms."""
    search_expectations = {
        "Industrial Online UPS": "industrial-ups",
        "Medical and CT Scanner UPS": "ct-scanner-ups",
        "IGBT Static Voltage Stabilizers": "igbt-static-voltage-stabilizers",
        "Servo Voltage Stabilizers": "servo-stabilizers",
        "CVCF Frequency Converters": "cvcf-systems",
        "Cath Lab UPS": "cath-laboratory-ups",
        "Other Power Conditioning Equipment": "custom-specialized-power-systems",
    }

    for search_term, expected_slug in search_expectations.items():
        response = client.get(f"/api/v1/products?search={search_term}")
        assert response.status_code == 200, f"Search failed for: {search_term}"
        data = response.json()
        assert len(data) >= 1, f"No products found for search: {search_term}"
        slugs = [p["slug"] for p in data]
        assert expected_slug in slugs, f"Expected {expected_slug} in {slugs} for search '{search_term}'"


def test_inactive_products_excluded_from_public_catalogue(client: TestClient, db_session):
    """Inactive products in database must NOT be returned in public list or slug lookups."""
    from app.models.product import Product

    inactive_prod = Product(
        name="Obsolete Generator Unit",
        slug="obsolete-generator-unit",
        category="Other",
        description="Legacy decommissioned generator unit no longer supported.",
        is_active=False,
    )
    db_session.add(inactive_prod)
    db_session.commit()

    # Verify not in public listing
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    slugs = [p["slug"] for p in response.json()]
    assert "obsolete-generator-unit" not in slugs

    # Verify 404 on direct slug lookup
    lookup_response = client.get("/api/v1/products/obsolete-generator-unit")
    assert lookup_response.status_code == 404


def test_all_official_catalogue_slugs_accessible(client: TestClient):
    """Verifies that all 9 official database slugs are directly fetchable."""
    official_slugs = [
        "ups-for-small-office",
        "industrial-ups",
        "ct-scanner-ups",
        "emi-filter-ultrasound",
        "igbt-static-voltage-stabilizers",
        "servo-stabilizers",
        "cvcf-systems",
        "cath-laboratory-ups",
        "custom-specialized-power-systems",
    ]

    for slug in official_slugs:
        response = client.get(f"/api/v1/products/{slug}")
        assert response.status_code == 200, f"Slug {slug} failed with status {response.status_code}"
        data = response.json()
        assert data["slug"] == slug
        assert data["is_active"] is True
        assert len(data["name"]) > 0
        assert len(data["description"]) > 10
        assert isinstance(data["specifications"], list)


def test_product_image_paths_match_exact_approved_filenames(client: TestClient):
    """
    Verifies that all 7 products with dedicated assets return the exact approved filenames.
    """
    expected_images = {
        "ups-for-small-office": "/images/products/small_ups.jpg",
        "industrial-ups": "/images/products/industrialups.jpeg",
        "ct-scanner-ups": "/images/products/ct_scanner.jpg",
        "emi-filter-ultrasound": "/images/products/emi_filter.jpg",
        "igbt-static-voltage-stabilizers": "/images/products/igbt.jpg",
        "servo-stabilizers": "/images/products/servo.jpg",
        "cvcf-systems": "/images/products/cvcf.jpg",
    }

    response = client.get("/api/v1/products")
    assert response.status_code == 200
    products_by_slug = {p["slug"]: p for p in response.json()}

    for slug, expected_img in expected_images.items():
        assert slug in products_by_slug, f"Missing product slug {slug}"
        prod = products_by_slug[slug]
        assert prod["image"] == expected_img, f"Product {slug} expected image {expected_img}, got {prod['image']}"
        assert expected_img in prod["images"], f"Product {slug} expected {expected_img} in images {prod['images']}"


def test_placeholder_products_have_no_invented_image_paths(client: TestClient):
    """
    Verifies that products lacking dedicated photography (Cath Lab UPS and Custom Systems)
    do not invent fake file paths and return None/empty list.
    """
    placeholder_slugs = [
        "cath-laboratory-ups",
        "custom-specialized-power-systems",
    ]

    for slug in placeholder_slugs:
        response = client.get(f"/api/v1/products/{slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["image"] is None, f"Expected None image for {slug}, got {data['image']}"
        assert data["images"] == [], f"Expected empty images for {slug}, got {data['images']}"


def test_all_product_image_assets_exist_on_disk():
    """
    Verifies that every mapped public product image actually exists on disk in frontend/public.
    """
    import os

    expected_files = [
        "small_ups.jpg",
        "industrialups.jpeg",
        "ct_scanner.jpg",
        "emi_filter.jpg",
        "igbt.jpg",
        "servo.jpg",
        "cvcf.jpg",
    ]
    # Path relative to repository root from backend/
    frontend_img_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "images", "products")
    )
    assert os.path.isdir(frontend_img_dir), f"Directory {frontend_img_dir} does not exist"

    for filename in expected_files:
        filepath = os.path.join(frontend_img_dir, filename)
        assert os.path.isfile(filepath), f"Image file missing on disk: {filepath}"
        assert os.path.getsize(filepath) > 0, f"Image file is empty: {filepath}"
