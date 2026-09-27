# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Announcement Schemas for Admin CMS
# ==============================================================================

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class AnnouncementBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    content: str = Field(..., min_length=5)
    link_url: Optional[str] = Field(None, max_length=512)
    link_text: Optional[str] = Field(None, max_length=100)
    is_active: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class AnnouncementCreate(AnnouncementBase):
    pass


class AnnouncementUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    content: Optional[str] = Field(None, min_length=5)
    link_url: Optional[str] = Field(None, max_length=512)
    link_text: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class AnnouncementResponse(AnnouncementBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
