# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Dashboard & Control System Schemas
# ==============================================================================

from typing import Optional, Union
from pydantic import BaseModel, Field
from app.schemas.auth import UserResponse


class EnquiryMetricsSchema(BaseModel):
    """Real database counts for customer communications and enquiries."""
    new_quote_requests: int = Field(0, description="Count of quote requests with NEW status")
    open_custom_requirements: int = Field(0, description="Count of open technical requirements")
    new_contact_messages: int = Field(0, description="Count of unread contact messages")
    total_enquiries: int = Field(0, description="Combined total count of all enquiries")


class AdminDashboardResponse(BaseModel):
    """Aggregate statistics and operational status for the admin dashboard."""
    admin: UserResponse
    total_products: int
    active_products: int
    inactive_products: int = 0
    total_services: int = 0
    total_enquiries: Union[int, str] = "0"
    enquiry_counts: Optional[EnquiryMetricsSchema] = None
    system_status: str = "Operational"
    api_version: str = "1.0.0"
