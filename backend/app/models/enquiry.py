import enum
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class QuoteStatus(str, enum.Enum):
    NEW = "NEW"
    CONTACTED = "CONTACTED"
    IN_PROGRESS = "IN_PROGRESS"
    QUOTED = "QUOTED"
    CLOSED = "CLOSED"


class RequirementStatus(str, enum.Enum):
    NEW = "NEW"
    UNDER_REVIEW = "UNDER_REVIEW"
    ESTIMATED = "ESTIMATED"
    QUOTED = "QUOTED"
    CLOSED = "CLOSED"


class ContactStatus(str, enum.Enum):
    UNREAD = "UNREAD"
    READ = "READ"
    REPLIED = "REPLIED"
    ARCHIVED = "ARCHIVED"


class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    product_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("products.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[QuoteStatus] = mapped_column(
        Enum(QuoteStatus, name="quote_status_enum"),
        default=QuoteStatus.NEW,
        index=True,
        nullable=False,
    )
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

    product: Mapped[Optional["Product"]] = relationship("Product", back_populates="quote_requests")

    def __repr__(self) -> str:
        return f"<QuoteRequest id={self.id} customer='{self.customer_name}' status='{self.status}'>"


class CustomRequirement(Base):
    __tablename__ = "custom_requirements"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    product: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    capacity: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    battery_specifications: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    backup_requirements: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    equipment_information: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    additional_requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    document_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    status: Mapped[RequirementStatus] = mapped_column(
        Enum(RequirementStatus, name="requirement_status_enum"),
        default=RequirementStatus.NEW,
        index=True,
        nullable=False,
    )
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

    def __repr__(self) -> str:
        return f"<CustomRequirement id={self.id} customer='{self.customer_name}' capacity='{self.capacity}'>"


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ContactStatus] = mapped_column(
        Enum(ContactStatus, name="contact_status_enum"),
        default=ContactStatus.UNREAD,
        index=True,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<ContactMessage id={self.id} name='{self.name}' status='{self.status}'>"
