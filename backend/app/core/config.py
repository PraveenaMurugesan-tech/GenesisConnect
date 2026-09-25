import json
from typing import List, Union
from pydantic import field_validator
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

    # JWT Authentication (Phase 5+)
    SECRET_KEY: str = "genesisconnect_development_secret_key_change_in_production_32bytes"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Superadmin Defaults (Phase 5+)
    FIRST_SUPERADMIN_EMAIL: str = "admin@genesispower.in"
    FIRST_SUPERADMIN_PASSWORD: str = "GenesisAdmin2026!"

    # Supabase Object Storage (Future Scope)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_STORAGE_BUCKET_PRODUCT_IMAGES: str = "product-images"
    SUPABASE_STORAGE_BUCKET_PRODUCT_DOCS: str = "product-datasheets"
    SUPABASE_STORAGE_BUCKET_REQUIREMENTS: str = "requirement-documents"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
