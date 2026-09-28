# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 7: Customer Enquiry & Quotation System Tests
# ==============================================================================

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.enquiry import (
    QuoteRequest,
    QuoteStatus,
    CustomRequirement,
    RequirementStatus,
    ContactMessage,
    ContactStatus,
)


# ==============================================================================
# 1. Quote Request Endpoint Tests
# ==============================================================================

def test_create_quote_request_success(client: TestClient, db_session: Session):
    """Test public submission of a valid quote request with referenced product."""
    product = db_session.query(Product).first()
    product_id = product.id if product else None

    payload = {
        "customer_name": "Dr. V. Sundaram",
        "company_name": "Apollo Diagnostic Hospital",
        "email": "procurement@apollohospitals.org",
        "phone": "+91 98400 12345",
        "product_id": product_id,
        "product_name": "CT Scanner Online UPS",
        "quantity": "2 units",
        "requirement": "Hospital diagnostic suite require 3-phase isolation.",
        "message": "Immediate requirement for Chennai facility.",
    }

    response = client.post("/api/v1/quote-requests", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["customer_name"] == payload["customer_name"]
    assert data["company_name"] == payload["company_name"]
    assert data["email"] == payload["email"]
    assert data["status"] == "NEW"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_quote_request_backwards_compatible_route(client: TestClient):
    """Verify alias /api/v1/quotes route accepts submissions."""
    payload = {
        "customer_name": "Mr. K. Anand",
        "company_name": "Precision Auto Parts",
        "email": "k.anand@precisionauto.co.in",
        "phone": "+91 98840 55555",
        "message": "Quotation for 100 kVA Servo Stabilizer",
    }
    response = client.post("/api/v1/quotes", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "NEW"


def test_create_quote_request_invalid_input(client: TestClient):
    """Test validation errors on missing required fields or bad email."""
    # Invalid email
    bad_email = {
        "customer_name": "Testing User",
        "email": "not-an-email",
        "phone": "9840000000",
    }
    res = client.post("/api/v1/quote-requests", json=bad_email)
    assert res.status_code in [400, 422]

    # Missing name
    missing_name = {
        "email": "valid@email.com",
        "phone": "9840000000",
    }
    res2 = client.post("/api/v1/quote-requests", json=missing_name)
    assert res2.status_code in [400, 422]


def test_create_quote_request_invalid_product_reference(client: TestClient):
    """Test that referencing a non-existent product_id returns 400 Bad Request."""
    payload = {
        "customer_name": "Factory Lead",
        "email": "lead@manufacturing.in",
        "phone": "+91 98400 99999",
        "product_id": 999999,
        "message": "Invalid product ID reference check",
    }
    response = client.post("/api/v1/quote-requests", json=payload)
    assert response.status_code == 400
    assert "does not exist" in response.json()["detail"]


def test_admin_list_and_filter_quote_requests(client: TestClient, admin_headers: dict):
    """Test admin list, search, and status filtering for quote requests."""
    # Submit test quote
    client.post(
        "/api/v1/quote-requests",
        json={
            "customer_name": "Unique Searchable Name",
            "company_name": "Searchable Engineering Ltd",
            "email": "searchable@example.com",
            "phone": "+91 99999 88888",
            "message": "Testing admin search filter",
        },
    )

    # Admin list
    res = client.get("/api/v1/admin/quote-requests", headers=admin_headers)
    assert res.status_code == 200
    records = res.json()
    assert len(records) >= 1

    # Filter by search
    res_search = client.get(
        "/api/v1/admin/quote-requests?search=Unique Searchable",
        headers=admin_headers,
    )
    assert res_search.status_code == 200
    searched = res_search.json()
    assert len(searched) >= 1
    assert any("Unique Searchable Name" in item["customer_name"] for item in searched)

    # Filter by status
    res_status = client.get(
        "/api/v1/admin/quote-requests?status=NEW",
        headers=admin_headers,
    )
    assert res_status.status_code == 200
    for item in res_status.json():
        assert item["status"] == "NEW"


def test_admin_get_quote_request_detail(client: TestClient, admin_headers: dict):
    """Test retrieving individual quote request by ID."""
    created = client.post(
        "/api/v1/quote-requests",
        json={
            "customer_name": "Detailed Client",
            "email": "client@detail.com",
            "phone": "9876543210",
            "message": "Detail view verification",
        },
    ).json()

    res = client.get(f"/api/v1/admin/quote-requests/{created['id']}", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == created["id"]
    assert data["customer_name"] == "Detailed Client"


def test_admin_get_quote_request_not_found(client: TestClient, admin_headers: dict):
    """Test 404 for non-existent quote request."""
    res = client.get("/api/v1/admin/quote-requests/999999", headers=admin_headers)
    assert res.status_code == 404


def test_admin_update_quote_request_status_lifecycle(client: TestClient, admin_headers: dict):
    """Test valid status transitions (NEW -> CONTACTED -> IN_PROGRESS -> QUOTED -> CLOSED)."""
    created = client.post(
        "/api/v1/quote-requests",
        json={
            "customer_name": "Lifecycle Customer",
            "email": "lifecycle@test.com",
            "phone": "9840001234",
            "message": "Testing lifecycle transitions",
        },
    ).json()
    quote_id = created["id"]

    # Transition to CONTACTED
    res1 = client.patch(
        f"/api/v1/admin/quote-requests/{quote_id}/status",
        json={"status": "CONTACTED"},
        headers=admin_headers,
    )
    assert res1.status_code == 200
    assert res1.json()["status"] == "CONTACTED"

    # Transition to IN_PROGRESS
    res2 = client.patch(
        f"/api/v1/admin/quote-requests/{quote_id}/status",
        json={"status": "IN_PROGRESS"},
        headers=admin_headers,
    )
    assert res2.status_code == 200
    assert res2.json()["status"] == "IN_PROGRESS"

    # Transition to QUOTED
    res3 = client.patch(
        f"/api/v1/admin/quote-requests/{quote_id}/status",
        json={"status": "QUOTED"},
        headers=admin_headers,
    )
    assert res3.status_code == 200
    assert res3.json()["status"] == "QUOTED"

    # Transition to CLOSED
    res4 = client.patch(
        f"/api/v1/admin/quote-requests/{quote_id}/status",
        json={"status": "CLOSED"},
        headers=admin_headers,
    )
    assert res4.status_code == 200
    assert res4.json()["status"] == "CLOSED"


def test_admin_update_quote_invalid_status(client: TestClient, admin_headers: dict):
    """Test rejecting arbitrary status values."""
    created = client.post(
        "/api/v1/quote-requests",
        json={
            "customer_name": "Arbitrary Status Test",
            "email": "arbitrary@test.com",
            "phone": "9840001234",
        },
    ).json()

    res = client.patch(
        f"/api/v1/admin/quote-requests/{created['id']}/status",
        json={"status": "ARBITRARY_STATUS"},
        headers=admin_headers,
    )
    assert res.status_code in [400, 422]


def test_quote_request_unauthorized_access(client: TestClient):
    """Test that unauthenticated public requests cannot list or modify quote requests."""
    res_list = client.get("/api/v1/admin/quote-requests")
    assert res_list.status_code == 401

    res_detail = client.get("/api/v1/admin/quote-requests/1")
    assert res_detail.status_code == 401

    res_status = client.patch("/api/v1/admin/quote-requests/1/status", json={"status": "CLOSED"})
    assert res_status.status_code == 401

    res_public_list = client.get("/api/v1/quote-requests")
    assert res_public_list.status_code == 401


# ==============================================================================
# 2. Custom Requirement Endpoint Tests
# ==============================================================================

def test_create_custom_requirement_success(client: TestClient):
    """Test public submission of complex technical power requirement."""
    payload = {
        "customer_name": "R. Balakrishnan",
        "company_name": "Apex Semiconductor Fab",
        "email": "facilities@apexsemi.com",
        "phone": "+91 94440 98765",
        "product": "CVCF Static Frequency Converter",
        "capacity": "400 kVA",
        "battery_specifications": "Lithium Iron Phosphate (LiFePO4) external bank",
        "backup_requirements": "30 minutes runtime at full rated load",
        "equipment_information": "Cleanroom photolithography tools, high inrush current",
        "additional_requirements": "Input galvanic isolation and dual static bypass",
        "document_url": "attachment:specs_sheet_rev3.pdf",
    }
    response = client.post("/api/v1/custom-requirements", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["customer_name"] == payload["customer_name"]
    assert data["capacity"] == "400 kVA"
    assert data["status"] == "NEW"
    assert "id" in data
    assert "created_at" in data


def test_create_custom_requirement_invalid_email(client: TestClient):
    """Test validation failure on bad email in custom requirement."""
    payload = {
        "customer_name": "Testing Rep",
        "email": "bad-email-format",
        "phone": "9840012345",
        "capacity": "100 kVA",
    }
    response = client.post("/api/v1/custom-requirements", json=payload)
    assert response.status_code in [400, 422]


def test_admin_custom_requirements_workflow(client: TestClient, admin_headers: dict):
    """Test admin list, detail view, search, and status update for custom requirements."""
    created = client.post(
        "/api/v1/custom-requirements",
        json={
            "customer_name": "Dr. A. Natesan",
            "company_name": "Apollo Cath Lab Division",
            "email": "natesan@apollocath.com",
            "phone": "+91 98401 22334",
            "product": "Healthcare Cath Lab UPS",
            "capacity": "160 kVA",
            "equipment_information": "Siemens Artis Zee Fluoroscopy Suite",
        },
    ).json()
    req_id = created["id"]

    # Admin list
    res_list = client.get("/api/v1/admin/custom-requirements", headers=admin_headers)
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1

    # Admin search
    res_search = client.get(
        "/api/v1/admin/custom-requirements?search=Natesan",
        headers=admin_headers,
    )
    assert res_search.status_code == 200
    assert len(res_search.json()) >= 1

    # Admin detail
    res_detail = client.get(f"/api/v1/admin/custom-requirements/{req_id}", headers=admin_headers)
    assert res_detail.status_code == 200
    assert res_detail.json()["customer_name"] == "Dr. A. Natesan"

    # Admin status update
    res_status = client.patch(
        f"/api/v1/admin/custom-requirements/{req_id}/status",
        json={"status": "IN_PROGRESS"},
        headers=admin_headers,
    )
    assert res_status.status_code == 200
    assert res_status.json()["status"] == "IN_PROGRESS"


def test_custom_requirements_unauthorized_access(client: TestClient):
    """Test unauthenticated requests are blocked from admin custom requirements."""
    res1 = client.get("/api/v1/admin/custom-requirements")
    assert res1.status_code == 401

    res2 = client.get("/api/v1/custom-requirements")
    assert res2.status_code == 401

    res3 = client.patch("/api/v1/admin/custom-requirements/1/status", json={"status": "CLOSED"})
    assert res3.status_code == 401


# ==============================================================================
# 3. Contact Message Endpoint Tests
# ==============================================================================

def test_create_contact_message_success(client: TestClient):
    """Test public submission of a general inquiry message."""
    payload = {
        "name": "M. Sivakumar",
        "company_name": "Tirupur Garments Export Pvt Ltd",
        "email": "siva@tirupurexports.com",
        "phone": "+91 94432 11111",
        "subject": "Annual Maintenance Contract Inquiry",
        "message": "We have 4 Genesis 60 kVA UPS systems installed in 2021. Requesting AMC proposal.",
    }
    response = client.post("/api/v1/contact-messages", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["subject"] == payload["subject"]
    assert data["status"] == "UNREAD"
    assert "id" in data
    assert "created_at" in data


def test_create_contact_message_alias_route(client: TestClient):
    """Test submission via /api/v1/contact alias."""
    payload = {
        "name": "General Inquirer",
        "email": "general@inquiry.com",
        "message": "General question regarding stabilizer sizing.",
    }
    response = client.post("/api/v1/contact", json=payload)
    assert response.status_code == 201
    assert response.json()["status"] == "UNREAD"


def test_create_contact_message_invalid(client: TestClient):
    """Test validation errors for contact messages."""
    # Empty message
    res = client.post(
        "/api/v1/contact-messages",
        json={"name": "Test", "email": "valid@email.com", "message": "a"},
    )
    assert res.status_code in [400, 422]


def test_admin_contact_messages_workflow(client: TestClient, admin_headers: dict):
    """Test admin list, detail view, search, and status update for contact messages."""
    created = client.post(
        "/api/v1/contact-messages",
        json={
            "name": "G. Venkatesh",
            "company_name": "Madras Logistics Hub",
            "email": "venkatesh@madraslogistics.in",
            "phone": "+91 98402 33445",
            "subject": "Warehouse Stabilizer Sizing",
            "message": "High voltage fluctuations damaging sorting conveyers.",
        },
    ).json()
    msg_id = created["id"]

    # Admin list
    res_list = client.get("/api/v1/admin/contact-messages", headers=admin_headers)
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1

    # Admin search
    res_search = client.get(
        "/api/v1/admin/contact-messages?search=Venkatesh",
        headers=admin_headers,
    )
    assert res_search.status_code == 200
    assert len(res_search.json()) >= 1

    # Admin detail
    res_detail = client.get(f"/api/v1/admin/contact-messages/{msg_id}", headers=admin_headers)
    assert res_detail.status_code == 200
    assert res_detail.json()["name"] == "G. Venkatesh"

    # Admin status update to READ then REPLIED
    res_read = client.patch(
        f"/api/v1/admin/contact-messages/{msg_id}/status",
        json={"status": "READ"},
        headers=admin_headers,
    )
    assert res_read.status_code == 200
    assert res_read.json()["status"] == "READ"

    res_replied = client.patch(
        f"/api/v1/admin/contact-messages/{msg_id}/status",
        json={"status": "REPLIED"},
        headers=admin_headers,
    )
    assert res_replied.status_code == 200
    assert res_replied.json()["status"] == "REPLIED"


def test_contact_messages_unauthorized_access(client: TestClient):
    """Test unauthenticated users cannot list or modify contact messages."""
    res1 = client.get("/api/v1/admin/contact-messages")
    assert res1.status_code == 401

    res2 = client.get("/api/v1/contact-messages")
    assert res2.status_code == 401

    res3 = client.patch("/api/v1/admin/contact-messages/1/status", json={"status": "CLOSED"})
    assert res3.status_code == 401


# ==============================================================================
# 4. Admin Dashboard Metrics Integration
# ==============================================================================

def test_admin_dashboard_enquiry_metrics(client: TestClient, admin_headers: dict):
    """Verify GET /api/v1/admin/dashboard returns populated enquiry_counts object."""
    response = client.get("/api/v1/admin/dashboard", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert "enquiry_counts" in data
    counts = data["enquiry_counts"]
    assert "new_quote_requests" in counts
    assert "open_custom_requirements" in counts
    assert "new_contact_messages" in counts
    assert "total_enquiries" in counts
    assert counts["total_enquiries"] >= 0
