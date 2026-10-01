# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 9 Final Validation: Enquiry Workflows & Lifecycle Transitions
# ==============================================================================

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.product import Product


def test_quote_request_full_lifecycle(client: TestClient, admin_headers: dict, db_session: Session):
    """Verify quote request submission, product association, and status progression."""
    # Find existing product
    product = db_session.query(Product).first()
    product_id = product.id if product else None

    # 1. Submit Quote
    quote_payload = {
        "customer_name": "S. Ramachandran",
        "company_name": "Madras Toolworks Pvt. Ltd.",
        "email": "ramachandran@madrastools.in",
        "phone": "+91 98401 23456",
        "product_id": product_id,
        "product_name": product.name if product else "Industrial UPS",
        "quantity": "3 units",
        "requirement": "Continuous CNC machining center power backup.",
        "message": "Urgent requirement for plant expansion in Ambattur.",
    }
    create_res = client.post("/api/v1/quote-requests", json=quote_payload)
    assert create_res.status_code == 201
    quote = create_res.json()
    assert quote["status"] == "NEW"
    quote_id = quote["id"]

    # 2. Admin retrieves quote
    detail_res = client.get(f"/api/v1/admin/quote-requests/{quote_id}", headers=admin_headers)
    assert detail_res.status_code == 200
    assert detail_res.json()["customer_name"] == "S. Ramachandran"

    # 3. Status progression: NEW -> CONTACTED -> IN_PROGRESS -> QUOTED -> CLOSED
    for next_status in ["CONTACTED", "IN_PROGRESS", "QUOTED", "CLOSED"]:
        patch_res = client.patch(
            f"/api/v1/admin/quote-requests/{quote_id}/status",
            json={"status": next_status},
            headers=admin_headers,
        )
        assert patch_res.status_code == 200
        assert patch_res.json()["status"] == next_status


def test_customized_requirement_submission_and_retrieval(client: TestClient, admin_headers: dict):
    """Verify custom requirement submission with engineering fields and admin retrieval."""
    custom_payload = {
        "customer_name": "Dr. K. Swaminathan",
        "company_name": "Tamil Nadu Advanced Diagnostics",
        "email": "k.swaminathan@tndiagnostics.in",
        "phone": "+91 94440 98765",
        "product": "Medical Power Solutions",
        "capacity": "150 kVA / 120 kW (3-Phase 415V)",
        "battery_specifications": "12V SMF VRLA with 30-minute full-load autonomy",
        "backup_requirements": "30 minutes runtime at 100% capacity",
        "equipment_information": "Siemens Somatom Definition CT Scanner with pulsed inrush current",
        "additional_requirements": "Galvanic isolation transformer integrated in enclosure",
        "document_url": "enquiries/documents/2026/10/ct_specs.pdf",
        "document_name": "CT_Scanner_Single_Line_Diagram.pdf",
    }
    create_res = client.post("/api/v1/custom-requirements", json=custom_payload)
    assert create_res.status_code == 201
    req = create_res.json()
    assert req["status"] == "NEW"
    assert req["document_name"] == "CT_Scanner_Single_Line_Diagram.pdf"
    req_id = req["id"]

    # Admin detail lookup
    admin_res = client.get(f"/api/v1/admin/custom-requirements/{req_id}", headers=admin_headers)
    assert admin_res.status_code == 200
    assert admin_res.json()["equipment_information"] == custom_payload["equipment_information"]

    # Status update to CONTACTED
    patch_res = client.patch(
        f"/api/v1/admin/custom-requirements/{req_id}/status",
        json={"status": "CONTACTED"},
        headers=admin_headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "CONTACTED"


def test_contact_message_submission_and_lifecycle(client: TestClient, admin_headers: dict):
    """Verify general contact message submission and admin status updates."""
    contact_payload = {
        "name": "N. Venkatesh",
        "company_name": "Coimbatore Foundry Works",
        "email": "venkatesh@cbedfoundry.in",
        "phone": "+91 98422 11223",
        "subject": "Inquiry regarding IGBT Static Stabilizer AMC",
        "message": "We have two 250 kVA stabilizers that require certified annual maintenance overhaul.",
    }
    create_res = client.post("/api/v1/contact", json=contact_payload)
    assert create_res.status_code == 201
    msg_id = create_res.json()["id"]

    # Admin message lookup
    admin_res = client.get(f"/api/v1/admin/contact-messages/{msg_id}", headers=admin_headers)
    assert admin_res.status_code == 200
    assert admin_res.json()["email"] == contact_payload["email"]

    # Mark as READ
    patch_res = client.patch(
        f"/api/v1/admin/contact-messages/{msg_id}/status",
        json={"status": "READ"},
        headers=admin_headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "READ"
