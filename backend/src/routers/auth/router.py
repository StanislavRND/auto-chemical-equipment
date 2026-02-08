from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.repositories.auth.auth_repository import AuthRepository
from src.routers.schemas.auth import (
    LoginRequest,
    RegisterResponse,
    UserCreateSchema,
    UserSchema,
    VerifyCodeRequest,
)

auth_router = APIRouter(tags=["Аутентификация"])


async def get_auth_repo(db: AsyncSession = Depends(get_db)) -> AuthRepository:
    return AuthRepository(session=db)


@auth_router.post(
    "/register/request",
    response_model=RegisterResponse,
    status_code=200,
    summary="Отправить код подтверждения",
)
async def request_registration(
    user_data: UserCreateSchema, repo: AuthRepository = Depends(get_auth_repo)
):
    try:
        return await repo.request_registration(user_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@auth_router.post(
    "/register/verify",
    response_model=UserSchema,
    status_code=201,
    summary="Подтвердить регистрацию",
)
async def verify_and_register(
    verify_data: VerifyCodeRequest, repo: AuthRepository = Depends(get_auth_repo)
):
    try:
        user = await repo.verify_and_create_user(
            email=verify_data.email,
            code=verify_data.code,
            user_data=UserCreateSchema(**verify_data.dict()),
        )
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@auth_router.post(
    "/login", response_model=UserSchema, status_code=200, summary="Авторизация"
)
async def login_user(
    login_data: LoginRequest,
    response: Response,
    repo: AuthRepository = Depends(get_auth_repo),
):
    try:
        result = await repo.login_user(
            email=login_data.email, password=login_data.password, response=response
        )
        return result["user"]
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e)) from e


@auth_router.post("/refresh", summary="Обновить access токен")
async def refresh(
    request: Request, response: Response, repo: AuthRepository = Depends(get_auth_repo)
):
    try:
        return await repo.refresh_tokens(request, response)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e)) from e


@auth_router.post("/logout", summary="Выход из системы")
async def logout(response: Response):
    return await AuthRepository.logout(response)
