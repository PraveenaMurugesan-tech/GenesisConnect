# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Public Announcements Endpoints (/api/v1/announcements)
# ==============================================================================

from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api.deps import get_db
from app.models.announcement import Announcement
from app.schemas.announcement import AnnouncementResponse

router = APIRouter(prefix="/announcements", tags=["Announcements"])


@router.get(
    "",
    response_model=List[AnnouncementResponse],
    summary="List active announcements and notification banners (Public)",
    description="Returns published announcements that are active and currently within valid scheduled date ranges.",
)
def get_public_announcements(
    db: Session = Depends(get_db),
) -> List[AnnouncementResponse]:
    now = datetime.now(timezone.utc)
    query = (
        db.query(Announcement)
        .filter(Announcement.is_active == True)
        .filter(or_(Announcement.start_date == None, Announcement.start_date <= now))
        .filter(or_(Announcement.end_date == None, Announcement.end_date >= now))
        .order_by(Announcement.created_at.desc())
    )
    return query.all()
