# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Management & Dashboard Endpoints
# ==============================================================================

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status, Response
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin
from app.models.user import User
from app.models.service import Service
from app.models.announcement import Announcement
from app.models.enquiry import (
    QuoteRequest,
    QuoteStatus,
    CustomRequirement,
    RequirementStatus,
    ContactMessage,
    ContactStatus,
)
from app.repositories.product_repository import ProductRepository
from app.services.product_service import ProductService
from app.services.content_service import ContentService
from app.schemas.admin import AdminDashboardResponse, EnquiryMetricsSchema
from app.schemas.auth import UserResponse
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from app.schemas.service import ServiceResponse, ServiceCreate, ServiceUpdate
from app.schemas.site_content import HomepageContentSchema, ContactInfoSchema
from app.schemas.announcement import AnnouncementResponse, AnnouncementCreate, AnnouncementUpdate
from app.schemas.enquiry import (
    QuoteRequestResponse,
    QuoteRequestUpdateStatus,
    CustomRequirementResponse,
    CustomRequirementUpdateStatus,
    ContactMessageResponse,
    ContactMessageUpdateStatus,
)

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
    Queries real catalogue counts and live customer enquiry counts.
    Requires active administrator authentication via Bearer token.
    """
    product_repo = ProductRepository(db)
    total_products = product_repo.count(active_only=None)
    active_products = product_repo.count(active_only=True)
    inactive_products = product_repo.count(active_only=False)
    total_services = db.query(Service).count()

    # Real enquiry metrics from database
    new_quotes = db.query(QuoteRequest).filter(QuoteRequest.status == QuoteStatus.NEW).count()
    open_requirements = db.query(CustomRequirement).filter(
        CustomRequirement.status.in_([RequirementStatus.NEW, RequirementStatus.CONTACTED, RequirementStatus.IN_PROGRESS])
    ).count()
    new_contact = db.query(ContactMessage).filter(ContactMessage.status == ContactStatus.UNREAD).count()
    total_enquiries_count = (
        db.query(QuoteRequest).count()
        + db.query(CustomRequirement).count()
        + db.query(ContactMessage).count()
    )

    enquiry_counts = EnquiryMetricsSchema(
        new_quote_requests=new_quotes,
        open_custom_requirements=open_requirements,
        new_contact_messages=new_contact,
        total_enquiries=total_enquiries_count,
    )

    return AdminDashboardResponse(
        admin=UserResponse.model_validate(current_admin),
        total_products=total_products,
        active_products=active_products,
        inactive_products=inactive_products,
        total_services=total_services,
        total_enquiries=f"{total_enquiries_count} (Phase 7 Active)",
        enquiry_counts=enquiry_counts,
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


# ==============================================================================
# Protected Admin Service Management Endpoints
# ==============================================================================

@router.get(
    "/services",
    response_model=List[ServiceResponse],
    summary="List all engineering services (Admin)",
)
def admin_list_services(
    search: Optional[str] = Query(None, description="Search keyword"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[ServiceResponse]:
    query = db.query(Service)
    if is_active is True:
        query = query.filter(Service.is_active == True)
    elif is_active is False:
        query = query.filter(Service.is_active == False)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (Service.title.ilike(term)) | (Service.description.ilike(term)) | (Service.slug.ilike(term))
        )

    return query.order_by(Service.id.asc()).offset(skip).limit(limit).all()


@router.post(
    "/services",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new engineering service (Admin)",
)
def admin_create_service(
    service_in: ServiceCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceResponse:
    existing = db.query(Service).filter(Service.slug == service_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Service with slug '{service_in.slug}' already exists",
        )
    service = Service(**service_in.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.get(
    "/services/{service_id}",
    response_model=ServiceResponse,
    summary="Retrieve service by ID (Admin)",
)
def admin_get_service_by_id(
    service_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceResponse:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with ID {service_id} not found",
        )
    return service


@router.put(
    "/services/{service_id}",
    response_model=ServiceResponse,
    summary="Update engineering service details (Admin)",
)
def admin_update_service(
    service_id: int = Path(..., ge=1),
    service_in: ServiceUpdate = ...,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceResponse:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with ID {service_id} not found",
        )

    if service_in.slug and service_in.slug != service.slug:
        existing = db.query(Service).filter(Service.slug == service_in.slug).first()
        if existing and existing.id != service_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Service slug '{service_in.slug}' is already taken",
            )

    update_data = service_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


@router.patch(
    "/services/{service_id}/status",
    response_model=ServiceResponse,
    summary="Toggle or update service active status (Admin)",
)
def admin_toggle_service_status(
    service_id: int = Path(..., ge=1),
    payload: Optional[StatusUpdatePayload] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceResponse:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with ID {service_id} not found",
        )
    new_status = not service.is_active if not payload or payload.is_active is None else payload.is_active
    service.is_active = new_status
    db.commit()
    db.refresh(service)
    return service


@router.delete(
    "/services/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete or soft-deactivate service (Admin)",
)
def admin_delete_service(
    service_id: int = Path(..., ge=1),
    hard_delete: bool = Query(False, description="Set true for permanent database deletion"),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Response:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with ID {service_id} not found",
        )
    if hard_delete:
        db.delete(service)
    else:
        service.is_active = False
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ==============================================================================
# Protected Admin Site Content Management Endpoints
# ==============================================================================

@router.get(
    "/content/homepage",
    response_model=HomepageContentSchema,
    summary="Get managed homepage content (Admin)",
)
def admin_get_homepage_content(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> HomepageContentSchema:
    service = ContentService(db)
    return service.get_homepage_content()


@router.put(
    "/content/homepage",
    response_model=HomepageContentSchema,
    summary="Update managed homepage content (Admin)",
)
def admin_update_homepage_content(
    payload: HomepageContentSchema,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> HomepageContentSchema:
    service = ContentService(db)
    return service.update_homepage_content(payload)


@router.get(
    "/content/contact",
    response_model=ContactInfoSchema,
    summary="Get corporate contact information (Admin)",
)
def admin_get_contact_info(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ContactInfoSchema:
    service = ContentService(db)
    return service.get_contact_info()


@router.put(
    "/content/contact",
    response_model=ContactInfoSchema,
    summary="Update corporate contact information (Admin)",
)
def admin_update_contact_info(
    payload: ContactInfoSchema,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ContactInfoSchema:
    service = ContentService(db)
    return service.update_contact_info(payload)


# ==============================================================================
# Protected Admin Announcement Management Endpoints
# ==============================================================================

@router.get(
    "/announcements",
    response_model=List[AnnouncementResponse],
    summary="List all announcements (Admin)",
)
def admin_list_announcements(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[Announcement]:
    """
    Returns all announcements, optionally filtered by active status.
    Ordered by creation date descending.
    """
    query = db.query(Announcement)
    if is_active is not None:
        query = query.filter(Announcement.is_active == is_active)
    return query.order_by(Announcement.created_at.desc()).all()


@router.post(
    "/announcements",
    response_model=AnnouncementResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new announcement (Admin)",
)
def admin_create_announcement(
    payload: AnnouncementCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Announcement:
    """
    Create a new announcement or notification banner.
    """
    announcement = Announcement(
        title=payload.title.strip(),
        content=payload.content.strip(),
        link_url=payload.link_url.strip() if payload.link_url else None,
        link_text=payload.link_text.strip() if payload.link_text else None,
        is_active=payload.is_active,
        start_date=payload.start_date,
        end_date=payload.end_date,
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement


@router.get(
    "/announcements/{announcement_id}",
    response_model=AnnouncementResponse,
    summary="Get announcement details by ID (Admin)",
)
def admin_get_announcement(
    announcement_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Announcement:
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Announcement with ID {announcement_id} not found",
        )
    return announcement


@router.put(
    "/announcements/{announcement_id}",
    response_model=AnnouncementResponse,
    summary="Update an existing announcement (Admin)",
)
def admin_update_announcement(
    payload: AnnouncementUpdate,
    announcement_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Announcement:
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Announcement with ID {announcement_id} not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(announcement, field, value)

    db.commit()
    db.refresh(announcement)
    return announcement


@router.patch(
    "/announcements/{announcement_id}/status",
    response_model=AnnouncementResponse,
    summary="Toggle or update announcement active status (Admin)",
)
def admin_toggle_announcement_status(
    payload: Optional[StatusUpdatePayload] = None,
    announcement_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Announcement:
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Announcement with ID {announcement_id} not found",
        )

    if payload and payload.is_active is not None:
        announcement.is_active = payload.is_active
    else:
        announcement.is_active = not announcement.is_active

    db.commit()
    db.refresh(announcement)
    return announcement


@router.delete(
    "/announcements/{announcement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an announcement (Admin)",
)
def admin_delete_announcement(
    announcement_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> Response:
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Announcement with ID {announcement_id} not found",
        )

    db.delete(announcement)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ==============================================================================
# Protected Admin Enquiry & Communication Management Endpoints
# ==============================================================================

# --- 1. Quote Requests ---

@router.get(
    "/quote-requests",
    response_model=List[QuoteRequestResponse],
    summary="List all customer quote requests (Admin)",
)
def admin_list_quote_requests(
    status_filter: Optional[QuoteStatus] = Query(None, alias="status", description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by customer name, email, or company"),
    product_id: Optional[int] = Query(None, description="Filter by product ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[QuoteRequest]:
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


@router.get(
    "/quote-requests/{quote_id}",
    response_model=QuoteRequestResponse,
    summary="Retrieve single quote request detail (Admin)",
)
def admin_get_quote_request(
    quote_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> QuoteRequest:
    quote = db.query(QuoteRequest).filter(QuoteRequest.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quote request with ID {quote_id} not found",
        )
    return quote


@router.patch(
    "/quote-requests/{quote_id}/status",
    response_model=QuoteRequestResponse,
    summary="Update quote request workflow status (Admin)",
)
def admin_update_quote_request_status(
    quote_id: int = Path(..., ge=1),
    status_update: QuoteRequestUpdateStatus = ...,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> QuoteRequest:
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


# --- 2. Custom Requirements ---

@router.get(
    "/custom-requirements",
    response_model=List[CustomRequirementResponse],
    summary="List all technical custom requirements (Admin)",
)
def admin_list_custom_requirements(
    status_filter: Optional[RequirementStatus] = Query(None, alias="status", description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by customer name, email, company, or product"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[CustomRequirement]:
    query = db.query(CustomRequirement)
    if status_filter:
        query = query.filter(CustomRequirement.status == status_filter)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                CustomRequirement.customer_name.ilike(term),
                CustomRequirement.email.ilike(term),
                CustomRequirement.company_name.ilike(term),
                CustomRequirement.product.ilike(term),
                CustomRequirement.capacity.ilike(term),
            )
        )
    return query.order_by(CustomRequirement.created_at.desc()).offset(skip).limit(limit).all()


@router.get(
    "/custom-requirements/{requirement_id}",
    response_model=CustomRequirementResponse,
    summary="Retrieve single custom requirement detail (Admin)",
)
def admin_get_custom_requirement(
    requirement_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> CustomRequirement:
    req = db.query(CustomRequirement).filter(CustomRequirement.id == requirement_id).first()
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Custom requirement with ID {requirement_id} not found",
        )
    return req


@router.patch(
    "/custom-requirements/{requirement_id}/status",
    response_model=CustomRequirementResponse,
    summary="Update custom requirement status (Admin)",
)
def admin_update_custom_requirement_status(
    requirement_id: int = Path(..., ge=1),
    status_update: CustomRequirementUpdateStatus = ...,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> CustomRequirement:
    req = db.query(CustomRequirement).filter(CustomRequirement.id == requirement_id).first()
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Custom requirement with ID {requirement_id} not found",
        )
    req.status = status_update.status
    db.commit()
    db.refresh(req)
    return req


# --- 3. Contact Messages ---

@router.get(
    "/contact-messages",
    response_model=List[ContactMessageResponse],
    summary="List all contact messages (Admin)",
)
def admin_list_contact_messages(
    status_filter: Optional[ContactStatus] = Query(None, alias="status", description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by name, email, company, or subject"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[ContactMessage]:
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


@router.get(
    "/contact-messages/{message_id}",
    response_model=ContactMessageResponse,
    summary="Retrieve single contact message detail (Admin)",
)
def admin_get_contact_message(
    message_id: int = Path(..., ge=1),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ContactMessage:
    contact = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact message with ID {message_id} not found",
        )
    return contact


@router.patch(
    "/contact-messages/{message_id}/status",
    response_model=ContactMessageResponse,
    summary="Update contact message status (Admin)",
)
def admin_update_contact_message_status(
    message_id: int = Path(..., ge=1),
    status_update: ContactMessageUpdateStatus = ...,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ContactMessage:
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


