# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Authentication & Authorization Schemas
# ==============================================================================

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user import UserRole


class UserResponse(BaseModel):
    """Safe public/admin user profile returned by authentication endpoints."""
    id: int
    name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    """Admin credentials payload for authentication."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Standard Bearer token response schema."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    """Decoded JWT payload structure."""
    sub: Optional[str] = None
    exp: Optional[int] = None
