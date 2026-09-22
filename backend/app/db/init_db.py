from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.product import Product
from app.models.service import Service


def init_db(db: Session) -> None:
    """Initializes the database with a default superadmin and introductory product data."""
    admin = db.query(User).filter(User.email == settings.FIRST_SUPERADMIN_EMAIL).first()
    if not admin:
        admin = User(
            name="Genesis Superadmin",
            email=settings.FIRST_SUPERADMIN_EMAIL,
            password_hash=get_password_hash(settings.FIRST_SUPERADMIN_PASSWORD),
            role=UserRole.SUPER_ADMIN,
            is_active=True,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"Created initial superadmin: {settings.FIRST_SUPERADMIN_EMAIL}")

    # Seed introductory product sample if catalog is empty
    product_count = db.query(Product).count()
    if product_count == 0:
        sample_product = Product(
            name="Industrial Silent Diesel Generator 250 kVA",
            slug="silent-diesel-generator-250-kva",
            category="Diesel Generators",
            description="Heavy-duty acoustic enclosed silent diesel generator engineered for continuous industrial manufacturing, hospitals, and critical infrastructure.",
            features=[
                "Acoustic weatherproof canopy with < 70 dBA at 1m",
                "Electronic speed governing with fast load acceptance",
                "Digital auto-start controller with AMF function",
                "High fuel efficiency Cummins/Perkins engine configuration",
            ],
            specifications={
                "Prime Power Rating": "250 kVA / 200 kW",
                "Standby Power Rating": "275 kVA / 220 kW",
                "Voltage": "415 V, 3 Phase, 50 Hz",
                "Power Factor": "0.8 Lagging",
                "Fuel Tank Capacity": "450 Litres",
            },
            image_url="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
            datasheet_url="https://example.com/datasheets/genesis-250kva.pdf",
            is_active=True,
        )
        db.add(sample_product)

        sample_service = Service(
            title="Annual Maintenance Contracts (AMC) & Overhauling",
            slug="amc-and-overhauling",
            description="Comprehensive preventative maintenance, emergency breakdown assistance, certified oil/filter overhauls, and 24/7 technical callouts for industrial power plants.",
            image_url="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
            is_active=True,
        )
        db.add(sample_service)
        db.commit()
        print("Seeded introductory sample product and service.")
