# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Authentication API Endpoints
# ==============================================================================

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.services.auth_service import AuthService
from app.models.user import User
from app.schemas.auth import Token, UserResponse, LoginRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token, summary="Admin Login")
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db),
) -> Any:
    """
    Authenticate administrator credentials and generate a signed JWT access token.
    Accepts JSON payload with email and password.
    """
    user = AuthService.authenticate_admin(
        db=db,
        email=credentials.email,
        password=credentials.password,
    )
    return AuthService.create_admin_token(user)


@router.post("/token", response_model=Token, summary="OAuth2 Compatible Form Login")
def login_for_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    """
    OAuth2 compatible form data login endpoint (primarily for Swagger UI authentication).
    """
    user = AuthService.authenticate_admin(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )
    return AuthService.create_admin_token(user)


@router.get("/me", response_model=UserResponse, summary="Get Current Admin Profile")
def get_current_admin_profile(
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """
    Returns profile information for the currently authenticated administrator.
    Requires Bearer token authorization header. Does not leak password hashes.
    """
    return current_admin
