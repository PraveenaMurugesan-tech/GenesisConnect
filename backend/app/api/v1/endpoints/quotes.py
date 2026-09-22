from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.enquiry import QuoteRequest, QuoteStatus
from app.models.user import User
from app.schemas.enquiry import (
    QuoteRequestCreate,
    QuoteRequestUpdateStatus,
    QuoteRequestResponse,
)

router = APIRouter(prefix="/quotes", tags=["Quote Requests"])


@router.post("", response_model=QuoteRequestResponse, status_code=status.HTTP_201_CREATED)
def submit_quote_request(
    quote_in: QuoteRequestCreate,
    db: Session = Depends(get_db),
) -> Any:
    """Public endpoint for customers to submit a quotation request for power equipment."""
    quote = QuoteRequest(**quote_in.model_dump())
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote


@router.get("", response_model=List[QuoteRequestResponse])
def get_quote_requests(
    db: Session = Depends(get_db),
    status_filter: Optional[QuoteStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to list submitted quote requests with optional status filtering."""
    query = db.query(QuoteRequest)
    if status_filter:
        query = query.filter(QuoteRequest.status == status_filter)
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
        raise HTTPException(status_code=404, detail="Quote request not found")
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
        raise HTTPException(status_code=404, detail="Quote request not found")
    quote.status = status_update.status
    db.commit()
    db.refresh(quote)
    return quote
