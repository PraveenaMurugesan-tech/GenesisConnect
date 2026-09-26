# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Dashboard & Control System Schemas
# ==============================================================================

from pydantic import BaseModel
from app.schemas.auth import UserResponse


class AdminDashboardResponse(BaseModel):
    """Aggregate statistics and operational status for the admin dashboard."""
    admin: UserResponse
    total_products: int
    active_products: int
    total_enquiries: str = "Not available"
    system_status: str = "Operational"
    api_version: str = "1.0.0"
