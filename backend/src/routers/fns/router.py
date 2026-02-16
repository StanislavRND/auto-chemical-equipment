import os

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException

fns_router = APIRouter(tags=["Информация о компании"])


load_dotenv()

FNS_API_KEY = os.getenv("FNS_API_KEY")
FNS_API_URL = "https://api-fns.ru/api/egr"


@fns_router.get(
    "/company/{inn}",
    summary="Получить информацию по компании",
)
async def get_company_by_inn(inn: str):
    if not FNS_API_KEY:
        raise HTTPException(status_code=500, detail="Неверный ключ доступа")

    if len(inn) != 10 and len(inn) != 12:
        raise HTTPException(status_code=400, detail="ИНН должен быть 10 или 12 цифр")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                FNS_API_URL, params={"req": inn, "key": FNS_API_KEY}, timeout=10.0
            )
            response.raise_for_status()
            data = response.json()

            if "error" in data:
                raise HTTPException(status_code=400, detail=data["error"])
            items = data.get("items", [])

            if not items:
                raise HTTPException(
                    status_code=404, detail="Компания с таким ИНН не найдена"
                )
            company = items[0].get("ЮЛ")
            if not company:
                raise HTTPException(
                    status_code=404, detail="Данные компании не найдены"
                )
            address = company.get("Адрес", {}).get("АдресПолн") or company.get(
                "АдресПолн"
            )

            return {
                "inn": company.get("ИНН"),
                "kpp": company.get("КПП"),
                "name": company.get("НаимСокрЮЛ"),
                "address": address,
            }

        except httpx.TimeoutException as e:
            raise HTTPException(status_code=504, detail="FNS API timeout") from e

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Внутренняя ошибка сервера: {e}"
            ) from e
