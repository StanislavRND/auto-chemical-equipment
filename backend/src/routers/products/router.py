from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.deps import get_s3_service
from src.db.database import get_db
from src.db.models.user.user import UserModel
from src.repositories.products.product_query_repostory import ProductQueryRepository
from src.repositories.products.product_repository import ProductRepository
from src.repositories.users.users_repository import UserRepository
from src.services.storage.s3 import S3Service

from .schema import (
    PresignInSchema,
    PresignOutSchema,
    ProductCreateSchema,
    ProductResponseIdsSchema,
    ProductResponseSchema,
    ProductSearchResponseSchema,
)

product_router = APIRouter(tags=["Товары"])


async def get_auth_repo(db: AsyncSession = Depends(get_db)) -> ProductRepository:
    return ProductRepository(session=db)


async def get_product_query_repo(
    db: AsyncSession = Depends(get_db),
) -> ProductQueryRepository:
    return ProductQueryRepository(session=db)


@product_router.get(
    "/products/limit",
    response_model=list[ProductResponseIdsSchema],
    status_code=200,
    summary="Получение товаров c сортировкой и лимитом",
)
async def get_limit_products(
    sort: str = Query("name", description="name | price_desc | price_asc"),
    repo: ProductRepository = Depends(get_auth_repo),
):
    try:
        return await repo.get_products(sort=sort, limit=30)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@product_router.get(
    "/products/catalog",
    response_model=list[ProductResponseIdsSchema],
    status_code=200,
    summary="Получение товаров каталога по категории/подкатегории",
)
async def get_catalog_products(
    category_id: int | None = Query(None),
    subcategory_id: int | None = Query(None),
    price_from: int | None = Query(None, ge=0),
    price_to: int | None = Query(None, ge=0),
    in_stock: bool | None = Query(None),
    with_discount: bool | None = Query(None),
    sort: str = Query("name", description="name | price_desc | price_asc"),
    repo: ProductQueryRepository = Depends(get_product_query_repo),
):
    try:
        return await repo.get_catalog_products(
            category_id=category_id,
            subcategory_id=subcategory_id,
            price_from=price_from,
            price_to=price_to,
            in_stock=in_stock,
            with_discount=with_discount,
            sort=sort,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@product_router.get(
    "/products/search",
    response_model=ProductSearchResponseSchema,
    status_code=200,
    summary="Поиск товаров по артикулу или названию",
)
async def search_products(
    query: str = Query(
        ...,
    ),
    page: int = Query(
        1,
        ge=1,
    ),
    per_page: int = Query(
        20,
        ge=1,
        le=100,
    ),
    repo: ProductQueryRepository = Depends(get_product_query_repo),
):
    try:
        return await repo.search_products(
            query=query,
            page=page,
            per_page=per_page,
        )
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
    _: UserModel = Depends(UserRepository.get_admin_user_dependency),
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
    _: UserModel = Depends(UserRepository.get_admin_user_dependency),
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
    _: UserModel = Depends(UserRepository.get_admin_user_dependency),
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
    _: UserModel = Depends(UserRepository.get_admin_user_dependency),
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
