# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Storage Service Exceptions
# ==============================================================================

class StorageError(Exception):
    """Base exception for all storage-related errors."""
    pass


class FileValidationError(StorageError):
    """Raised when an uploaded file fails validation (size, MIME, extension)."""
    pass


class FileSizeLimitExceededError(FileValidationError):
    """Raised when uploaded file exceeds the configured size limit."""
    pass


class InvalidFileTypeError(FileValidationError):
    """Raised when an uploaded file has a disallowed extension or MIME type."""
    pass


class StorageProviderError(StorageError):
    """Raised when an underlying storage provider operation fails."""
    pass
