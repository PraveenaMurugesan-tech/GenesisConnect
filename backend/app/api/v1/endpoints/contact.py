from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.enquiry import ContactMessage, ContactStatus
from app.models.user import User
from app.schemas.enquiry import (
    ContactMessageCreate,
    ContactMessageUpdateStatus,
    ContactMessageResponse,
)

router = APIRouter(tags=["Contact Messages"])


@router.post("", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    message_in: ContactMessageCreate,
    db: Session = Depends(get_db),
) -> Any:
    """
    Public endpoint to submit general customer inquiries from the contact page.
    Assigns initial status to UNREAD.
    """
    message_data = message_in.model_dump()
    message_data["status"] = ContactStatus.UNREAD

    contact = ContactMessage(**message_data)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("", response_model=List[ContactMessageResponse])
def get_contact_messages(
    db: Session = Depends(get_db),
    status_filter: Optional[ContactStatus] = Query(None, alias="status", description="Filter by message status"),
    search: Optional[str] = Query(None, description="Search by name, email, company, or subject"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to retrieve customer messages with optional status and search filtering."""
    query = db.query(ContactMessage)

    if status_filter:
        query = query.filter(ContactMessage.status == status_filter)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ContactMessage.name.ilike(term),
                ContactMessage.email.ilike(term),
                ContactMessage.company_name.ilike(term),
                ContactMessage.subject.ilike(term),
            )
        )

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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact message with ID {message_id} not found",
        )
    return contact


@router.patch("/{message_id}/status", response_model=ContactMessageResponse)
def update_contact_message_status(
    message_id: int,
    status_update: ContactMessageUpdateStatus,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to transition message status (UNREAD -> READ -> REPLIED -> CLOSED -> ARCHIVED)."""
    contact = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact message with ID {message_id} not found",
        )
    contact.status = status_update.status
    db.commit()
    db.refresh(contact)
    return contact
