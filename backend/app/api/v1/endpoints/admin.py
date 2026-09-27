# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Management & Dashboard Endpoints
# ==============================================================================

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.user import User
from app.models.service import Service
from app.repositories.product_repository import ProductRepository
from app.services.product_service import ProductService
from app.schemas.admin import AdminDashboardResponse
from app.schemas.auth import UserResponse
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate

router = APIRouter(prefix="/admin", tags=["Admin Control System"])


class StatusUpdatePayload(BaseModel):
    is_active: Optional[bool] = None


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
    """
    product_repo = ProductRepository(db)
    total_products = product_repo.count(active_only=None)
    active_products = product_repo.count(active_only=True)
    inactive_products = product_repo.count(active_only=False)

    return AdminDashboardResponse(
        admin=UserResponse.model_validate(current_admin),
        total_products=total_products,
        active_products=active_products,
        total_enquiries="Not available (Phase 7)",
        system_status="Operational",
        api_version="1.0.0",
    )


# ==============================================================================
# Protected Admin Product Management Endpoints
# ==============================================================================

@router.get(
    "/products",
    response_model=List[ProductResponse],
    summary="List all equipment in catalogue (Admin)",
    description="Lists all catalogue products (both active and inactive) with optional filters.",
)
def admin_list_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search keyword"),
    is_active: Optional[bool] = Query(None, description="Filter by active status (true/false)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[ProductResponse]:
    service = ProductService(db)
    return service.get_admin_products(
        category=category,
        search=search,
        is_active=is_active,
        skip=skip,
        limit=limit,
    )


@router.post(
    "/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new equipment listing (Admin)",
)
def admin_create_product(
    product_in: ProductCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)
    try:
        product = service.create_product(product_in)
        return product
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/products/{product_id}",
    response_model=ProductResponse,
    summary="Retrieve product by ID (Admin)",
)
def admin_get_product_by_id(
    product_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)
    product = service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return product


@router.put(
    "/products/{product_id}",
    response_model=ProductResponse,
    summary="Update product details (Admin)",
)
def admin_update_product(
    product_id: int = Path(..., ge=1),
    product_in: ProductUpdate = ...,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)
    try:
        product = service.update_product(product_id, product_in)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {product_id} not found",
            )
        return product
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.patch(
    "/products/{product_id}/status",
    response_model=ProductResponse,
    summary="Toggle or update product active status (Admin)",
)
def admin_toggle_product_status(
    product_id: int = Path(..., ge=1),
    payload: Optional[StatusUpdatePayload] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProductResponse:
    service = ProductService(db)
    explicit_status = payload.is_active if payload else None
    product = service.toggle_product_status(product_id, is_active=explicit_status)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return product


@router.delete(
    "/products/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete or soft-deactivate product (Admin)",
)
def admin_delete_product(
    product_id: int = Path(..., ge=1),
    hard_delete: bool = Query(False, description="Set true for permanent database deletion"),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Response:
    service = ProductService(db)
    success = service.delete_product(product_id, hard_delete=hard_delete)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
