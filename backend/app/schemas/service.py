from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ServiceBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255, description="Service title")
    slug: str = Field(
        ...,
        min_length=2,
        max_length=255,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="URL-safe slug",
    )
    description: Optional[str] = Field(None, description="Detailed scope and description")
    image_url: Optional[str] = Field(None, max_length=512)
    is_active: bool = True

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Service title must be at least 2 characters long")
        return cleaned

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if not cleaned:
            raise ValueError("Slug cannot be empty")
        return cleaned


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    slug: Optional[str] = Field(None, min_length=2, max_length=255, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    description: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=512)
    is_active: Optional[bool] = None

    @field_validator("title")
    @classmethod
    def validate_update_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = v.strip()
            if len(cleaned) < 2:
                raise ValueError("Service title must be at least 2 characters long")
            return cleaned
        return v

    @field_validator("slug")
    @classmethod
    def validate_update_slug(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            cleaned = v.strip().lower()
            if not cleaned:
                raise ValueError("Slug cannot be empty")
            return cleaned
        return v

    model_config = ConfigDict(from_attributes=True)


class ServiceResponse(ServiceBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
