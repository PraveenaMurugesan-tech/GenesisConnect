from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from app.models.enquiry import QuoteStatus, RequirementStatus, ContactStatus
from app.schemas.product import ProductResponse


# ==============================================================================
# Quote Request Schemas
# ==============================================================================

class QuoteRequestBase(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=255, description="Contact person full name")
    company_name: Optional[str] = Field(None, max_length=255, description="Company or facility name")
    email: EmailStr = Field(..., description="Official business email address")
    phone: str = Field(..., min_length=5, max_length=50, description="Telephone or mobile number")
    product_id: Optional[int] = Field(None, ge=1, description="Referenced catalogue product ID")
    product_name: Optional[str] = Field(None, max_length=255, description="Selected equipment name or line")
    quantity: Optional[str] = Field(None, max_length=50, description="Requested units or volume")
    requirement: Optional[str] = Field(None, description="Detailed equipment or technical requirement")
    message: Optional[str] = Field(None, description="Additional customer project notes")


class QuoteRequestCreate(QuoteRequestBase):
    pass


class QuoteRequestUpdateStatus(BaseModel):
    status: QuoteStatus = Field(..., description="Target lifecycle status")


class QuoteRequestResponse(QuoteRequestBase):
    id: int
    status: QuoteStatus
    created_at: datetime
    updated_at: datetime
    product: Optional[ProductResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Customized Requirement Schemas
# ==============================================================================

class CustomRequirementBase(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=255, description="Contact representative name")
    company_name: Optional[str] = Field(None, max_length=255, description="Company or plant name")
    email: EmailStr = Field(..., description="Official business email address")
    phone: str = Field(..., min_length=5, max_length=50, description="Contact telephone or mobile")
    product: Optional[str] = Field(None, max_length=255, description="Product line or equipment classification")
    capacity: Optional[str] = Field(None, max_length=100, description="Estimated power rating or capacity (e.g., 100 kVA)")
    battery_specifications: Optional[str] = Field(None, max_length=255, description="VRLA, Li-ion, autonomy requirements")
    backup_requirements: Optional[str] = Field(None, max_length=255, description="Desired backup run time")
    equipment_information: Optional[str] = Field(None, description="Load characteristics, machinery, or plant scope")
    additional_requirements: Optional[str] = Field(None, description="Environmental, bypass, or monitoring requirements")
    document_url: Optional[str] = Field(None, max_length=512, description="Reference URL to technical specification document")


class CustomRequirementCreate(CustomRequirementBase):
    pass


class CustomRequirementUpdateStatus(BaseModel):
    status: RequirementStatus = Field(..., description="Target lifecycle status")


class CustomRequirementResponse(CustomRequirementBase):
    id: int
    status: RequirementStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# Contact Message Schemas
# ==============================================================================

class ContactMessageBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255, description="Sender name")
    company_name: Optional[str] = Field(None, max_length=255, description="Organization or company name")
    email: EmailStr = Field(..., description="Sender contact email")
    phone: Optional[str] = Field(None, max_length=50, description="Sender telephone or mobile")
    subject: Optional[str] = Field(None, max_length=255, description="Message subject line")
    message: str = Field(..., min_length=3, description="Message body content")


class ContactMessageCreate(ContactMessageBase):
    pass


class ContactMessageUpdateStatus(BaseModel):
    status: ContactStatus = Field(..., description="Target message status")


class ContactMessageResponse(ContactMessageBase):
    id: int
    status: ContactStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

