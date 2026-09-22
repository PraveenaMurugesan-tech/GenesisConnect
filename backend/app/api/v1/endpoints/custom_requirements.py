from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.enquiry import CustomRequirement, RequirementStatus
from app.models.user import User
from app.schemas.enquiry import (
    CustomRequirementCreate,
    CustomRequirementUpdateStatus,
    CustomRequirementResponse,
)

router = APIRouter(prefix="/custom-requirements", tags=["Custom Requirements"])


@router.post("", response_model=CustomRequirementResponse, status_code=status.HTTP_201_CREATED)
def submit_custom_requirement(
    req_in: CustomRequirementCreate,
    db: Session = Depends(get_db),
) -> Any:
    """Public endpoint for clients to submit complex industrial power and battery requirements."""
    req = CustomRequirement(**req_in.model_dump())
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


@router.get("", response_model=List[CustomRequirementResponse])
def get_custom_requirements(
    db: Session = Depends(get_db),
    status_filter: Optional[RequirementStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to review technical custom requirements."""
    query = db.query(CustomRequirement)
    if status_filter:
        query = query.filter(CustomRequirement.status == status_filter)
    return query.order_by(CustomRequirement.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{requirement_id}", response_model=CustomRequirementResponse)
def get_custom_requirement_detail(
    requirement_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to view full technical specs and attached document URL."""
    req = db.query(CustomRequirement).filter(CustomRequirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Custom requirement not found")
    return req


@router.patch("/{requirement_id}/status", response_model=CustomRequirementResponse)
def update_custom_requirement_status(
    requirement_id: int,
    status_update: CustomRequirementUpdateStatus,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
) -> Any:
    """Admin endpoint to update assessment status (NEW -> UNDER_REVIEW -> ESTIMATED -> QUOTED -> CLOSED)."""
    req = db.query(CustomRequirement).filter(CustomRequirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Custom requirement not found")
    req.status = status_update.status
    db.commit()
    db.refresh(req)
    return req
