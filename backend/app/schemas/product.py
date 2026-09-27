# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — Product Schemas & Serializers
# Pydantic v2 Models for Validation and Client Contracts
# ==============================================================================

from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field, computed_field, field_validator


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


VALID_GENESIS_CATEGORIES = [
    "UPS",
    "Voltage Stabilizers",
    "Power Conditioning",
    "Medical Power Solutions",
    "Other",
]


class ProductBase(BaseModel):
    """Base schema for Product data with strict domain validation."""
    name: str = Field(..., min_length=2, max_length=255, description="Product equipment model name")
    slug: str = Field(
        ...,
        min_length=2,
        max_length=255,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="URL-safe slug (lowercase alphanumeric with hyphens)",
    )
    category: str = Field(..., min_length=2, max_length=100, description="Equipment category")
    description: str = Field(..., min_length=10, description="Engineering product description")
    short_description: Optional[str] = Field(None, max_length=1000)
    tagline: Optional[str] = Field(None, max_length=512)
    image: Optional[str] = Field(None, max_length=512)
    images: Optional[List[str]] = Field(default_factory=list)
    features: Optional[List[str]] = Field(default_factory=list)
    specifications: Optional[Any] = Field(default_factory=list)
    datasheet: Optional[str] = Field(None, max_length=512)
    applications: Optional[List[str]] = Field(default_factory=list)
    key_highlights: Optional[List[str]] = Field(default_factory=list)
    is_active: bool = True

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Product name must be at least 2 characters long")
        return cleaned

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if not cleaned:
            raise ValueError("Slug cannot be empty")
        return cleaned

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        cleaned = v.strip()
        matching = [c for c in VALID_GENESIS_CATEGORIES if c.lower() == cleaned.lower()]
        if not matching:
            raise ValueError(
                f"Invalid product category '{v}'. Allowed categories are: {', '.join(VALID_GENESIS_CATEGORIES)}"
            )
        return matching[0]

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 10:
            raise ValueError("Description must be at least 10 characters long")
        return cleaned

    @field_validator("specifications")
    @classmethod
    def validate_specifications(cls, v: Any) -> Any:
        if v is None:
            return []
        if isinstance(v, list):
            for idx, item in enumerate(v):
                if isinstance(item, dict):
                    if "label" not in item or "value" not in item:
                        raise ValueError(f"Specification at index {idx} must contain 'label' and 'value'")
                elif hasattr(item, "label") and hasattr(item, "value"):
                    pass
                else:
                    raise ValueError(f"Specification at index {idx} is invalid; expected label and value")
        return v

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class ProductCreate(ProductBase):
    """Schema for creating a new product."""
    pass


class ProductUpdate(BaseModel):
    """Schema for updating an existing product with optional partial updates."""
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    slug: Optional[str] = Field(None, min_length=2, max_length=255, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    category: Optional[str] = None
    description: Optional[str] = Field(None, min_length=10)
    short_description: Optional[str] = Field(None, max_length=1000)
    tagline: Optional[str] = Field(None, max_length=512)
    image: Optional[str] = Field(None, max_length=512)
    images: Optional[List[str]] = None
    features: Optional[List[str]] = None
    specifications: Optional[Any] = None
    datasheet: Optional[str] = Field(None, max_length=512)
    applications: Optional[List[str]] = None
    key_highlights: Optional[List[str]] = None
    is_active: Optional[bool] = None

    @field_validator("name")
    @classmethod
    def validate_update_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = v.strip()
            if len(cleaned) < 2:
                raise ValueError("Product name must be at least 2 characters long")
            return cleaned
        return v

    @field_validator("slug")
    @classmethod
    def validate_update_slug(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = v.strip().lower()
            if not cleaned:
                raise ValueError("Slug cannot be empty")
            return cleaned
        return v

    @field_validator("category")
    @classmethod
    def validate_update_category(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = v.strip()
            matching = [c for c in VALID_GENESIS_CATEGORIES if c.lower() == cleaned.lower()]
            if not matching:
                raise ValueError(
                    f"Invalid product category '{v}'. Allowed categories are: {', '.join(VALID_GENESIS_CATEGORIES)}"
                )
            return matching[0]
        return v

    @field_validator("description")
    @classmethod
    def validate_update_description(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = v.strip()
            if len(cleaned) < 10:
                raise ValueError("Description must be at least 10 characters long")
            return cleaned
        return v

    @field_validator("specifications")
    @classmethod
    def validate_update_specifications(cls, v: Any) -> Any:
        if v is not None and isinstance(v, list):
            for idx, item in enumerate(v):
                if isinstance(item, dict):
                    if "label" not in item or "value" not in item:
                        raise ValueError(f"Specification at index {idx} must contain 'label' and 'value'")
        return v

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
