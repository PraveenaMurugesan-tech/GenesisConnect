# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin / User Model Representation
# ==============================================================================

from app.models.user import User, UserRole

# Admin alias for domain-driven semantic clarity
Admin = User

__all__ = ["User", "Admin", "UserRole"]
