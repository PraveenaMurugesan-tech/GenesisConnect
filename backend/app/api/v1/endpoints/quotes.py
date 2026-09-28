from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.enquiry import QuoteRequest, QuoteStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.enquiry import (
    QuoteRequestCreate,
    QuoteRequestUpdateStatus,
    QuoteRequestResponse,
)

router = APIRouter(tags=["Quote Requests"])


@router.post("", response_model=QuoteRequestResponse, status_code=status.HTTP_201_CREATED)
def submit_quote_request(
    quote_in: QuoteRequestCreate,
    db: Session = Depends(get_db),
) -> Any:
    """
    Public endpoint for customers to submit a quotation request.
    Validates referenced product if provided, sets default status to NEW.
    """
    product_name = quote_in.product_name
    if quote_in.product_id is not None:
        product = db.query(Product).filter(Product.id == quote_in.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Referenced product with ID {quote_in.product_id} does not exist",
            )
        if not product_name:
            product_name = product.name

    quote_data = quote_in.model_dump()
    quote_data["status"] = QuoteStatus.NEW
    if product_name:
        quote_data["product_name"] = product_name

    quote = QuoteRequest(**quote_data)
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote


@router.get("", response_model=List[QuoteRequestResponse])
def get_quote_requests(
    db: Session = Depends(get_db),
    status_filter: Optional[QuoteStatus] = Query(None, alias="status", description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by customer name, email, or company"),
    product_id: Optional[int] = Query(None, description="Filter by product ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to list submitted quote requests with optional search and status filtering."""
    query = db.query(QuoteRequest)

    if status_filter:
        query = query.filter(QuoteRequest.status == status_filter)

    if product_id:
        query = query.filter(QuoteRequest.product_id == product_id)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                QuoteRequest.customer_name.ilike(term),
                QuoteRequest.email.ilike(term),
                QuoteRequest.company_name.ilike(term),
                QuoteRequest.product_name.ilike(term),
            )
        )

    return query.order_by(QuoteRequest.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{quote_id}", response_model=QuoteRequestResponse)
def get_quote_request_detail(
    quote_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to retrieve specific quote request details."""
    quote = db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quote request with ID {quote_id} not found",
        )
    return quote


@router.patch("/{quote_id}/status", response_model=QuoteRequestResponse)
def update_quote_request_status(
    quote_id: int,
    status_update: QuoteRequestUpdateStatus,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to update workflow status (NEW -> CONTACTED -> IN_PROGRESS -> QUOTED -> CLOSED)."""
    quote = db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quote request with ID {quote_id} not found",
        )
    quote.status = status_update.status
    db.commit()
    db.refresh(quote)
    return quote
