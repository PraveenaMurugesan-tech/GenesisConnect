from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    admin,
    products,
    services,
    quotes,
    custom_requirements,
    contact,
    storage,
)

api_router = APIRouter()

# Register endpoint routers
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(admin.router)
api_router.include_router(products.router)
api_router.include_router(services.router)
api_router.include_router(quotes.router)
api_router.include_router(custom_requirements.router)
api_router.include_router(contact.router)
api_router.include_router(storage.router)
