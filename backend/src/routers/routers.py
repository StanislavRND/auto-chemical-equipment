from fastapi import APIRouter
from src.routers.auth.router import auth_router

api_router = APIRouter(prefix="/api", tags=["API"])

api_router.include_router(auth_router)
