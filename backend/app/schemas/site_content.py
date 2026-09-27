# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# CMS Content Schemas (Homepage, Contact Information, Structured Copy)
# ==============================================================================

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class HomepageContentSchema(BaseModel):
    """Controlled schema for administrative homepage content management."""
    hero_heading: str = Field(
        default="Engineered Power Resilience for Mission-Critical Infrastructure",
        min_length=5,
        max_length=255,
    )
    hero_subheading: str = Field(
        default="Industrial UPS systems, servo stabilizers, and turnkey power conditioning engineered for healthcare and demanding manufacturing environments.",
        min_length=10,
        max_length=1000,
    )
    primary_cta_text: str = Field(default="Explore Equipment", max_length=50)
    primary_cta_link: str = Field(default="/products", max_length=255)
    secondary_cta_text: str = Field(default="Request a Quote", max_length=50)
    secondary_cta_link: str = Field(default="/request-quote", max_length=255)
    featured_product_slugs: List[str] = Field(default_factory=list)
    featured_service_slugs: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class ContactInfoSchema(BaseModel):
    """Controlled schema for corporate business contact information."""
    company_name: str = Field(default="Genesis Power Equipments Pvt. Ltd.", max_length=255)
    brand_name: str = Field(default="Genesis Power Equipments", max_length=255)
    tagline: str = Field(default="Industrial Power Protection & Engineering Solutions", max_length=255)
    address_line1: str = Field(default="Industrial Estate, Guindy", max_length=255)
    city: str = Field(default="Chennai", max_length=100)
    state: str = Field(default="Tamil Nadu", max_length=100)
    postal_code: str = Field(default="600032", max_length=20)
    country: str = Field(default="India", max_length=100)
    phone_board: str = Field(default="+91 (0) 44 2498 0000", max_length=50)
    phone_hotline: str = Field(default="+91 98400 12345", max_length=50)
    email_general: str = Field(default="info@genesispower.in", max_length=100)
    email_sales: str = Field(default="sales@genesispower.in", max_length=100)
    email_support: str = Field(default="support@genesispower.in", max_length=100)
    office_hours: str = Field(default="Monday – Saturday: 8:30 AM – 6:30 PM", max_length=255)
    support_hours: str = Field(default="24/7 Breakdown & Emergency Support Coverage", max_length=255)

    model_config = ConfigDict(from_attributes=True)


class SiteContentResponse(BaseModel):
    key: str
    data: Dict[str, Any]
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
