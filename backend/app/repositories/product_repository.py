# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Product Repository Layer (SQLAlchemy ORM Data Access)
# ==============================================================================

from typing import List, Optional, Union
from sqlalchemy import or_, func, select
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductRepository:
    """Encapsulates all database query logic for Product entities."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, product_id: int) -> Optional[Product]:
        """Fetch product by primary key ID."""
        return self.db.query(Product).filter(Product.id == product_id).first()

    def get_by_slug(self, slug: str, active_only: bool = True) -> Optional[Product]:
        """Fetch product by unique URL slug."""
        normalized_slug = slug.strip().lower()
        query = self.db.query(Product).filter(func.lower(Product.slug) == normalized_slug)
        if active_only:
            query = query.filter(Product.is_active == True)
        return query.first()

    def get_all(
        self,
        active_only: bool = True,
        category: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Product]:
        """List products with optional category and keyword search filtering."""
        query = self.db.query(Product)

        if active_only:
            query = query.filter(Product.is_active == True)

        if category and category.strip() and category.strip().lower() not in ["all", "all categories"]:
            query = query.filter(Product.category.ilike(f"%{category.strip()}%"))

        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Product.name.ilike(term),
                    Product.description.ilike(term),
                    Product.short_description.ilike(term),
                    Product.tagline.ilike(term),
                    Product.slug.ilike(term),
                )
            )

        return query.order_by(Product.id.asc()).offset(skip).limit(limit).all()

    def count(
        self,
        active_only: bool = True,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> int:
        """Total count of products matching filter criteria."""
        query = self.db.query(func.count(Product.id))

        if active_only:
            query = query.filter(Product.is_active == True)

        if category and category.strip() and category.strip().lower() not in ["all", "all categories"]:
            query = query.filter(Product.category.ilike(f"%{category.strip()}%"))

        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Product.name.ilike(term),
                    Product.description.ilike(term),
                    Product.short_description.ilike(term),
                    Product.tagline.ilike(term),
                    Product.slug.ilike(term),
                )
            )

        return query.scalar() or 0

    def create(self, product_in: ProductCreate) -> Product:
        """Persist a new product record."""
        data = product_in.model_dump(exclude_unset=True)
        product = Product(**data)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update(self, product: Product, product_in: Union[ProductUpdate, dict]) -> Product:
        """Update fields of an existing product."""
        if isinstance(product_in, dict):
            update_data = product_in
        else:
            update_data = product_in.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            if hasattr(product, field):
                setattr(product, field, value)

        self.db.commit()
        self.db.refresh(product)
        return product

    def deactivate(self, product: Product) -> Product:
        """Soft-deactivate a product."""
        product.is_active = False
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete(self, product: Product) -> None:
        """Hard delete a product."""
        self.db.delete(product)
        self.db.commit()
