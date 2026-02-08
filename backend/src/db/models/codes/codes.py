from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column
from src.db.base import Base


class CodeModel(Base):
    __tablename__ = "codes"

    email: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    code_hash: Mapped[str] = mapped_column(String, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
