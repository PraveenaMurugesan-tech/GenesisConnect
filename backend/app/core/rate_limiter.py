# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Lightweight Rate Limiting & Abuse Prevention Engine
# ==============================================================================

import time
import logging
from collections import defaultdict, deque
from typing import Dict, Deque
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings

logger = logging.getLogger("genesisconnect.security.ratelimit")


class RateLimiter:
    """
    In-memory sliding window rate limiter for public inquiry and submission endpoints.
    Protects GenesisConnect against request floods, spam submissions, and Denial-of-Service.
    """

    def __init__(self, requests_per_minute: int = 15) -> None:
        self.limit = requests_per_minute
        self.window_seconds = 60
        self._records: Dict[str, Deque[float]] = defaultdict(deque)

    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds
        timestamps = self._records[client_ip]

        # Evict timestamps outside sliding window
        while timestamps and timestamps[0] < window_start:
            timestamps.popleft()

        if len(timestamps) >= self.limit:
            return False

        timestamps.append(now)
        return True

    def reset(self) -> None:
        """Clear all rate limit buckets (useful for test isolation)."""
        self._records.clear()


limiter = RateLimiter(requests_per_minute=settings.RATE_LIMIT_REQUESTS_PER_MINUTE)


class AbuseProtectionMiddleware(BaseHTTPMiddleware):
    """
    Middleware applying rate limits selectively to public POST endpoints:
    - Quote requests (/quotes, /quote-requests)
    - Custom requirements (/custom-requirements)
    - Contact messages (/contact, /contact-messages)
    - Public document upload (/storage/enquiry-document)

    Authenticated requests (bearing valid admin JWT) and GET/OPTIONS requests are exempt.
    """

    PROTECTED_POST_PATHS = {
        "/api/v1/quotes",
        "/api/v1/quote-requests",
        "/api/v1/custom-requirements",
        "/api/v1/contact",
        "/api/v1/contact-messages",
        "/api/v1/storage/enquiry-document",
    }

    async def dispatch(self, request: Request, call_next):
        if (
            not settings.RATE_LIMIT_ENABLED
            or getattr(request.app.state, "testing", False)
            or settings.ENVIRONMENT == "test"
        ):
            return await call_next(request)

        # Only apply rate limiting to mutating POST requests on designated public endpoints
        if request.method == "POST" and request.url.path in self.PROTECTED_POST_PATHS:
            # Exempt requests carrying Authorization header
            auth_header = request.headers.get("Authorization", "")
            if not auth_header.startswith("Bearer "):
                # Extract client IP (handling standard X-Forwarded-For if behind a reverse proxy)
                forwarded_for = request.headers.get("X-Forwarded-For")
                if forwarded_for:
                    client_ip = forwarded_for.split(",")[0].strip()
                elif request.client:
                    client_ip = request.client.host
                else:
                    client_ip = "127.0.0.1"

                # Check limit
                limiter.limit = settings.RATE_LIMIT_REQUESTS_PER_MINUTE
                if not limiter.is_allowed(client_ip):
                    logger.warning(
                        f"Rate limit exceeded for client IP '{client_ip}' on '{request.url.path}'"
                    )
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={
                            "detail": "Too many requests. Please wait 60 seconds before submitting again.",
                            "status_code": status.HTTP_429_TOO_MANY_REQUESTS,
                        },
                        headers={"Retry-After": "60"},
                    )

        return await call_next(request)
