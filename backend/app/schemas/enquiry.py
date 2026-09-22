from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.enquiry import QuoteStatus, RequirementStatus, ContactStatus
from app.schemas.product import ProductResponse


# ==============================================================================
# Quote Request Schemas
# ==============================================================================
class QuoteRequestBase(BaseModel):
    customer_name: str
    company_name: Optional[str] = None
    email: EmailStr
    phone: str
    product_id: Optional[int] = None
    message: Optional[str] = None


class QuoteRequestCreate(QuoteRequestBase):
    pass


class QuoteRequestUpdateStatus(BaseModel):
    status: QuoteStatus


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
    customer_name: str
    company_name: Optional[str] = None
    email: EmailStr
    phone: str
    product: Optional[str] = None
    capacity: Optional[str] = None
    battery_specifications: Optional[str] = None
    backup_requirements: Optional[str] = None
    equipment_information: Optional[str] = None
    additional_requirements: Optional[str] = None
    document_url: Optional[str] = None


class CustomRequirementCreate(CustomRequirementBase):
    pass


class CustomRequirementUpdateStatus(BaseModel):
    status: RequirementStatus


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
    name: str
    company_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str


class ContactMessageCreate(ContactMessageBase):
    pass


class ContactMessageUpdateStatus(BaseModel):
    status: ContactStatus


class ContactMessageResponse(ContactMessageBase):
    id: int
    status: ContactStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
