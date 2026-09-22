from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


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
    name: str
    slug: str
    description: Optional[str] = None
    features: Optional[List[str]] = []
    specifications: Optional[Dict[str, Any]] = {}
    category: str
    image_url: Optional[str] = None
    datasheet_url: Optional[str] = None
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    specifications: Optional[Dict[str, Any]] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    datasheet_url: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductDetailResponse(ProductResponse):
    images: List[ProductImageResponse] = []
    documents: List[ProductDocumentResponse] = []

    model_config = ConfigDict(from_attributes=True)
