from src.db.database import Base
from sqlalchemy.sql import func
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    role: Mapped[str] = mapped_column(String, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

    inn: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=True)
    kpp: Mapped[str] = mapped_column(String, nullable=True)
    legal_address: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
