# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Dashboard & Protected Endpoint Tests
# ==============================================================================

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import UserRole
from app.core.security import create_access_token
from app.repositories.admin_repository import AdminRepository
from app.repositories.product_repository import ProductRepository


def test_admin_dashboard_success(client: TestClient, db_session: Session):
    """Verify protected /api/v1/admin/dashboard returns accurate overview metrics."""
    admin = AdminRepository.create_admin(
        db=db_session,
        name="Dashboard Operations User",
        email="dash_admin@genesispower.in",
        password="DashboardPassword123!",
        role=UserRole.ADMIN,
    )
    token = create_access_token(subject=admin.id)
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/admin/dashboard", headers=headers)
    assert response.status_code == 200

    data = response.json()
    assert "admin" in data
    assert data["admin"]["email"] == admin.email
    assert "total_products" in data
    assert "active_products" in data
    assert data["total_products"] >= 0
    assert data["active_products"] >= 0
    assert data["system_status"] == "Operational"
    assert "Phase 7" in data["total_enquiries"]


def test_admin_dashboard_unauthenticated(client: TestClient):
    """Verify /api/v1/admin/dashboard rejects unauthenticated requests."""
    response = client.get("/api/v1/admin/dashboard")
    assert response.status_code == 401


def test_admin_dashboard_inactive_admin(client: TestClient, db_session: Session):
    """Verify deactivated administrators are rejected from dashboard metrics."""
    admin = AdminRepository.create_admin(
        db=db_session,
        name="Suspended Admin",
        email="suspended@genesispower.in",
        password="SuspendedPass123!",
        is_active=False,
    )
    token = create_access_token(subject=admin.id)
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/admin/dashboard", headers=headers)
    assert response.status_code == 401
