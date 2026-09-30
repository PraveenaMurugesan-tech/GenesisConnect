# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Email Service Exceptions
# ==============================================================================

class EmailError(Exception):
    """Base exception for all email-related errors."""
    pass


class EmailConfigurationError(EmailError):
    """Raised when email provider credentials or server configuration is missing/invalid."""
    pass


class EmailDeliveryError(EmailError):
    """Raised when dispatching an email fails at the transport layer."""
    pass
