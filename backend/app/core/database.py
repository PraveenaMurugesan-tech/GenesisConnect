# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect Database Layer
# PostgreSQL Engine, Session Factory & Declarative Base
# ==============================================================================

from typing import Generator
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from app.core.config import settings

logger = logging.getLogger("genesisconnect.database")


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy declarative models."""
    pass


# PostgreSQL connection pool configuration
def get_engine():
    """Initializes SQLAlchemy engine configured for PostgreSQL."""
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
        return create_engine(db_url, connect_args=connect_args)

    # For PostgreSQL / psycopg, set a sensible connection timeout
    connect_args["connect_timeout"] = 3

    return create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args=connect_args,
    )


engine = get_engine()

# Configured thread-safe session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency for yielding transactional database sessions.
    Ensures safe session lifecycle per request (commit/rollback/close).
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def check_db_connection() -> bool:
    """Verifies active connectivity to the database."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        return False
