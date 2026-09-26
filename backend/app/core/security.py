from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union
from jose import jwt
import bcrypt
import logging
from app.core.config import settings

logger = logging.getLogger("genesisconnect.security")

# Maximum byte length for standard bcrypt algorithm
BCRYPT_MAX_BYTES = 72


def get_password_hash(password: str) -> str:
    """
    Generates a secure salt and bcrypt hash for a plain text password.
    Truncates to 72 bytes as per bcrypt specification to prevent overflow errors.
    """
    if not password:
        raise ValueError("Password cannot be empty")
    password_bytes = password.encode("utf-8")[:BCRYPT_MAX_BYTES]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Safely verifies a plain text password against a stored bcrypt hash.
    Returns False on any malformed hash or verification failure without leaking details.
    """
    if not plain_password or not hashed_password:
        return False
    try:
        password_bytes = plain_password.encode("utf-8")[:BCRYPT_MAX_BYTES]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception as exc:
        logger.warning(f"Password verification encountered error: {exc}")
        return False


def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """Creates a signed JWT access token for authentication."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """
    Decodes and validates a JWT token using configured secret key and algorithm.
    Raises JWTError if invalid or expired.
    """
    return jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )
