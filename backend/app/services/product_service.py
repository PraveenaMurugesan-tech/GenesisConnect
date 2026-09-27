# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Product Service Layer (Business Logic & Validation)
# ==============================================================================

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.repositories.product_repository import ProductRepository

GENESIS_PRODUCT_CATEGORIES = [
    "UPS",
    "Voltage Stabilizers",
    "Power Conditioning",
    "Medical Power Solutions",
    "Other",
]


class ProductService:
    """Business service governing product querying, validation, and domain rules."""

    def __init__(self, db: Session):
        self.repository = ProductRepository(db)

    def get_active_products(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Product]:
        """Fetch all active products matching optional category and keyword search filters."""
        return self.repository.get_all(
            active_only=True,
            category=category,
            search=search,
            skip=skip,
            limit=limit,
        )

    def get_product_by_slug(self, slug: str) -> Optional[Product]:
        """Fetch active product by its URL-safe slug."""
        if not slug or not slug.strip():
            return None
        return self.repository.get_by_slug(slug.strip(), active_only=True)

    def get_product_by_id(self, product_id: int) -> Optional[Product]:
        """Retrieve product by primary ID."""
        return self.repository.get_by_id(product_id)

    def count_active_products(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
    ) -> int:
        """Count total active products matching filters."""
        return self.repository.count(
            active_only=True,
            category=category,
            search=search,
        )

    def get_admin_products(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        is_active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Product]:
        """Fetch products for admin management with optional status, category, and search filters."""
        return self.repository.get_all(
            active_only=is_active,
            category=category,
            search=search,
            skip=skip,
            limit=limit,
        )

    def count_admin_products(
        self,
        category: Optional[str] = None,
        search: Optional[str] = None,
        is_active: Optional[bool] = None,
    ) -> int:
        """Count total products matching admin filters."""
        return self.repository.count(
            active_only=is_active,
            category=category,
            search=search,
        )

    def create_product(self, product_in: ProductCreate) -> Product:
        """Create and validate a new product record."""
        existing = self.repository.get_by_slug(product_in.slug, active_only=False)
        if existing:
            raise ValueError(f"Product with slug '{product_in.slug}' already exists")
        return self.repository.create(product_in)

    def update_product(self, product_id: int, product_in: ProductUpdate) -> Optional[Product]:
        """Update an existing product."""
        product = self.repository.get_by_id(product_id)
        if not product:
            return None
        if product_in.slug and product_in.slug != product.slug:
            existing = self.repository.get_by_slug(product_in.slug, active_only=False)
            if existing and existing.id != product_id:
                raise ValueError(f"Slug '{product_in.slug}' is already taken")
        return self.repository.update(product, product_in)

    def toggle_product_status(self, product_id: int, is_active: Optional[bool] = None) -> Optional[Product]:
        """Toggle or explicitly set the active status of a product."""
        product = self.repository.get_by_id(product_id)
        if not product:
            return None
        new_status = not product.is_active if is_active is None else is_active
        return self.repository.update(product, {"is_active": new_status})

    def deactivate_product(self, product_id: int) -> Optional[Product]:
        """Soft-deactivate a product by ID."""
        product = self.repository.get_by_id(product_id)
        if not product:
            return None
        return self.repository.deactivate(product)

    def delete_product(self, product_id: int, hard_delete: bool = False) -> bool:
        """Delete or soft-deactivate a product by ID."""
        product = self.repository.get_by_id(product_id)
        if not product:
            return False
        if hard_delete:
            self.repository.delete(product)
        else:
            self.repository.deactivate(product)
        return True
