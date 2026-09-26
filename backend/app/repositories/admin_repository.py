# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Admin & User Repository Layer
# ==============================================================================

from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User, UserRole
from app.core.security import get_password_hash


class AdminRepository:
    """Encapsulates database access operations for admin accounts."""

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """Fetches a user by primary key ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Fetches a user by normalized lowercase email address."""
        if not email:
            return None
        return db.query(User).filter(func.lower(User.email) == email.lower().strip()).first()

    @staticmethod
    def create_admin(
        db: Session,
        name: str,
        email: str,
        password: str,
        role: UserRole = UserRole.ADMIN,
        is_active: bool = True,
    ) -> User:
        """Creates a new administrative user with securely hashed password."""
        user = User(
            name=name.strip(),
            email=email.lower().strip(),
            password_hash=get_password_hash(password),
            role=role,
            is_active=is_active,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def count_total(db: Session) -> int:
        """Returns the total number of admin users."""
        return db.query(User).count()

    @staticmethod
    def count_active(db: Session) -> int:
        """Returns the count of active administrators."""
        return db.query(User).filter(User.is_active == True).count()
