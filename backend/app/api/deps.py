# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# FastAPI Dependency Injection — Database Sessions & Authentication
# ==============================================================================

from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token",
    auto_error=True,
)


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    """
    Validates JWT token and extracts the active user.
    Throws 401 if token is invalid, expired, or user is inactive.
    """
    return AuthService.get_user_from_token(db=db, token=token)


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Verifies that the authenticated user possesses administrative privileges.
    Throws 403 if the user role is not authorized.
    """
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have administrative privileges",
        )
    return current_user
