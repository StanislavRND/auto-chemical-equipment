import secrets
import ssl
import string
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from email.message import EmailMessage

import aiosmtplib
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.config import settings
from src.core.security import hash_code, verify_code
from src.db.models.codes.codes import CodeModel
from src.services.email_verification.templates.loader import template_loader


@dataclass
class VerificationService:
    session: AsyncSession

    def generate_code(self, length: int = 4) -> str:
        return "".join(secrets.choice(string.digits) for _ in range(length))

    async def store_code(self, email: str, expires_minutes: int) -> str:
        if expires_minutes is None:
            expires_minutes = settings.VERIFICATION_CODE_EXPIRE_MINUTES

        code = self.generate_code()
        current_time = datetime.now(UTC)
        expires_at = current_time + timedelta(minutes=expires_minutes)

        await self.session.execute(delete(CodeModel).where(CodeModel.email == email))

        record = CodeModel(
            email=email, code_hash=hash_code(code), expires_at=expires_at
        )

        self.session.add(record)
        await self.session.commit()

        return code

    async def verify_code(self, email: str, code: str) -> bool:
        stmt = select(CodeModel).where(CodeModel.email == email)
        result = await self.session.execute(stmt)
        record = result.scalar_one_or_none()

        if not record:
            return False

        current_time = datetime.now(UTC)

        if current_time > record.expires_at:
            await self.session.delete(record)
            await self.session.commit()
            return False

        if not verify_code(code, record.code_hash):
            return False

        await self.session.delete(record)
        await self.session.commit()

        return True

    async def send_verification_email(self, email: str, code: str) -> bool:
        template_data = template_loader.load_and_render(
            template_name="verification",
            context={
                "code": code,
                "expires_minutes": settings.VERIFICATION_CODE_EXPIRE_MINUTES,
            },
        )

        html_content = template_data["html"]
        text_content = template_data["text"]

        if not html_content or not text_content:
            return False

        message = EmailMessage()
        message["From"] = settings.SMTP_FROM
        message["To"] = email
        message["Subject"] = "Код подтверждения регистрации в ОптАвтоХим"

        message.set_content(text_content)
        message.add_alternative(html_content, subtype="html")

        ssl_context = ssl.create_default_context()

        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=True,
            start_tls=False,
            tls_context=ssl_context,
            timeout=30,
        )
        return True
