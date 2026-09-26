# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Management & Dashboard Endpoints
# ==============================================================================

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.user import User
from app.repositories.product_repository import ProductRepository
from app.schemas.admin import AdminDashboardResponse
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/admin", tags=["Admin Control System"])


@router.get(
    "/dashboard",
    response_model=AdminDashboardResponse,
    summary="Admin Dashboard Overview Metrics",
)
def get_admin_dashboard(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Any:
    """
    Returns high-level administrative dashboard overview metrics.
    Requires active administrator authentication via Bearer token.
    Safe foundation endpoint: does NOT expose write or CMS mutation actions.
    """
    product_repo = ProductRepository(db)
    total_products = product_repo.count(active_only=False)
    active_products = product_repo.count(active_only=True)

    return AdminDashboardResponse(
        admin=UserResponse.model_validate(current_admin),
        total_products=total_products,
        active_products=active_products,
        total_enquiries="Not available (Phase 7)",
        system_status="Operational",
        api_version="1.0.0",
    )
