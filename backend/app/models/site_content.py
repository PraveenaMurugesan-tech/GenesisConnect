# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Site Content & Configuration Model for Admin CMS
# ==============================================================================

from datetime import datetime, timezone
from typing import Any, Dict
from sqlalchemy import String, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class SiteContent(Base):
    """
    Managed site content sections (e.g. 'homepage', 'contact_info').
    Allows Genesis administrators to update business copy, contact details,
    and featured selections through a controlled, structured JSON schema.
    """
    __tablename__ = "site_content"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<SiteContent key='{self.key}' updated_at='{self.updated_at}'>"
