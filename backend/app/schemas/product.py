# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — Product Schemas & Serializers
# Pydantic v2 Models for Validation and Client Contracts
# ==============================================================================

from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field, computed_field


class ProductSpecificationSchema(BaseModel):
    """Key-value representation of an equipment specification."""
    label: str
    value: str

    model_config = ConfigDict(from_attributes=True)


class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    display_order: int = 0
    is_primary: bool = False


class ProductImageCreate(ProductImageBase):
    pass


class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductDocumentBase(BaseModel):
    title: str
    document_url: str
    file_type: Optional[str] = "PDF"
    file_size_bytes: Optional[int] = None


class ProductDocumentCreate(ProductDocumentBase):
    pass


class ProductDocumentResponse(ProductDocumentBase):
    id: int
    product_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    """Base schema for Product data."""
    name: str
    slug: str
    category: str
    description: str
    short_description: Optional[str] = None
    tagline: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = Field(default_factory=list)
    features: Optional[List[str]] = Field(default_factory=list)
    specifications: Optional[Any] = Field(default_factory=list)
    datasheet: Optional[str] = None
    applications: Optional[List[str]] = Field(default_factory=list)
    key_highlights: Optional[List[str]] = Field(default_factory=list)
    is_active: bool = True

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class ProductCreate(ProductBase):
    """Schema for creating a new product."""
    pass


class ProductUpdate(BaseModel):
    """Schema for updating an existing product."""
    name: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    tagline: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    features: Optional[List[str]] = None
    specifications: Optional[Any] = None
    datasheet: Optional[str] = None
    applications: Optional[List[str]] = None
    key_highlights: Optional[List[str]] = None
    is_active: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(ProductBase):
    """
    Standard Product API Response schema.
    Provides dual snake_case and camelCase compatibility for frontend consumption.
    """
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Frontend camelCase aliases
    @computed_field
    def shortDescription(self) -> Optional[str]:
        return self.short_description

    @computed_field
    def keyHighlights(self) -> List[str]:
        return self.key_highlights or []

    @computed_field
    def isActive(self) -> bool:
        return self.is_active

    @computed_field
    def image_url(self) -> Optional[str]:
        return self.image

    @computed_field
    def datasheet_url(self) -> Optional[str]:
        return self.datasheet

    model_config = ConfigDict(from_attributes=True)


class ProductDetailResponse(ProductResponse):
    """Extended Product detail response with gallery images and documents."""
    gallery_images: List[ProductImageResponse] = Field(default_factory=list)
    documents: List[ProductDocumentResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    """Paginated or counted list of products."""
    items: List[ProductResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)
