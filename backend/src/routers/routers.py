from fastapi import APIRouter
from src.routers.auth.router import auth_router
from src.routers.cart.router import cart_router
from src.routers.categories.router import category_router
from src.routers.products.router import product_router
from src.routers.subcategories.router import sub_category_router
from src.routers.users.router import user_router

api_router = APIRouter(prefix="/api", tags=["API"])

api_router.include_router(auth_router)
api_router.include_router(category_router)
api_router.include_router(sub_category_router)
api_router.include_router(user_router)
api_router.include_router(product_router)
api_router.include_router(cart_router)
