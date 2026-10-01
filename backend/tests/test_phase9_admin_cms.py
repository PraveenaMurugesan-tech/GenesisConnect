# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 9 Final Validation: Admin Authentication & CMS Operations
# ==============================================================================

import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import UserRole
from app.repositories.admin_repository import AdminRepository


def test_admin_auth_flows(client: TestClient):
    """Verify admin login success, bad credentials, and /auth/me profile verification."""
    email = "admin@genesispower.in"
    password = "AdminPassword123!"

    # 1. Invalid login
    res_bad = client.post("/api/v1/auth/login", json={"email": email, "password": "WrongPassword"})
    assert res_bad.status_code == 401
    assert "Invalid email or password" in res_bad.json()["detail"]

    # 2. Valid login
    res_ok = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert res_ok.status_code == 200
    token = res_ok.json()["access_token"]
    assert token is not None

    # 3. Auth me
    res_me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["email"] == email
    assert "password" not in res_me.json()


def test_admin_product_cms_lifecycle(client: TestClient, admin_headers: dict):
    """Verify admin product creation, update, deactivation, and deletion."""
    unique_slug = f"validation-product-{uuid.uuid4().hex[:8]}"
    create_payload = {
        "name": "Phase 9 Validation Harmonic Stabilizer",
        "slug": unique_slug,
        "category": "Voltage Stabilizers",
        "short_description": "Precision active stabilizer for sensitive testing.",
        "description": "Engineered for high-precision testing facilities with stringent THD compliance.",
        "specifications": {
            "Voltage Regulation": "+/- 1%",
            "Correction Speed": "70 V/sec",
        },
        "is_active": True,
    }

    # 1. Create
    res_create = client.post("/api/v1/admin/products", json=create_payload, headers=admin_headers)
    assert res_create.status_code == 201
    prod_id = res_create.json()["id"]

    # 2. Update
    res_update = client.put(
        f"/api/v1/admin/products/{prod_id}",
        json={"short_description": "Updated precision active stabilizer."},
        headers=admin_headers,
    )
    assert res_update.status_code == 200
    assert res_update.json()["short_description"] == "Updated precision active stabilizer."

    # 3. Deactivate
    res_status = client.patch(f"/api/v1/admin/products/{prod_id}/status", headers=admin_headers)
    assert res_status.status_code == 200
    assert res_status.json()["is_active"] is False

    # 4. Verify public catalogue does not include the deactivated product
    pub_res = client.get(f"/api/v1/products/{unique_slug}")
    assert pub_res.status_code == 404

    # 5. Delete
    res_del = client.delete(f"/api/v1/admin/products/{prod_id}", headers=admin_headers)
    assert res_del.status_code == 204


def test_admin_services_and_announcements_cms(client: TestClient, admin_headers: dict):
    """Verify admin service and announcement management."""
    # Service CRUD
    srv_slug = f"validation-service-{uuid.uuid4().hex[:6]}"
    srv_res = client.post(
        "/api/v1/admin/services",
        json={
            "title": "On-Site Power Quality Analysis",
            "slug": srv_slug,
            "description": "Comprehensive IEEE 519 compliance audit.",
            "is_active": True,
        },
        headers=admin_headers,
    )
    assert srv_res.status_code == 201
    srv_id = srv_res.json()["id"]

    # Announcement CRUD
    ann_res = client.post(
        "/api/v1/admin/announcements",
        json={
            "title": f"Validation Announcement {uuid.uuid4().hex[:4]}",
            "content": "Official testing notice for Phase 9 handover.",
            "is_active": True,
        },
        headers=admin_headers,
    )
    assert ann_res.status_code == 201
    ann_id = ann_res.json()["id"]

    # Clean up
    client.delete(f"/api/v1/admin/services/{srv_id}", headers=admin_headers)
    client.delete(f"/api/v1/admin/announcements/{ann_id}", headers=admin_headers)
