# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# HTTP Security Headers & Transport Hardening Middleware
# ==============================================================================

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies defense-in-depth HTTP response headers to harden the GenesisConnect API:
    - X-Content-Type-Options: Prevents MIME-type sniffing
    - X-Frame-Options: Prevents clickjacking attacks
    - Referrer-Policy: Protects referrer leakage to external sites
    - Strict-Transport-Security (HSTS): Enforces encrypted HTTPS communication in production
    - Permissions-Policy: Restricts browser device capabilities
    - Content-Security-Policy: Restricts untrusted script execution
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response: Response = await call_next(request)

        if not settings.ENABLE_SECURITY_HEADERS:
            return response

        # 1. Anti-MIME sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # 2. Clickjacking protection
        response.headers["X-Frame-Options"] = "DENY"

        # 3. Referrer privacy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # 4. Device permissions policy
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

        # 5. XSS Filter enable
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # 6. Content Security Policy (allows Swagger docs & frontend communication)
        # For API endpoints, frame-ancestors 'none' prevents embedding in iframes
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "img-src 'self' data: https: blob:; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "frame-ancestors 'none';"
        )

        # 7. Strict-Transport-Security (enforced in production or on HTTPS connections)
        if request.url.scheme == "https" or settings.ENVIRONMENT in ("production", "prod"):
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )

        return response
