# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Public Product Catalogue Endpoints (/api/v1/products)
# ==============================================================================

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.product_service import ProductService
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get(
    "",
    response_model=List[ProductResponse],
    summary="List active products with optional category and search filters",
    description=(
        "Retrieves active equipment products from the Genesis Power Equipments catalogue. "
        "Supports filtering by product category (e.g., 'UPS', 'Voltage Stabilizers') and "
        "full-text keyword search across product name, description, and equipment specifications."
    ),
    responses={
        200: {
            "description": "Successfully retrieved list of active products.",
        },
    },
)
def list_products(
    category: Optional[str] = Query(
        None,
        description="Filter by equipment category (e.g., 'UPS', 'Voltage Stabilizers', 'Power Conditioning')",
    ),
    search: Optional[str] = Query(
        None,
        description="Search keyword across product name, tagline, description, or slug",
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip for pagination"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
) -> List[ProductResponse]:
    """Retrieve active products matching optional filter criteria."""
    service = ProductService(db)
    products = service.get_active_products(
        category=category,
        search=search,
        skip=skip,
        limit=limit,
    )
    return products


@router.get(
    "/{slug}",
    response_model=ProductResponse,
    summary="Retrieve product specifications by unique slug",
    description=(
        "Fetches complete product technical specifications, feature lists, equipment highlights, "
        "and application profiles for a given unique URL-safe slug."
    ),
    responses={
        200: {"description": "Product found and returned successfully."},
        404: {"description": "Product not found or currently inactive."},
    },
)
def get_product_by_slug(
    slug: str = Path(..., description="Unique URL-safe product slug (e.g. 'industrial-ups')"),
    db: Session = Depends(get_db),
) -> ProductResponse:
    """Retrieve a single active product by slug."""
    service = ProductService(db)
    product = service.get_product_by_slug(slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found",
        )
    return product
