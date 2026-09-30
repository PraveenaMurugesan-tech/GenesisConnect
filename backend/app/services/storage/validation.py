# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Storage File Validation & Sanitization Engine
# ==============================================================================

import os
import re
import uuid
from typing import Tuple
from app.core.config import settings
from app.services.storage.exceptions import (
    FileValidationError,
    FileSizeLimitExceededError,
    InvalidFileTypeError,
)

# Explicitly disallowed dangerous executable or script extensions
DANGEROUS_EXTENSIONS = {
    ".exe", ".bat", ".cmd", ".com", ".sh", ".bash", ".ps1", ".psm1",
    ".js", ".mjs", ".jsx", ".ts", ".tsx", ".html", ".htm", ".xhtml",
    ".php", ".phtml", ".php3", ".php4", ".php5", ".phps",
    ".py", ".pyc", ".pyo", ".pyd", ".rb", ".pl", ".cgi",
    ".vbs", ".vbe", ".wsf", ".wsh", ".dll", ".so", ".dylib",
    ".msi", ".jar", ".war", ".ear", ".scr", ".pif", ".application",
    ".gadget", ".msp", ".hta", ".cpl", ".msc", ".svg",
}


def sanitize_filename(filename: str) -> str:
    """
    Strips dangerous characters, path traversals, and non-ASCII characters from a filename.
    Returns a safe base filename.
    """
    if not filename:
        return "unnamed_file"

    # Remove path traversal tokens and directories
    clean = os.path.basename(filename)
    clean = clean.replace("\\", "/").split("/")[-1]

    # Remove null bytes and control characters
    clean = re.sub(r"[\x00-\x1f\x7f-\x9f]", "", clean)

    # Replace spaces and unusual punctuation with underscores
    clean = re.sub(r"[^\w\.\-]", "_", clean)

    # Prevent hidden files (.filename)
    clean = clean.lstrip(".")

    return clean or "unnamed_file"


def verify_magic_bytes(file_bytes: bytes, extension: str) -> bool:
    """
    Validates file content using magic byte signatures rather than relying solely on extension.
    """
    if not file_bytes:
        return False

    ext = extension.lower()

    if ext in [".jpg", ".jpeg"]:
        # JPEG files begin with FF D8 FF
        return len(file_bytes) >= 3 and file_bytes[:3] == b"\xff\xd8\xff"

    elif ext == ".png":
        # PNG files begin with 89 50 4E 47 0D 0A 1A 0A
        return len(file_bytes) >= 8 and file_bytes[:8] == b"\x89PNG\r\n\x1a\n"

    elif ext == ".webp":
        # WebP begins with 'RIFF' and has 'WEBP' at offset 8-12
        return (
            len(file_bytes) >= 12
            and file_bytes[:4] == b"RIFF"
            and file_bytes[8:12] == b"WEBP"
        )

    elif ext == ".pdf":
        # PDF documents start with %PDF-
        return len(file_bytes) >= 5 and file_bytes[:5] == b"%PDF-"

    return False


