# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin CMS Unit & Integration Tests (Phase 6)
# ==============================================================================

import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import UserRole
from app.core.security import create_access_token
from app.repositories.admin_repository import AdminRepository


# ==============================================================================
# 1. Admin Product Management Tests
# ==============================================================================

def test_admin_list_products_authenticated(client: TestClient, admin_headers: dict):
    """Verify authenticated admin can list all products including drafts."""
    response = client.get("/api/v1/admin/products", headers=admin_headers)
    assert response.status_code == 200
    products = response.json()
    assert isinstance(products, list)
    assert len(products) > 0


def test_admin_list_products_unauthorized(client: TestClient):
    """Verify unauthenticated requests to admin products are rejected with 401."""
    response = client.get("/api/v1/admin/products")
    assert response.status_code == 401


def test_admin_create_product_success(client: TestClient, admin_headers: dict):
    """Verify admin can create a new valid product with specifications."""
    payload = {
        "name": "Static Frequency Converter 60Hz",
        "slug": f"static-frequency-converter-60hz-{uuid.uuid4().hex[:6]}",
        "category": "Power Conditioning",
        "short_description": "Engineered 50Hz to 60Hz precision frequency conversion.",
        "description": "High efficiency solid state frequency converter designed for export manufacturing test bays.",
        "is_active": True,
        "specifications": {
            "Input Frequency": "50 Hz +/- 5%",
            "Output Frequency": "60 Hz Crystal Controlled",
            "Topology": "IGBT Double Conversion",
        },
    }
    response = client.post("/api/v1/admin/products", json=payload, headers=admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["slug"] == payload["slug"]
    assert data["category"] == payload["category"]
    assert data["specifications"]["Input Frequency"] == "50 Hz +/- 5%"

    # Clean up so other tests expecting initial catalogue count stay unaffected
    client.delete(f"/api/v1/admin/products/{data['id']}", headers=admin_headers)


def test_admin_create_product_duplicate_slug_rejected(client: TestClient, admin_headers: dict):
    """Verify creating a product with an existing slug returns 400 error."""
    # "industrial-ups" is already seeded in the test database
    payload = {
        "name": "Duplicate Industrial UPS Test",
        "slug": "industrial-ups",
        "category": "UPS",
        "short_description": "Duplicate slug attempt.",
        "description": "Attempting to create another product with the same slug.",
        "is_active": True,
    }
    response = client.post("/api/v1/admin/products", json=payload, headers=admin_headers)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_admin_create_product_invalid_data(client: TestClient, admin_headers: dict):
    """Verify invalid category or missing required fields return 422 Unprocessable Entity."""
    # Invalid category
    payload = {
        "name": "Invalid Category Equipment",
        "slug": "invalid-category-equipment",
        "category": "Fake Unapproved Category",
        "short_description": "Valid short description.",
        "description": "Valid full description.",
    }
    response = client.post("/api/v1/admin/products", json=payload, headers=admin_headers)
    assert response.status_code == 422


def test_admin_update_product(client: TestClient, admin_headers: dict):
    """Verify admin can update an existing product."""
    list_res = client.get("/api/v1/admin/products", headers=admin_headers)
    product = list_res.json()[0]
    original_short_desc = product.get("short_description") or ""

    update_payload = {
        "short_description": "Updated short description for engineering excellence.",
    }
    res = client.put(f"/api/v1/admin/products/{product['id']}", json=update_payload, headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["short_description"] == "Updated short description for engineering excellence."

    # Restore
    client.put(f"/api/v1/admin/products/{product['id']}", json={"short_description": original_short_desc}, headers=admin_headers)


def test_admin_toggle_product_status(client: TestClient, admin_headers: dict):
    """Verify admin can activate / deactivate product status."""
    list_res = client.get("/api/v1/admin/products", headers=admin_headers)
    product = list_res.json()[0]
    initial_status = product["is_active"]

    # Toggle status
    patch_res = client.patch(f"/api/v1/admin/products/{product['id']}/status", headers=admin_headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["is_active"] == (not initial_status)

    # Toggle back to original status
    client.patch(f"/api/v1/admin/products/{product['id']}/status", headers=admin_headers)


# ==============================================================================
# 2. Admin Service Management Tests
# ==============================================================================

def test_admin_list_services(client: TestClient, admin_headers: dict):
    """Verify admin can list all services."""
    res = client.get("/api/v1/admin/services", headers=admin_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_admin_create_service(client: TestClient, admin_headers: dict):
    """Verify admin can create a new engineering service."""
    payload = {
        "title": "Harmonic Filter Calibration Service",
        "slug": f"harmonic-filter-calibration-{uuid.uuid4().hex[:6]}",
        "description": "Comprehensive harmonic analysis and active filter tuning.",
        "is_active": True,
    }
    res = client.post("/api/v1/admin/services", json=payload, headers=admin_headers)
    assert res.status_code == 201
    assert res.json()["title"] == payload["title"]

    # Clean up created service
    client.delete(f"/api/v1/admin/services/{res.json()['id']}", headers=admin_headers)


# ==============================================================================
# 3. Content Management Tests
# ==============================================================================

def test_content_homepage_get_and_put(client: TestClient, admin_headers: dict):
    """Verify public and admin GET/PUT for homepage content."""
    # Public GET
    pub_res = client.get("/api/v1/content/homepage")
    assert pub_res.status_code == 200
    data = pub_res.json()
    assert "hero_heading" in data
    original_heading = data["hero_heading"]

    # Admin PUT
    update_payload = {
        **data,
        "hero_heading": "Mission-Critical Power Infrastructure Engineered in Chennai",
    }
    put_res = client.put("/api/v1/admin/content/homepage", json=update_payload, headers=admin_headers)
    assert put_res.status_code == 200
    assert put_res.json()["hero_heading"] == "Mission-Critical Power Infrastructure Engineered in Chennai"

    # Restore
    update_payload["hero_heading"] = original_heading
    client.put("/api/v1/admin/content/homepage", json=update_payload, headers=admin_headers)


def test_content_contact_get_and_put(client: TestClient, admin_headers: dict):
    """Verify public and admin GET/PUT for contact info."""
    pub_res = client.get("/api/v1/content/contact")
    assert pub_res.status_code == 200
    assert "company_name" in pub_res.json()

    contact_payload = pub_res.json()
    original_phone = contact_payload.get("phone_hotline")
    contact_payload["phone_hotline"] = "+91 98400 99999"
    put_res = client.put("/api/v1/admin/content/contact", json=contact_payload, headers=admin_headers)
    assert put_res.status_code == 200
    assert put_res.json()["phone_hotline"] == "+91 98400 99999"

    # Restore
    contact_payload["phone_hotline"] = original_phone
    client.put("/api/v1/admin/content/contact", json=contact_payload, headers=admin_headers)


# ==============================================================================
# 4. Announcement Management Tests
# ==============================================================================

def test_announcements_crud_and_public(client: TestClient, admin_headers: dict):
    """Verify announcement creation, admin list, status toggle, and public visibility."""
    # Create
    ann_payload = {
        "title": f"Factory Maintenance Notice {uuid.uuid4().hex[:6]}",
        "content": "Our Guindy manufacturing facility will be closed for the annual maintenance shutdown.",
        "is_active": True,
    }
    create_res = client.post("/api/v1/admin/announcements", json=ann_payload, headers=admin_headers)
    assert create_res.status_code == 201
    ann_id = create_res.json()["id"]

    # Public list should contain active announcement
    pub_res = client.get("/api/v1/announcements")
    assert pub_res.status_code == 200
    titles = [a["title"] for a in pub_res.json()]
    assert ann_payload["title"] in titles

    # Deactivate
    patch_res = client.patch(f"/api/v1/admin/announcements/{ann_id}/status", headers=admin_headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["is_active"] is False

    # Public list should no longer include deactivated announcement
    pub_res_after = client.get("/api/v1/announcements")
    titles_after = [a["title"] for a in pub_res_after.json()]
    assert ann_payload["title"] not in titles_after

    # Delete
    del_res = client.delete(f"/api/v1/admin/announcements/{ann_id}", headers=admin_headers)
    assert del_res.status_code == 204
