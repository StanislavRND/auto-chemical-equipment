import asyncio
from dataclasses import dataclass
from typing import Any, final

from fastapi import Request, Response
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.config import settings
from src.core.security import (
    clear_auth_cookies,
    create_access_token,
    create_refresh_token,
    get_password_hash,
    set_auth_cookie,
    verify_password,
    verify_token,
)
from src.db.models.user.user import UserModel
from src.routers.auth.schema import RegisterResponse, UserBaseSchema
from src.services.email_verification.verification import VerificationService


@final
@dataclass
class AuthRepository:
    session: AsyncSession

    @property
    def verification_service(self) -> VerificationService:
        return VerificationService(session=self.session)

    async def register_user(self, user_data: UserBaseSchema) -> UserModel:
        if await self.session.scalar(
            select(UserModel).where(UserModel.email == user_data.email)
        ):
            raise ValueError("Пользователь с таким email уже существует")

        user_dict = user_data.dict(exclude={"password_confirm"})

        if user_data.user_type == "person":
            user = UserModel(
                full_name=user_dict.get("full_name"),
                phone=user_dict.get("phone"),
                email=user_dict["email"],
                hashed_password=get_password_hash(user_dict["password"]),
                role="user",
                user_type="person",
            )
        else:
            user = UserModel(
                inn=user_dict.get("inn"),
                kpp=user_dict.get("kpp"),
                legal_name=user_dict.get("legal_name"),
                legal_address=user_dict.get("legal_address"),
                email=user_dict["email"],
                hashed_password=get_password_hash(user_dict["password"]),
                role="user",
                user_type="legal",
            )

        self.session.add(user)
        try:
            await self.session.commit()
            await self.session.refresh(user)
            return user
        except IntegrityError as e:
            await self.session.rollback()
            raise ValueError(f"Ошибка уникальности данных: {e}") from e

    async def request_registration(
        self, user_data: UserBaseSchema
    ) -> RegisterResponse:
        code = await self.verification_service.store_code(
            email=user_data.email,
            expires_minutes=settings.VERIFICATION_CODE_EXPIRE_MINUTES,
        )

        async def send_email_task():
            async with AsyncSession(self.session.bind) as new_session:
                service = VerificationService(session=new_session)
                await service.send_verification_email(user_data.email, code)

        asyncio.create_task(send_email_task())

        return RegisterResponse(
            message="Код подтверждения отправлен на email",
            email=user_data.email,
            expires_in=settings.VERIFICATION_CODE_EXPIRE_MINUTES * 15,
        )

    async def verify_and_create_user(
        self, email: str, code: str, user_data: UserBaseSchema
    ) -> UserModel:
        if not await self.verification_service.verify_code(email, code):
            raise ValueError("Неверный или просроченный код подтверждения")
        return await self.register_user(user_data)

    async def authenticate_user(self, email: str, password: str) -> UserModel | None:
        user = await self.session.scalar(
            select(UserModel).where(UserModel.email == email)
        )
        return (
            user if user and verify_password(password, user.hashed_password) else None
        )

    async def login_user(self, email: str, password: str, response: Response) -> dict:
        user = await self.authenticate_user(email, password)
        if not user:
            raise ValueError("Неверный email или пароль")

        set_auth_cookie(
            response=response,
            access_token=create_access_token(
                data={"sub": user.email, "user_id": user.id, "role": user.role}
            ),
            refresh_token=create_refresh_token(
                data={"sub": user.email, "user_id": user.id}
            ),
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
        return {"user": user}

    async def refresh_tokens(
        self, request: Request, response: Response
    ) -> dict[str, Any]:
        refresh_token = request.cookies.get("refresh_token")

        if not refresh_token:
            raise ValueError("Refresh токен отсутствует")

        payload = verify_token(refresh_token)

        access_token = create_access_token(
            data={
                "sub": payload["sub"],
                "user_id": payload["user_id"],
                "role": payload.get("role", "user"),
            }
        )

        set_auth_cookie(
            response=response,
            access_token=access_token,
            refresh_token=refresh_token,
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

        return {"message": "Токен успешно обновлен"}

    @staticmethod
    async def logout(response: Response) -> dict[str, Any]:

        clear_auth_cookies(response)
        return {"message": "Успешный выход"}
