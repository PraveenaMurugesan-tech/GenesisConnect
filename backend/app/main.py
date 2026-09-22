from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Initializes database tables on startup if running in development mode.
    """
    # In production, Alembic handles migrations. In dev, we can safely attempt schema creation.
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Notice: Database connection not yet active during startup ({e}). Continuing...")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Official Backend API for Genesis Power Equipments Pvt. Ltd. (GenesisConnect)",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

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
