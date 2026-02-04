from sqlalchemy import JSON, String, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from src.db.base import Base
from datetime import datetime


class CodeModel(Base):
    __tablename__ = "codes"

    email: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    code_hash: Mapped[str] = mapped_column(String, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
