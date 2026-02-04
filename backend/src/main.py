from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.db.database import engine
from src.routers.routers import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Приложение запущено")
    yield
    await engine.dispose()
    print("✅ Соединение с БД закрыто")


app = FastAPI(
    title="Opt Avto Him API",
    description="API для системы Opt Avto Him",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
