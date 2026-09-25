# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# FastAPI Application Entrypoint & Middleware Configuration
# ==============================================================================

import logging
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.base import Base
from app.db.session import engine

# Configure application logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("genesisconnect.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Initializes database tables on startup if running in development mode.
    """
    if getattr(app.state, "testing", False) or settings.ENVIRONMENT == "test":
        yield
        return

    try:
        if check_db_connection():
            Base.metadata.create_all(bind=engine)
            logger.info("Database schema validated successfully.")
    except Exception as e:
        logger.warning(
            f"Database connection not yet active during startup ({e}). Continuing..."
        )
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Official Backend API for Genesis Power Equipments Pvt. Ltd. (GenesisConnect) — Product Catalogue & Customer Management System",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ------------------------------------------------------------------------------
# CORS Configuration (Restricted to configured environment origins)
# ------------------------------------------------------------------------------
allowed_origins: List[str] = []
if isinstance(settings.CORS_ORIGINS, list):
    allowed_origins.extend([str(o).rstrip("/") for o in settings.CORS_ORIGINS if o])
elif isinstance(settings.CORS_ORIGINS, str):
    allowed_origins.extend([o.strip().rstrip("/") for o in settings.CORS_ORIGINS.split(",") if o.strip()])

if settings.FRONTEND_URL:
    clean_frontend = settings.FRONTEND_URL.rstrip("/")
    if clean_frontend not in allowed_origins:
        allowed_origins.append(clean_frontend)

# Ensure no empty origin is passed
allowed_origins = list(set([o for o in allowed_origins if o]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
)

# ------------------------------------------------------------------------------
# Consistent Error Handling Handlers
# ------------------------------------------------------------------------------

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    """Formats HTTPException into a consistent client error payload."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats validation errors into clean client response without leaking internals."""
    errors = []
    for err in exc.errors():
        field = ".".join(str(loc) for loc in err.get("loc", []) if loc != "body")
        errors.append({
            "field": field or "body",
            "message": err.get("msg", "Invalid parameter"),
            "type": err.get("type", "value_error"),
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Request validation failed. Please check your query parameters or payload.",
            "errors": errors,
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches all unexpected internal errors.
    Prevents leaking credentials, stack traces, or filesystem paths to clients.
    """
    logger.error(f"Unhandled server error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected server error occurred. Please try again later or contact engineering support.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        },
    )


# ------------------------------------------------------------------------------
# Core Routes & API Mounting
# ------------------------------------------------------------------------------

@app.get("/api/health", tags=["Health"], summary="System health probe")
def api_health():
    """Lightweight health check endpoint returning status ok."""
    return {"status": "ok"}


# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root():
    """Root redirect endpoint showing system health and docs link."""
    return {
        "system": "GenesisConnect API",
        "client": "Genesis Power Equipments Pvt. Ltd.",
        "status": "online",
        "documentation": "/docs",
        "v1_base": settings.API_V1_STR,
    }
