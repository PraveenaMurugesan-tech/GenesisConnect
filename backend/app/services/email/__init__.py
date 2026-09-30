# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Email Service Package Exports
# ==============================================================================

from app.services.email.exceptions import (
    EmailError,
    EmailConfigurationError,
    EmailDeliveryError,
)
from app.services.email.providers import (
    BaseEmailProvider,
    ConsoleEmailProvider,
    SMTPEmailProvider,
    ResendEmailProvider,
)
from app.services.email.service import (
    EmailService,
    email_service,
)

__all__ = [
    "EmailError",
    "EmailConfigurationError",
    "EmailDeliveryError",
    "BaseEmailProvider",
    "ConsoleEmailProvider",
    "SMTPEmailProvider",
    "ResendEmailProvider",
    "EmailService",
    "email_service",
]
