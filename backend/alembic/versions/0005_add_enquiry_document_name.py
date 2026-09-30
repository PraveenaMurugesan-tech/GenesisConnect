"""add document_name to custom_requirements

Revision ID: 0005_add_enquiry_document_name
Revises: 0004_create_enquiry_tables
Create Date: 2026-09-30 21:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0005_add_enquiry_document_name"
down_revision: Union[str, None] = "0004_create_enquiry_tables"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "custom_requirements",
        sa.Column("document_name", sa.String(length=255), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("custom_requirements", "document_name")
