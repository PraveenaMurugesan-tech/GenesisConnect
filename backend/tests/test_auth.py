# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Authentication & Security Tests
# ==============================================================================

from datetime import timedelta
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from app.repositories.admin_repository import AdminRepository


def test_admin_model_creation(db_session: Session):
    """1. Verify Admin/User database model persistence and attributes."""
    admin = AdminRepository.create_admin(
        db=db_session,
        name="Test Operations Lead",
        email="lead@genesispower.in",
        password="ValidPassword123!",
        role=UserRole.ADMIN,
        is_active=True,
    )
    assert admin.id is not None
    assert admin.email == "lead@genesispower.in"
    assert admin.name == "Test Operations Lead"
    assert admin.role == UserRole.ADMIN
    assert admin.is_active is True
    assert admin.created_at is not None
    assert admin.updated_at is not None
    assert admin.password_hash != "ValidPassword123!"


def test_password_hashing():
    """2. Verify secure bcrypt password hashing and salting."""
    pwd = "IndustrialPower@2026"
    hash1 = get_password_hash(pwd)
    hash2 = get_password_hash(pwd)

    assert hash1.startswith("$2b$")
    assert hash2.startswith("$2b$")
    # Salting ensures different hashes for the same plain password
    assert hash1 != hash2
    assert hash1 != pwd


def test_password_verification():
    """3. Verify correct and incorrect password verification against bcrypt hashes."""
    pwd = "CorrectGenesisPassword!"
    hashed = get_password_hash(pwd)

    assert verify_password(pwd, hashed) is True
    assert verify_password("IncorrectPassword", hashed) is False
    assert verify_password("", hashed) is False
    assert verify_password(pwd, "invalid_corrupted_hash") is False


def test_successful_admin_login(client: TestClient, db_session: Session):
    """4. Verify successful login yields signed JWT token and safe admin profile."""
    # Seed known test admin
    email = "auth_test@genesispower.in"
    password = "SecureAdminPass2026!"
    AdminRepository.create_admin(
        db=db_session,
        name="Auth Test Admin",
        email=email,
        password=password,
        role=UserRole.ADMIN,
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["email"] == email
    assert data["user"]["role"] == "ADMIN"
    # Ensure sensitive credentials are never leaked
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]


def test_invalid_credentials_rejected(client: TestClient, db_session: Session):
    """5. Verify invalid email or wrong password returns 401 without enumeration leak."""
    email = "known_admin@genesispower.in"
    password = "KnownPassword123!"
    AdminRepository.create_admin(
        db=db_session,
        name="Known Admin",
        email=email,
        password=password,
    )

    # Wrong password
    resp1 = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "WrongPassword!"},
    )
    assert resp1.status_code == 401
    assert resp1.json()["detail"] == "Invalid email or password."

    # Non-existent email
    resp2 = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@genesispower.in", "password": password},
    )
    assert resp2.status_code == 401
    assert resp2.json()["detail"] == "Invalid email or password."


def test_inactive_admin_rejected(client: TestClient, db_session: Session):
    """6. Verify inactive admin account cannot log in."""
    email = "inactive_admin@genesispower.in"
    password = "InactivePass123!"
    AdminRepository.create_admin(
        db=db_session,
        name="Inactive Admin",
        email=email,
        password=password,
        is_active=False,
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 401
    assert "inactive" in response.json()["detail"].lower()


def test_missing_token_rejected(client: TestClient):
    """7. Verify unauthenticated requests to protected endpoints return 401."""
    resp_me = client.get("/api/v1/auth/me")
    assert resp_me.status_code == 401

    resp_dash = client.get("/api/v1/admin/dashboard")
    assert resp_dash.status_code == 401


def test_invalid_token_rejected(client: TestClient):
    """8. Verify requests with malformed tokens return 401."""
    headers = {"Authorization": "Bearer invalid.malformed.jwt.token"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 401


def test_expired_jwt_token_rejected(client: TestClient, db_session: Session):
    """9. Verify expired JWT tokens return 401."""
    admin = AdminRepository.create_admin(
        db=db_session,
        name="Expired Admin",
        email="expired@genesispower.in",
        password="Pass12345!",
    )
    # Generate expired token (-1 hour delta)
    expired_token = create_access_token(
        subject=admin.id,
        expires_delta=timedelta(hours=-1),
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 401


def test_auth_me_returns_profile(client: TestClient, db_session: Session):
    """10. Verify /api/v1/auth/me returns safe profile for authenticated admin."""
    email = "me_test@genesispower.in"
    password = "MeTestPassword123!"
    admin = AdminRepository.create_admin(
        db=db_session,
        name="Profile Admin",
        email=email,
        password=password,
        role=UserRole.SUPER_ADMIN,
    )

    token = create_access_token(subject=admin.id)
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == admin.id
    assert data["email"] == email
    assert data["name"] == "Profile Admin"
    assert data["role"] == "SUPER_ADMIN"
    assert "password" not in data
    assert "password_hash" not in data
