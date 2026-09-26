# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin Account Seeding Utility
# ==============================================================================

import logging
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.user import UserRole, User
from app.repositories.admin_repository import AdminRepository

logger = logging.getLogger("genesisconnect.seed")


def seed_admin(db: Session) -> User:
    """
    Safely ensures an initial administrative account exists.
    Idempotent: will not duplicate users if an admin with ADMIN_EMAIL already exists.
    """
    admin_email = settings.ADMIN_EMAIL
    admin_password = settings.ADMIN_PASSWORD

    existing_admin = AdminRepository.get_by_email(db, email=admin_email)
    if existing_admin:
        logger.info(f"Admin user already exists: {admin_email}")
        return existing_admin

    new_admin = AdminRepository.create_admin(
        db=db,
        name="Genesis Administrator",
        email=admin_email,
        password=admin_password,
        role=UserRole.ADMIN,
        is_active=True,
    )
    logger.info(f"Successfully seeded initial admin: {admin_email}")
    return new_admin


if __name__ == "__main__":
    db = SessionLocal()
    try:
        admin = seed_admin(db)
        print(f"Initial administrator verified: {admin.email} (Role: {admin.role})")
    finally:
        db.close()