def validate_upload(
    file_bytes: bytes,
    original_filename: str,
    content_type: str,
    upload_type: str,
) -> Tuple[str, str]:
    """
    Performs comprehensive validation on uploaded file:
    1. Rejects dangerous extensions and traversal attempts.
    2. Enforces allowed extensions and MIME types based on upload_type.
    3. Verifies file binary magic bytes.
    4. Enforces configurable maximum size limit.
    5. Generates a secure unique storage key (e.g. products/images/<uuid>.<ext>).

    Returns:
        Tuple of (secure_storage_key, sanitized_original_filename)
    """
    if not file_bytes or len(file_bytes) == 0:
        raise FileValidationError("Uploaded file is empty (0 bytes).")

    sanitized_name = sanitize_filename(original_filename)
    _, ext = os.path.splitext(sanitized_name)
    ext = ext.lower()

    # Reject dangerous executable/script extensions unconditionally
    if ext in DANGEROUS_EXTENSIONS:
        raise InvalidFileTypeError(
            f"File extension '{ext}' is forbidden for security reasons. Executables and scripts are prohibited."
        )

    norm_content_type = (content_type or "").lower().split(";")[0].strip()

    if upload_type == "product_image":
        max_bytes = settings.PRODUCT_IMAGE_MAX_SIZE_MB * 1024 * 1024
        if len(file_bytes) > max_bytes:
            raise FileSizeLimitExceededError(
                f"Product image exceeds the maximum allowed size of {settings.PRODUCT_IMAGE_MAX_SIZE_MB} MB."
            )

        if ext not in settings.ALLOWED_IMAGE_EXTENSIONS:
            raise InvalidFileTypeError(
                f"Invalid image extension '{ext}'. Allowed extensions: {', '.join(settings.ALLOWED_IMAGE_EXTENSIONS)}."
            )

        if norm_content_type not in settings.ALLOWED_IMAGE_MIME_TYPES:
            raise InvalidFileTypeError(
                f"Invalid image MIME type '{norm_content_type}'. Allowed types: {', '.join(settings.ALLOWED_IMAGE_MIME_TYPES)}."
            )

        if not verify_magic_bytes(file_bytes, ext):
            raise InvalidFileTypeError("File content does not match the declared image format signature.")

        unique_id = uuid.uuid4().hex
        storage_key = f"products/images/{unique_id}{ext}"
        return storage_key, sanitized_name

    elif upload_type == "product_datasheet":
        max_bytes = settings.DATASHEET_MAX_SIZE_MB * 1024 * 1024
        if len(file_bytes) > max_bytes:
            raise FileSizeLimitExceededError(
                f"Product datasheet exceeds the maximum allowed size of {settings.DATASHEET_MAX_SIZE_MB} MB."
            )

        if ext not in settings.ALLOWED_DOCUMENT_EXTENSIONS:
            raise InvalidFileTypeError(
                f"Invalid datasheet extension '{ext}'. Allowed extensions: {', '.join(settings.ALLOWED_DOCUMENT_EXTENSIONS)}."
            )

        if norm_content_type not in settings.ALLOWED_DOCUMENT_MIME_TYPES:
            raise InvalidFileTypeError(
                f"Invalid datasheet MIME type '{norm_content_type}'. Only PDF documents are permitted."
            )

        if not verify_magic_bytes(file_bytes, ext):
            raise InvalidFileTypeError("File content does not match the PDF document signature.")

        unique_id = uuid.uuid4().hex
        storage_key = f"products/datasheets/{unique_id}{ext}"
        return storage_key, sanitized_name

    elif upload_type == "enquiry_document":
        max_bytes = settings.ENQUIRY_DOCUMENT_MAX_SIZE_MB * 1024 * 1024
        if len(file_bytes) > max_bytes:
            raise FileSizeLimitExceededError(
                f"Enquiry document exceeds the maximum allowed size of {settings.ENQUIRY_DOCUMENT_MAX_SIZE_MB} MB."
            )

        if ext not in settings.ALLOWED_DOCUMENT_EXTENSIONS:
            raise InvalidFileTypeError(
                f"Invalid document extension '{ext}'. Only technical PDF documents are accepted."
            )

        if norm_content_type not in settings.ALLOWED_DOCUMENT_MIME_TYPES:
            raise InvalidFileTypeError(
                f"Invalid document MIME type '{norm_content_type}'. Only PDF format is accepted."
            )

        if not verify_magic_bytes(file_bytes, ext):
            raise InvalidFileTypeError("File content does not match the PDF document signature.")

        unique_id = uuid.uuid4().hex
        storage_key = f"enquiries/documents/{unique_id}{ext}"
        return storage_key, sanitized_name

    else:
        raise FileValidationError(f"Unsupported upload type: '{upload_type}'.")
