# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Public Site Content Endpoints (/api/v1/content)
# ==============================================================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.content_service import ContentService
from app.schemas.site_content import HomepageContentSchema, ContactInfoSchema

router = APIRouter(prefix="/content", tags=["Site Content"])


@router.get(
    "/homepage",
    response_model=HomepageContentSchema,
    summary="Get managed homepage content (Public)",
    description="Returns hero copy, CTA parameters, and featured equipment selections.",
)
def get_public_homepage_content(db: Session = Depends(get_db)) -> HomepageContentSchema:
    service = ContentService(db)
    return service.get_homepage_content()


@router.get(
    "/contact",
    response_model=ContactInfoSchema,
    summary="Get corporate contact information (Public)",
    description="Returns official Genesis address, verified hotline numbers, and business hours.",
)
def get_public_contact_info(db: Session = Depends(get_db)) -> ContactInfoSchema:
    service = ContentService(db)
    return service.get_contact_info()
