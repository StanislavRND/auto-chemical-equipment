from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.routers.schemas.user import (
    VerifyCodeRequest,
    RegisterResponse,
    UserCreateSchema,
    UserSchema,
)
from src.repositories.user.user_repository import UserRepository
from src.db.database import get_db

user_router = APIRouter(prefix="", tags=["users"])


@user_router.post(
    "/register/request", response_model=RegisterResponse, status_code=status.HTTP_200_OK
)
async def request_registration(
    user_data: UserCreateSchema, db: AsyncSession = Depends(get_db)
):
    repo = UserRepository(session=db)

    try:
        response = await repo.request_registration(user_data)
        return response
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@user_router.post(
    "/register/verify", response_model=UserSchema, status_code=status.HTTP_201_CREATED
)
async def verify_and_register(
    verify_data: VerifyCodeRequest, db: AsyncSession = Depends(get_db)
):
    repo = UserRepository(session=db)

    try:
        user_registration_data = UserCreateSchema(
            email=verify_data.email,
            inn=verify_data.inn,
            kpp=verify_data.kpp,
            legal_address=verify_data.legal_address,
            password=verify_data.password,
            password_confirm=verify_data.password_confirm,
        )

        user = await repo.verify_and_create_user(
            email=verify_data.email,
            code=verify_data.code,
            user_data=user_registration_data,
        )
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
