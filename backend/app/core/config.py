import json
from typing import List, Union, Optional
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application configuration managed via Pydantic Settings."""

    PROJECT_NAME: str = "GenesisConnect API"
    APP_ENV: str = "development"
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    API_V1_STR: str = "/api/v1"
    BACKEND_PORT: int = 8000
    BACKEND_HOST: str = "0.0.0.0"

    # Frontend URL & CORS
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            v_stripped = v.strip()
            if v_stripped.startswith("[") and v_stripped.endswith("]"):
                try:
                    return json.loads(v_stripped)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # PostgreSQL Database Connection
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/genesisconnect"

    # JWT Authentication (Phase 5)
    JWT_SECRET_KEY: str = "genesisconnect_development_secret_key_change_in_production_32bytes"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Aliases for backward compatibility
    SECRET_KEY: Optional[str] = None
    ALGORITHM: Optional[str] = None
    ACCESS_TOKEN_EXPIRE_MINUTES: Optional[int] = None

    # Initial Admin Defaults (Phase 5)
    ADMIN_EMAIL: str = "admin@genesispower.in"
    ADMIN_PASSWORD: str = "GenesisAdmin2026!"
    FIRST_SUPERADMIN_EMAIL: Optional[str] = None
    FIRST_SUPERADMIN_PASSWORD: Optional[str] = None

    @model_validator(mode="after")
    def sync_jwt_and_admin_settings(self):
        # Sync JWT secret and algorithm
        if self.SECRET_KEY and self.JWT_SECRET_KEY == "genesisconnect_development_secret_key_change_in_production_32bytes":
            self.JWT_SECRET_KEY = self.SECRET_KEY
        self.SECRET_KEY = self.JWT_SECRET_KEY

        if self.ALGORITHM and self.JWT_ALGORITHM == "HS256":
            self.JWT_ALGORITHM = self.ALGORITHM
        self.ALGORITHM = self.JWT_ALGORITHM

        if self.ACCESS_TOKEN_EXPIRE_MINUTES and self.JWT_ACCESS_TOKEN_EXPIRE_MINUTES == 1440:
            self.JWT_ACCESS_TOKEN_EXPIRE_MINUTES = self.ACCESS_TOKEN_EXPIRE_MINUTES
        self.ACCESS_TOKEN_EXPIRE_MINUTES = self.JWT_ACCESS_TOKEN_EXPIRE_MINUTES

        # Sync Initial Admin
        if self.FIRST_SUPERADMIN_EMAIL and self.ADMIN_EMAIL == "admin@genesispower.in":
            self.ADMIN_EMAIL = self.FIRST_SUPERADMIN_EMAIL
        self.FIRST_SUPERADMIN_EMAIL = self.ADMIN_EMAIL

        if self.FIRST_SUPERADMIN_PASSWORD and self.ADMIN_PASSWORD == "GenesisAdmin2026!":
            self.ADMIN_PASSWORD = self.FIRST_SUPERADMIN_PASSWORD
        self.FIRST_SUPERADMIN_PASSWORD = self.ADMIN_PASSWORD

        return self

    # Supabase & Object Storage Configuration (Phase 8)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    STORAGE_PROVIDER: str = "supabase"  # "supabase", "local", "memory"
    LOCAL_STORAGE_PATH: str = "uploads"
    SUPABASE_STORAGE_BUCKET_PRODUCT_IMAGES: str = "product-images"
    SUPABASE_STORAGE_BUCKET_PRODUCT_DOCS: str = "product-datasheets"
    SUPABASE_STORAGE_BUCKET_REQUIREMENTS: str = "requirement-documents"
    SIGNED_URL_EXPIRATION_SECONDS: int = 3600

    # Storage Size Limits (in Megabytes)
    PRODUCT_IMAGE_MAX_SIZE_MB: int = 5
    DATASHEET_MAX_SIZE_MB: int = 10
    ENQUIRY_DOCUMENT_MAX_SIZE_MB: int = 10

    # File Validation Whitelists
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp"]
    ALLOWED_IMAGE_MIME_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    ALLOWED_DOCUMENT_EXTENSIONS: List[str] = [".pdf"]
    ALLOWED_DOCUMENT_MIME_TYPES: List[str] = ["application/pdf"]

    # Transactional Email Notification Configuration (Phase 8)
    EMAIL_ENABLED: bool = True
    EMAIL_PROVIDER: str = "console"  # "console", "smtp", "resend", "sendgrid"
    EMAIL_FROM: str = "Genesis Power Equipments <no-reply@genesispower.in>"
    ADMIN_NOTIFICATION_EMAIL: str = "sales@genesispower.in"
    EMAIL_API_KEY: Optional[str] = None
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_USE_TLS: bool = True

    # Security Hardening & Rate Limiting (Phase 8)
    ENABLE_SECURITY_HEADERS: bool = True
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 15

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
