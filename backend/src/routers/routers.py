from fastapi import APIRouter
from src.routers.user.router import user_router

api_router = APIRouter(prefix="/api", tags=["API"])

api_router.include_router(user_router)
