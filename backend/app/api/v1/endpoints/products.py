from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.product import Product, ProductImage, ProductDocument
from app.models.user import User
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductDetailResponse,
    ProductImageCreate,
    ProductImageResponse,
    ProductDocumentCreate,
    ProductDocumentResponse,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=List[ProductResponse])
def get_products(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = None,
    search: Optional[str] = None,
    active_only: bool = True,
) -> Any:
    """Public endpoint to list products with optional category filter and keyword search."""
    query = db.query(Product)
    if active_only:
        query = query.filter(Product.is_active == True)
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) | (Product.description.ilike(f"%{search}%"))
        )
    return query.order_by(Product.id.asc()).offset(skip).limit(limit).all()


@router.get("/{slug}", response_model=ProductDetailResponse)
def get_product_by_slug(
    slug: str,
    db: Session = Depends(get_db),
) -> Any:
    """Public endpoint to retrieve a full product specification by unique slug."""
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found",
        )
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to create a new product entry in the catalog."""
    existing_slug = db.query(Product).filter(Product.slug == product_in.slug).first()
    if existing_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A product with slug '{product_in.slug}' already exists",
        )
    product = Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to update product details and specifications."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    update_data = product_in.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != product.slug:
        existing = db.query(Product).filter(Product.slug == update_data["slug"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Slug '{update_data['slug']}' is already in use",
            )
    for field, value in update_data.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    hard_delete: bool = False,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> None:
    """Admin endpoint to deactivate (soft delete) or remove a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    if hard_delete:
        db.delete(product)
    else:
        product.is_active = False
    db.commit()
    return None


@router.post("/{product_id}/images", response_model=ProductImageResponse, status_code=status.HTTP_201_CREATED)
def add_product_image(
    product_id: int,
    image_in: ProductImageCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to associate an image URL with a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    image = ProductImage(product_id=product_id, **image_in.model_dump())
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@router.post("/{product_id}/documents", response_model=ProductDocumentResponse, status_code=status.HTTP_201_CREATED)
def add_product_document(
    product_id: int,
    document_in: ProductDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to attach a datasheet or manual URL to a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    doc = ProductDocument(product_id=product_id, **document_in.model_dump())
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc
