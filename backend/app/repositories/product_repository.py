# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Product Repository Layer (SQLAlchemy ORM Data Access)
# ==============================================================================

from typing import List, Optional, Union
from sqlalchemy import or_, and_, func, select
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

# Mapping of genuine company product categories to their respective canonical slugs
COMPANY_CATEGORY_SLUG_MAP = {
    "industrial online ups": "industrial-ups",
    "medical and ct scanner ups": "ct-scanner-ups",
    "medical & ct scanner ups": "ct-scanner-ups",
    "igbt static voltage stabilizers": "igbt-static-voltage-stabilizers",
    "servo voltage stabilizers": "servo-stabilizers",
    "cvcf frequency converters": "cvcf-systems",
    "cath lab ups": "cath-laboratory-ups",
    "cath laboratory ups": "cath-laboratory-ups",
    "other power conditioning equipment": "custom-specialized-power-systems",
}


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
        active_only: Optional[bool] = True,
        category: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Product]:
        """List products with optional active status, category, and keyword search filtering."""
        query = self.db.query(Product)

        if active_only is True:
            query = query.filter(Product.is_active == True)
        elif active_only is False:
            query = query.filter(Product.is_active == False)

        if category and category.strip() and category.strip().lower() not in ["all", "all categories"]:
            cat_clean = category.strip()
            cat_lower = cat_clean.lower()
            if cat_lower in COMPANY_CATEGORY_SLUG_MAP:
                target_slug = COMPANY_CATEGORY_SLUG_MAP[cat_lower]
                query = query.filter(
                    or_(
                        Product.slug == target_slug,
                        Product.category.ilike(f"%{cat_clean}%"),
                    )
                )
            else:
                query = query.filter(Product.category.ilike(f"%{cat_clean}%"))

        if search and search.strip():
            raw_search = search.strip()
            term = f"%{raw_search}%"
            search_words = [w for w in raw_search.split() if len(w) > 1]
            conditions = [
                Product.name.ilike(term),
                Product.description.ilike(term),
                Product.short_description.ilike(term),
                Product.tagline.ilike(term),
                Product.category.ilike(term),
                Product.slug.ilike(term),
            ]
            if len(search_words) > 1:
                word_matches = []
                for word in search_words:
                    w_term = f"%{word}%"
                    word_matches.append(
                        or_(
                            Product.name.ilike(w_term),
                            Product.description.ilike(w_term),
                            Product.short_description.ilike(w_term),
                            Product.tagline.ilike(w_term),
                            Product.category.ilike(w_term),
                            Product.slug.ilike(w_term),
                        )
                    )
                conditions.append(and_(*word_matches))
            query = query.filter(or_(*conditions))

        return query.order_by(Product.id.asc()).offset(skip).limit(limit).all()

    def count(
        self,
        active_only: Optional[bool] = True,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> int:
        """Total count of products matching filter criteria."""
        query = self.db.query(func.count(Product.id))

        if active_only is True:
            query = query.filter(Product.is_active == True)
        elif active_only is False:
            query = query.filter(Product.is_active == False)

        if category and category.strip() and category.strip().lower() not in ["all", "all categories"]:
            cat_clean = category.strip()
            cat_lower = cat_clean.lower()
            if cat_lower in COMPANY_CATEGORY_SLUG_MAP:
                target_slug = COMPANY_CATEGORY_SLUG_MAP[cat_lower]
                query = query.filter(
                    or_(
                        Product.slug == target_slug,
                        Product.category.ilike(f"%{cat_clean}%"),
                    )
                )
            else:
                query = query.filter(Product.category.ilike(f"%{cat_clean}%"))

        if search and search.strip():
            raw_search = search.strip()
            term = f"%{raw_search}%"
            search_words = [w for w in raw_search.split() if len(w) > 1]
            conditions = [
                Product.name.ilike(term),
                Product.description.ilike(term),
                Product.short_description.ilike(term),
                Product.tagline.ilike(term),
                Product.category.ilike(term),
                Product.slug.ilike(term),
            ]
            if len(search_words) > 1:
                word_matches = []
                for word in search_words:
                    w_term = f"%{word}%"
                    word_matches.append(
                        or_(
                            Product.name.ilike(w_term),
                            Product.description.ilike(w_term),
                            Product.short_description.ilike(w_term),
                            Product.tagline.ilike(w_term),
                            Product.category.ilike(w_term),
                            Product.slug.ilike(w_term),
                        )
                    )
                conditions.append(and_(*word_matches))
            query = query.filter(or_(*conditions))

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
