# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect Database Models
# Product & Equipment Catalogue Models
# ==============================================================================

from datetime import datetime, timezone
from typing import List, Optional, Any
from sqlalchemy import String, Boolean, DateTime, Text, JSON, Integer, BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Product(Base):
    """
    Core Product entity matching Genesis Power Equipments catalogue specifications.
    Supports structured JSON for technical specs, features, highlights, and images.
    """
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    tagline: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    short_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    images: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True, default=list)
    features: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True, default=list)
    specifications: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True, default=list)
    datasheet: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    applications: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True, default=list)
    key_highlights: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Backwards compatibility properties
    @property
    def image_url(self) -> Optional[str]:
        return self.image

    @property
    def datasheet_url(self) -> Optional[str]:
        return self.datasheet

    @property
    def shortDescription(self) -> Optional[str]:
        return self.short_description

    @property
    def keyHighlights(self) -> Optional[List[str]]:
        return self.key_highlights

    @property
    def isActive(self) -> bool:
        return self.is_active

    # Optional relationships for extended gallery and documents
    gallery_images: Mapped[List["ProductImage"]] = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductImage.display_order",
    )
    documents: Mapped[List["ProductDocument"]] = relationship(
        "ProductDocument",
        back_populates="product",
        cascade="all, delete-orphan",
    )
    quote_requests: Mapped[List["QuoteRequest"]] = relationship(
        "QuoteRequest",
        back_populates="product",
    )

    def __repr__(self) -> str:
        return f"<Product id={self.id} slug='{self.slug}' name='{self.name}'>"


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    image_url: Mapped[str] = mapped_column(String(512), nullable=False)
    alt_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    product: Mapped["Product"] = relationship("Product", back_populates="gallery_images")

    def __repr__(self) -> str:
        return f"<ProductImage id={self.id} product_id={self.product_id}>"


class ProductDocument(Base):
    __tablename__ = "product_documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    document_url: Mapped[str] = mapped_column(String(512), nullable=False)
    file_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="PDF")
    file_size_bytes: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    product: Mapped["Product"] = relationship("Product", back_populates="documents")

    def __repr__(self) -> str:
        return f"<ProductDocument id={self.id} title='{self.title}'>"
