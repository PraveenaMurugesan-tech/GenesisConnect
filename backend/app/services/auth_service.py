# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Authentication Service Layer
# ==============================================================================

from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.repositories.admin_repository import AdminRepository
from app.core.security import verify_password, create_access_token, decode_access_token


class AuthService:
    """Business logic for administrative authentication and token lifecycle."""

    @staticmethod
    def authenticate_admin(db: Session, email: str, password: str) -> User:
        """
        Validates administrator credentials safely.
        Raises 401 for invalid credentials without exposing whether the email exists.
        """
        user = AdminRepository.get_by_email(db, email=email)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is inactive. Please contact Genesis system administrator.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Administrative privileges required.",
            )

        return user

    @staticmethod
    def create_admin_token(user: User) -> Dict[str, Any]:
        """Generates signed JWT bearer token and response structure."""
        access_token = create_access_token(subject=user.id)
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user,
        }

    @staticmethod
    def get_user_from_token(db: Session, token: str) -> User:
        """Decodes JWT access token and retrieves corresponding active user."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is invalid or expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = decode_access_token(token)
            user_id = payload.get("sub")
            if user_id is None:
                raise credentials_exception
        except Exception:
            raise credentials_exception

        user = AdminRepository.get_by_id(db, user_id=int(user_id))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account no longer exists.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is inactive.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user
