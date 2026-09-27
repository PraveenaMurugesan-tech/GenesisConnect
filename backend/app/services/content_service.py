# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Site Content Service (Homepage, Contact Info & CMS Content)
# ==============================================================================

from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.site_content import SiteContent
from app.schemas.site_content import HomepageContentSchema, ContactInfoSchema

DEFAULT_HOMEPAGE_CONTENT: Dict[str, Any] = {
    "hero_heading": "Engineered Power Resilience for Mission-Critical Infrastructure",
    "hero_subheading": "Industrial UPS systems, servo stabilizers, and turnkey power conditioning engineered for healthcare and demanding manufacturing environments.",
    "primary_cta_text": "Explore Equipment",
    "primary_cta_link": "/products",
    "secondary_cta_text": "Request a Quote",
    "secondary_cta_link": "/request-quote",
    "featured_product_slugs": [
        "industrial-ups",
        "ct-scanner-ups",
        "igbt-static-voltage-stabilizers",
        "servo-stabilizers",
    ],
    "featured_service_slugs": [
        "annual-maintenance-contracts",
        "preventive-corrective-maintenance",
        "power-quality-audit",
        "load-bank-testing-commissioning",
    ],
}

DEFAULT_CONTACT_INFO: Dict[str, Any] = {
    "company_name": "Genesis Power Equipments Pvt. Ltd.",
    "brand_name": "Genesis Power Equipments",
    "tagline": "Industrial Power Protection & Engineering Solutions",
    "address_line1": "Industrial Estate, Guindy",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "postal_code": "600032",
    "country": "India",
    "phone_board": "+91 (0) 44 2498 0000",
    "phone_hotline": "+91 98400 12345",
    "email_general": "info@genesispower.in",
    "email_sales": "sales@genesispower.in",
    "email_support": "support@genesispower.in",
    "office_hours": "Monday – Saturday: 8:30 AM – 6:30 PM",
    "support_hours": "24/7 Breakdown & Emergency Support Coverage",
}


class ContentService:
    """Service governing structured site content retrieval and updates."""

    def __init__(self, db: Session):
        self.db = db

    def get_section_data(self, key: str, default: Dict[str, Any]) -> Dict[str, Any]:
        """Fetch content dictionary for a given section key, falling back to default."""
        content = self.db.query(SiteContent).filter(SiteContent.key == key).first()
        if not content or not content.data:
            return default
        # Merge stored data with defaults to ensure all fields are present
        merged = {**default, **content.data}
        return merged

    def update_section_data(self, key: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update a content section."""
        content = self.db.query(SiteContent).filter(SiteContent.key == key).first()
        if content:
            content.data = data
        else:
            content = SiteContent(key=key, data=data)
            self.db.add(content)

        self.db.commit()
        self.db.refresh(content)
        return content.data

    def get_homepage_content(self) -> HomepageContentSchema:
        raw = self.get_section_data("homepage", DEFAULT_HOMEPAGE_CONTENT)
        return HomepageContentSchema.model_validate(raw)

    def update_homepage_content(self, payload: HomepageContentSchema) -> HomepageContentSchema:
        updated = self.update_section_data("homepage", payload.model_dump())
        return HomepageContentSchema.model_validate(updated)

    def get_contact_info(self) -> ContactInfoSchema:
        raw = self.get_section_data("contact_info", DEFAULT_CONTACT_INFO)
        return ContactInfoSchema.model_validate(raw)

    def update_contact_info(self, payload: ContactInfoSchema) -> ContactInfoSchema:
        updated = self.update_section_data("contact_info", payload.model_dump())
        return ContactInfoSchema.model_validate(updated)
