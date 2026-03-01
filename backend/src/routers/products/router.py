from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.deps import get_s3_service
from src.db.database import get_db
from src.repositories.products.product_repository import ProductRepository
from src.routers.schemas.products import (
    ProductCreateSchema,
    ProductResponseIdsSchema,
    ProductResponseSchema,
)
from src.routers.schemas.s3 import PresignInSchema, PresignOutSchema
from src.services.storage.s3 import S3Service

product_router = APIRouter(tags=["Товары"])


async def get_auth_repo(db: AsyncSession = Depends(get_db)) -> ProductRepository:
    return ProductRepository(session=db)


@product_router.get(
    "/products",
    response_model=list[ProductResponseIdsSchema],
    status_code=200,
    summary="Получение товаров",
)
async def get_all_products(repo: ProductRepository = Depends(get_auth_repo)):
    try:
        return await repo.get_products()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@product_router.get(
    "/products/{product_id}",
    response_model=ProductResponseSchema,
    status_code=200,
    summary="Получение конкретного товара",
)
async def get_product_by_id(
    product_id: int, repo: ProductRepository = Depends(get_auth_repo)
):
    try:
        return await repo.get_product_by_id(product_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@product_router.post(
    "/products/upload",
    response_model=PresignOutSchema,
    status_code=200,
    summary="Загрузка фото в S3",
)
def presign_product_image(
    data: PresignInSchema,
    s3: S3Service = Depends(get_s3_service),
):
    key = s3.make_key(prefix="products", filename=data.filename)
    upload_url = s3.presign_put(key=key, expires=300)
    image_url = s3.public_url(key=key)
    return PresignOutSchema(upload_url=upload_url, image_url=image_url)


@product_router.post(
    "/products",
    response_model=ProductResponseIdsSchema,
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
            detail="Товар с таким названием уже есть",
        ) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@product_router.delete(
    "/products/{product_id}",
    status_code=204,
    summary="Удаление товара",
)
async def delete_product(
    product_id: int,
    repo: ProductRepository = Depends(get_auth_repo),
):
    try:
        await repo.delete_product(product_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e


@product_router.put(
    "/products/{product_id}",
    response_model=ProductResponseIdsSchema,
    summary="Изменение товара",
)
async def update_product(
    product_id: int,
    product_data: ProductCreateSchema,
    repo: ProductRepository = Depends(get_auth_repo),
):
    try:
        return await repo.update_product(product_id, **product_data.model_dump())
    except IntegrityError as e:
        raise HTTPException(
            status_code=409, detail="Товар с таким названием уже есть"
        ) from e
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
