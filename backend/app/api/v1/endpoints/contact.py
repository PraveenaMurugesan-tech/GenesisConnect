from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.enquiry import ContactMessage, ContactStatus
from app.models.user import User
from app.schemas.enquiry import (
    ContactMessageCreate,
    ContactMessageUpdateStatus,
    ContactMessageResponse,
)

router = APIRouter(prefix="/contact", tags=["Contact Messages"])


@router.post("", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    message_in: ContactMessageCreate,
    db: Session = Depends(get_db),
) -> Any:
    """Public endpoint to submit general customer inquiries from the contact page."""
    contact = ContactMessage(**message_in.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("", response_model=List[ContactMessageResponse])
def get_contact_messages(
    db: Session = Depends(get_db),
    status_filter: Optional[ContactStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to retrieve customer messages with optional status filter."""
    query = db.query(ContactMessage)
    if status_filter:
        query = query.filter(ContactMessage.status == status_filter)
    return query.order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{message_id}", response_model=ContactMessageResponse)
def get_contact_message_detail(
    message_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to view message content and sender info."""
    contact = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Message not found")
    return contact


@router.patch("/{message_id}/status", response_model=ContactMessageResponse)
def update_contact_message_status(
    message_id: int,
    status_update: ContactMessageUpdateStatus,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to transition message status (UNREAD -> READ -> REPLIED -> ARCHIVED)."""
    contact = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Message not found")
    contact.status = status_update.status
    db.commit()
    db.refresh(contact)
    return contact
