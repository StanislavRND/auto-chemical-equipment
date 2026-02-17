from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.repositories.products.product_repository import ProductRepository
from src.routers.schemas.products import (
    ProductCreateSchema,
    ProductResponseSchema,
)

product_router = APIRouter(tags=["Товары"])


async def get_auth_repo(db: AsyncSession = Depends(get_db)) -> ProductRepository:
    return ProductRepository(session=db)


@product_router.get(
    "/products",
    response_model=list[ProductResponseSchema],
    status_code=200,
    summary="Получение товаров",
)
async def get_all_products(repo: ProductRepository = Depends(get_auth_repo)):
    try:
        return await repo.get_products()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@product_router.post(
    "/products",
    response_model=ProductResponseSchema,
    status_code=200,
    summary="Создание товара",
)
async def create_product(
    product_data: ProductCreateSchema,
    repo: ProductRepository = Depends(get_auth_repo),
):
    try:
        product = await repo.create_product(**product_data.model_dump())
        return product
    except IntegrityError as e:
        raise HTTPException(
            status_code=409,
            detail="product with this name already exists",
        ) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
