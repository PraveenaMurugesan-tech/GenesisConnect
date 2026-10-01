# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 9 Final Validation: Public Website & Catalogue Workflows
# ==============================================================================

import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.service import Service


def test_public_health_and_root_endpoints(client: TestClient):
    """Verify system health probe and root info endpoint."""
    health_res = client.get("/api/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "ok"

    root_res = client.get("/")
    assert root_res.status_code == 200
    root_data = root_res.json()
    assert root_data["system"] == "GenesisConnect API"
    assert root_data["client"] == "Genesis Power Equipments Pvt. Ltd."
    assert root_data["status"] == "online"


def test_public_catalogue_active_products_only(client: TestClient, db_session: Session):
    """Verify that the public catalogue only returns active products."""
    # Create an inactive product
    inactive_slug = f"inactive-test-equipment-{uuid.uuid4().hex[:6]}"
    inactive_product = Product(
        name="Decommissioned Heavy Inverter",
        slug=inactive_slug,
        category="Inverters",
        description="Legacy unit kept for internal archival only.",
        is_active=False,
    )
    db_session.add(inactive_product)
    db_session.commit()

    # Query public products
    res = client.get("/api/v1/products")
    assert res.status_code == 200
    products = res.json()
    assert isinstance(products, list)
    assert len(products) > 0

    # Ensure the inactive product does not appear in public catalogue
    slugs = [p["slug"] for p in products]
    assert inactive_slug not in slugs

    # Ensure public slug lookup for inactive product returns 404
    detail_res = client.get(f"/api/v1/products/{inactive_slug}")
    assert detail_res.status_code == 404


def test_public_catalogue_search_and_filter(client: TestClient, db_session: Session):
    """Verify product search and category filtering in public endpoints."""
    # 1. Category filter
    res_ups = client.get("/api/v1/products?category=UPS")
    assert res_ups.status_code == 200
    ups_products = res_ups.json()
    assert len(ups_products) > 0
    for p in ups_products:
        assert p["category"] == "UPS"

    # 2. Text search
    res_search = client.get("/api/v1/products?search=Office")
    assert res_search.status_code == 200
    search_products = res_search.json()
    assert len(search_products) >= 1
    assert any("Office" in p["name"] or "Office" in (p.get("description") or "") for p in search_products)


def test_public_services_and_content_endpoints(client: TestClient):
    """Verify public CMS content endpoints (services, homepage, contact, announcements)."""
    # Services
    srv_res = client.get("/api/v1/services")
    assert srv_res.status_code == 200
    assert isinstance(srv_res.json(), list)

    # Homepage Content
    home_res = client.get("/api/v1/content/homepage")
    assert home_res.status_code == 200
    assert "hero_heading" in home_res.json()

    # Contact Info
    contact_res = client.get("/api/v1/content/contact")
    assert contact_res.status_code == 200
    assert "company_name" in contact_res.json()

    # Announcements
    ann_res = client.get("/api/v1/announcements")
    assert ann_res.status_code == 200
    assert isinstance(ann_res.json(), list)
