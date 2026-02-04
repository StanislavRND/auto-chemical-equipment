from dataclasses import dataclass
from typing import final
import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from src.core.security import get_password_hash
from src.routers.schemas.user import UserCreateSchema, RegisterResponse
from src.db.models.users.users import UserModel
from src.services.email_verification.verification import VerificationService
from src.core.config import settings


@final
@dataclass
class UserRepository:
    session: AsyncSession

    @property
    def verification_service(self) -> VerificationService:
        return VerificationService(session=self.session)

    async def create_user(self, user_data: UserCreateSchema) -> UserModel:
        try:
            if user_data.password != user_data.password_confirm:
                raise ValueError("Пароли не совпадают")

            stmt = select(UserModel).where(UserModel.email == user_data.email)
            result = await self.session.execute(stmt)
            if result.scalar_one_or_none():
                raise ValueError("Пользователь с таким email уже существует")

            user = UserModel(
                inn=user_data.inn,
                kpp=user_data.kpp,
                legal_address=user_data.legal_address,
                email=user_data.email,
                hashed_password=get_password_hash(user_data.password),
                role="user",
            )
            self.session.add(user)
            await self.session.commit()
            await self.session.refresh(user)

            return user
        except IntegrityError as e:
            await self.session.rollback()
            raise ValueError(f"Ошибка уникальности данных: {str(e)}")
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise ValueError(f"Ошибка базы данных: {str(e)}")

    async def request_registration(
        self, user_data: UserCreateSchema
    ) -> RegisterResponse:

        code = await self.verification_service.store_code(
            email=user_data.email,
            expires_minutes=settings.VERIFICATION_CODE_EXPIRE_MINUTES,
        )

        asyncio.create_task(
            self.verification_service.send_verification_email(user_data.email, code)
        )

        return RegisterResponse(
            message="Код подтверждения отправлен на email",
            email=user_data.email,
            expires_in=settings.VERIFICATION_CODE_EXPIRE_MINUTES * 15,
        )

    async def verify_and_create_user(
        self, email: str, code: str, user_data: UserCreateSchema
    ) -> UserModel:
        is_valid = await self.verification_service.verify_code(email, code)

        if not is_valid or not user_data:
            raise ValueError("Неверный или просроченный код подтверждения")

        return await self.create_user(user_data)
