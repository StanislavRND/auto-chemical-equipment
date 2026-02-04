from dataclasses import dataclass
from typing import final
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from src.core.security import get_password_hash
from src.routers.schemas.user import UserCreateSchema
from src.models.user.user import UserModel


@final
@dataclass
class UserRepository:
    session: AsyncSession

    async def create_user(self, user_data: UserCreateSchema) -> UserModel | None:
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
            raise ValueError(f"Ошибка уникальности данных: {str(e)}")
        except SQLAlchemyError as e:
            raise ValueError(f"Ошибка базы данных: {str(e)}")
