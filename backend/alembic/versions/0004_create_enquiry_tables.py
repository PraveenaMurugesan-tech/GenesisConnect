"""create enquiry tables: quote_requests, custom_requirements, contact_messages

Revision ID: 0004_create_enquiry_tables
Revises: 0003_create_cms_tables
Create Date: 2026-09-28 20:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0004_create_enquiry_tables"
down_revision: Union[str, None] = "0003_create_cms_tables"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

quote_status_enum = sa.Enum("NEW", "CONTACTED", "IN_PROGRESS", "QUOTED", "CLOSED", name="quote_status_enum")
requirement_status_enum = sa.Enum("NEW", "CONTACTED", "IN_PROGRESS", "QUOTED", "CLOSED", name="requirement_status_enum")
contact_status_enum = sa.Enum("UNREAD", "READ", "REPLIED", "CLOSED", "ARCHIVED", name="contact_status_enum")


def upgrade() -> None:
    # 1. Create quote_requests table
    op.create_table(
        "quote_requests",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("customer_name", sa.String(length=255), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=50), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id", ondelete="SET NULL"), nullable=True),
        sa.Column("product_name", sa.String(length=255), nullable=True),
        sa.Column("quantity", sa.String(length=50), nullable=True),
        sa.Column("requirement", sa.Text(), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("status", quote_status_enum, server_default="NEW", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_quote_requests_id"), "quote_requests", ["id"], unique=False)
    op.create_index(op.f("ix_quote_requests_email"), "quote_requests", ["email"], unique=False)
    op.create_index(op.f("ix_quote_requests_product_id"), "quote_requests", ["product_id"], unique=False)
    op.create_index(op.f("ix_quote_requests_status"), "quote_requests", ["status"], unique=False)

    # 2. Create custom_requirements table
    op.create_table(
        "custom_requirements",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("customer_name", sa.String(length=255), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=50), nullable=False),
        sa.Column("product", sa.String(length=255), nullable=True),
        sa.Column("capacity", sa.String(length=100), nullable=True),
        sa.Column("battery_specifications", sa.String(length=255), nullable=True),
        sa.Column("backup_requirements", sa.String(length=255), nullable=True),
        sa.Column("equipment_information", sa.Text(), nullable=True),
        sa.Column("additional_requirements", sa.Text(), nullable=True),
        sa.Column("document_url", sa.String(length=512), nullable=True),
        sa.Column("status", requirement_status_enum, server_default="NEW", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_custom_requirements_id"), "custom_requirements", ["id"], unique=False)
    op.create_index(op.f("ix_custom_requirements_email"), "custom_requirements", ["email"], unique=False)
    op.create_index(op.f("ix_custom_requirements_status"), "custom_requirements", ["status"], unique=False)

    # 3. Create contact_messages table
    op.create_table(
        "contact_messages",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=50), nullable=True),
        sa.Column("subject", sa.String(length=255), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("status", contact_status_enum, server_default="UNREAD", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_contact_messages_id"), "contact_messages", ["id"], unique=False)
    op.create_index(op.f("ix_contact_messages_email"), "contact_messages", ["email"], unique=False)
    op.create_index(op.f("ix_contact_messages_status"), "contact_messages", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_contact_messages_status"), table_name="contact_messages")
    op.drop_index(op.f("ix_contact_messages_email"), table_name="contact_messages")
    op.drop_index(op.f("ix_contact_messages_id"), table_name="contact_messages")
    op.drop_table("contact_messages")
    contact_status_enum.drop(op.get_bind(), checkfirst=True)

    op.drop_index(op.f("ix_custom_requirements_status"), table_name="custom_requirements")
    op.drop_index(op.f("ix_custom_requirements_email"), table_name="custom_requirements")
    op.drop_index(op.f("ix_custom_requirements_id"), table_name="custom_requirements")
    op.drop_table("custom_requirements")
    requirement_status_enum.drop(op.get_bind(), checkfirst=True)

    op.drop_index(op.f("ix_quote_requests_status"), table_name="quote_requests")
    op.drop_index(op.f("ix_quote_requests_product_id"), table_name="quote_requests")
    op.drop_index(op.f("ix_quote_requests_email"), table_name="quote_requests")
    op.drop_index(op.f("ix_quote_requests_id"), table_name="quote_requests")
    op.drop_table("quote_requests")
    quote_status_enum.drop(op.get_bind(), checkfirst=True)
