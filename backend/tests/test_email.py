# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 8 Email Notification Service & Non-Blocking Resilience Test Suite
# ==============================================================================

import pytest
from fastapi.testclient import TestClient
from app.services.email import (
    email_service,
    ConsoleEmailProvider,
    BaseEmailProvider,
    EmailDeliveryError,
)
from app.services.email.templates import (
    render_quote_confirmation_email,
    render_custom_requirement_confirmation_email,
    render_contact_confirmation_email,
    render_admin_notification_email,
)


class FailingEmailProvider(BaseEmailProvider):
    """Simulated failing email transport provider."""
    def send_email(self, to_email: str, subject: str, html_body: str, text_body=None, from_email=None):
        raise EmailDeliveryError("Connection to upstream mail transfer agent timed out (504).")


@pytest.fixture(autouse=True)
def isolated_console_email_provider():
    """Ensure every test runs with an isolated, clean ConsoleEmailProvider."""
    original_provider = email_service.provider
    test_console = ConsoleEmailProvider()
    email_service.set_provider(test_console)
    yield test_console
    email_service.set_provider(original_provider)


# ==============================================================================
# 1. Template Rendering & Security Invariants
# ==============================================================================
def test_quote_confirmation_email_template():
    subject, html_body, text_body = render_quote_confirmation_email(
        customer_name="R. Sundaram",
        reference_id="GEN-QUO-00101",
        product_name="150 kVA Industrial UPS",
        quantity="2 units",
        created_at_str="2026-09-30 18:00:00 UTC",
    )
    assert "GEN-QUO-00101" in subject
    assert "Genesis Power Equipments" in subject
    assert "R. Sundaram" in html_body
    assert "150 kVA Industrial UPS" in html_body
    assert "GEN-QUO-00101" in text_body
    # Ensure no credentials or debug leaks
    assert "password" not in html_body.lower()
    assert "secret" not in html_body.lower()
    assert "jwt" not in html_body.lower()


def test_custom_requirement_email_template():
    subject, html_body, text_body = render_custom_requirement_confirmation_email(
        customer_name="Dr. K. Ananth",
        reference_id="GEN-REQ-00055",
        product_category="Healthcare / Cath Lab UPS",
        capacity="200 kVA",
        has_attachment=True,
    )
    assert "GEN-REQ-00055" in subject
    assert "Dr. K. Ananth" in html_body
    assert "Cath Lab UPS" in html_body
    assert "technical vault" in html_body.lower()
    assert "password" not in html_body.lower()


def test_admin_notification_email_template():
    subject, html_body, text_body = render_admin_notification_email(
        enquiry_type="Customized Requirement",
        reference_id="GEN-REQ-00099",
        customer_name="P. Ramesh",
        company_name="Apollo Diagnostics Hub",
        email="ramesh@apollodiag.in",
        phone="+91 98400 11223",
        summary_details={
            "Capacity": "300 kVA",
            "Harmonic Mitigation": "12-Pulse with Active Filter",
        },
    )
    assert "[New Enquiry]" in subject
    assert "P. Ramesh" in subject
    assert "Apollo Diagnostics Hub" in html_body
    assert "ramesh@apollodiag.in" in html_body
    assert "+91 98400 11223" in html_body
    assert "300 kVA" in html_body


# ==============================================================================
# 2. Email Service Dispatching & Recording
# ==============================================================================
def test_email_service_dispatches_customer_and_admin(isolated_console_email_provider: ConsoleEmailProvider):
    # Customer confirmation
    success = email_service.send_quote_confirmation(
        customer_name="Test Customer",
        customer_email="customer@example.com",
        reference_id="GEN-QUO-99999",
        product_name="Servo Stabilizer",
        quantity="1 unit",
    )
    assert success is True

    # Admin notification
    admin_success = email_service.send_admin_notification(
        enquiry_type="Quote Request",
        reference_id="GEN-QUO-99999",
        customer_name="Test Customer",
        email="customer@example.com",
        phone="+91 99999 88888",
        summary_details={"Product": "Servo Stabilizer"},
    )
    assert admin_success is True

    assert len(isolated_console_email_provider.sent_emails) == 2
    assert isolated_console_email_provider.sent_emails[0]["to"] == "customer@example.com"


# ==============================================================================
# 3. Non-Blocking Resilience: Persistence succeeds even if email fails
# ==============================================================================
def test_quote_submission_persists_even_if_email_fails(client: TestClient):
    """
    CRITICAL ARCHITECTURE REQUIREMENT:
    An upstream SMTP or email API timeout/crash must NEVER abort or roll back
    the saving of a quote request.
    """
    email_service.set_provider(FailingEmailProvider())

    response = client.post(
        "/api/v1/quote-requests",
        json={
            "customer_name": "S. Natarajan",
            "company_name": "Natarajan Heavy Foundry",
            "email": "natarajan@foundry.in",
            "phone": "+91 94441 22334",
            "quantity": "1 system",
            "requirement": "Immunity against welding arc voltage dips",
        },
    )
    # The API call must still succeed with HTTP 201 Created
    assert response.status_code == 201
    data = response.json()
    assert data["customer_name"] == "S. Natarajan"
    assert data["id"] > 0


def test_custom_requirement_persists_even_if_email_fails(client: TestClient):
    email_service.set_provider(FailingEmailProvider())

    response = client.post(
        "/api/v1/custom-requirements",
        json={
            "customer_name": "T. Vasudevan",
            "company_name": "Apex Micro-Electronics",
            "email": "vasudevan@apexmicro.in",
            "phone": "+91 97890 55667",
            "capacity": "500 kVA",
            "equipment_information": "Cleanroom photolithography line requiring ultra-low THDi",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["customer_name"] == "T. Vasudevan"
    assert data["id"] > 0


def test_contact_message_persists_even_if_email_fails(client: TestClient):
    email_service.set_provider(FailingEmailProvider())

    response = client.post(
        "/api/v1/contact-messages",
        json={
            "name": "K. Meenakshi",
            "company_name": "Meenakshi Power Labs",
            "email": "meenakshi@powerlabs.in",
            "phone": "+91 98840 99887",
            "subject": "Annual Maintenance AMC",
            "message": "Inquiry regarding OEM AMC coverage for 3 existing Genesis UPS units.",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "K. Meenakshi"
    assert data["id"] > 0
