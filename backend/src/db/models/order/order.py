from __future__ import annotations

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from src.db.base import Base


class OrderModel(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    number_order: Mapped[str] = mapped_column(
        String(6), unique=True, index=True, nullable=False
    )

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    middle_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    products: Mapped[list[dict]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )
    total_products_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    total_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=0,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="success",
    )
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
