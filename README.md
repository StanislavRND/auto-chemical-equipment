# ОптовикАвтоХим

## Описание проекта
Интернет-магазин оптовой продажи автохимии и оборудования с каталогом товаров, корзиной, оформлением заказов, личным кабинетом и админ-панелью.

## Технологический стек

### Backend
- Python + FastAPI
- SQLAlchemy  
- PosgreSQL 
- Pydantic   
- Swagger/OpenAPI документация  
- Docker контейнеризация  
- Nginx как reverse proxy  
- Pytest для тестирования  

### Frontend
- React 19 
- TypeScript  
- Redux Toolkit  
- Tanstack Query  
- Axios
- React Router
- SCSS модули  
- Docker

## Структура проекта

```
├── backend/                    # Backend сервер
│   ├── src/
│   │   ├── core/               # Ядро приложения (конфигурация, зависимости)
│   │   ├── db/                 # Подключение базы данных, модели БД
│   │   ├── repositories/       # Классы для работы с БД
│   │   ├── routers/            # API и схемы Pydantic
│   │   ├── services/           # Внешние сервисы
│   │   └── main.py             # Главный файл, точка входа
│   ├── tests/                  # API и Unit тесты
│   ├── alembic/                # Взаимодействие с Alembic (миграции)
│   ├── .env.example            # Пример для переменных окружения
│   ├── .gitignore              # Файл игнора для GIT
│   ├── alembic.ini             # Файл инициализация для Alembic
│   ├── Dockerfile              # Docker конфигурация
│   ├── logger.py               # Класс для логирования
│   ├── requirements.txt        # Зависимости
│   └── ruff.toml               # Настройка линтера
├── frontend/                   # Frontend приложение
├── public/                     # Frontend приложение
│   ├── src/
│   │   ├── app/                # Корень приложения, routers, layouts, providers
│   │   ├── entities/           # Бизнес-объекты с логикой и UI
│   │   ├── features/           # Функциональные фичи
│   │   ├── pages/              # Страницы приложения
│   │   ├── shared/             # Общие утилиты, компоненты
│   │   ├── widgets/            # Переиспользуемые, составные UI-компоненты
│   │   └── main.tsx            # Точка входа приложения React
│   ├── .env.development/       # Тестовые переменные окружения
│   ├── .gitignore/             # Файл игнора для GIT
│   ├── Dockerfile              # Docker конфигурация
│   ├── eslint.config.js        # Конфигурация ESLint для проверки кода на ошибки и стиль
│   ├── index.html              # Основной HTML-файл проекта
│   ├── package-lock.json       # Зафиксированные версии зависимостей для точной сборки
│   ├── package.json            # Метаданные проекта и список зависимостей
│   ├── tsconfig.app.json       # Конфигурации TypeScript
│   ├── tsconfig.json           # Конфигурации TypeScript
│   ├── tsconfig.node.json      # Конфигурации TypeScript
│   ├── vite.config.ts          # Зависимости    
└── README.md                   # Конфигурация Vite
```

## Основные функции

### Пользовательская часть
- Регистрация и авторизация с подтверждением кода через почту
- Просмотр каталога товаров
- Поиск и фильтрация товаров
- Корзина покупок
- Оформление заказов
- История заказов
- Личный кабинет

### Административная часть
- Управление товарами (CRUD)
- Управление заказами (изменения статуса заказа, удаление)
- Управление каталогом (CRUD)

## Установка и запуск

### Предварительные требования
- Docker и Docker Compose
- Node.js 18+
- PosgreSQL 16+

### Локальная разработка

1. Клонировать репозиторий:
```bash
git clone <repository-url> .
```

2. Настроить переменные окружения::
```bash
cd backend
# .env
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>

SECRET_KEY=<YOUR_SECRET_KEY>

SMTP_HOST=<SMTP_HOST>
SMTP_PORT=<SMTP_PORT>
SMTP_USER=<SMTP_USER>
SMTP_PASSWORD=<SMTP_PASSWORD>
SMTP_FROM=<SMTP_FROM_EMAIL>

VERIFICATION_CODE_EXPIRE_MINUTES=<EXPIRE_MINUTES>

S3_ENDPOINT_URL=<S3_ENDPOINT_URL>
S3_BUCKET=<S3_BUCKET_NAME>
S3_ACCESS_KEY=<S3_ACCESS_KEY>
S3_SECRET_KEY=<S3_SECRET_KEY>
S3_REGION=<S3_REGION>
S3_ADDRESSING_STYLE=<S3_ADDRESSING_STYLE>
```

3. Установить зависимости:
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

4. Запустить в режиме разработки:
```bash
# Backend
cd backend
uvicorn src.main:app

# Frontend
cd frontend
npm run dev
```

## Docker развертывание
1. В корне проекта создать файл docker-compose.yaml:
```bash
services:
  db:
    image: postgres:18
    restart: always
    environment:
      POSTGRES_USER: ВАШ ПОЛЬЗОВАТЕЛЬ
      POSTGRES_PASSWORD: ВАШ ПАРОЛЬ ОТ БД
      POSTGRES_DB: ВАШЕ НАЗВАНИЕ БД
    volumes:
      - postgres_data:/var/lib/postgresql
    ports:
      - "5432:5432"
    networks:
      - app-network

  backend:
    build: ./backend
    restart: always
    env_file:
      - ./backend/.env
    depends_on:
      - db
    expose:
      - "8000"
    networks:
      - app-network

  frontend:
    build: ./frontend
    restart: always
    expose:
      - "5555"
    depends_on:
      - backend
    networks:
      - app-network

  nginx:
    image: nginx:1.24-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge

```

2. Собрать и запустить контейнеры:
```bash
docker compose up -d --build
```

3. Проверить статус:
```bash
docker compose ps
```
## API Документация
Swagger UI доступен по адресу: http://127.0.0.1:8000/api/docs

### Тестирование
```bash
# Backend
cd backend
pytest

# Frontend
cd ../frontend
npm run test
```

### Миграции
```bash
# Создать новую миграцию
alembic revision --autogenerate -m "Название вашей миграции"

# Применить миграции
alembic upgrade head

# Откатить миграции
alembic downgrade -1

# Текущая миграция
alembic current
```

### Безопасность
- JWT аутентификация
- XSS защита
- SSL/TLS шифрование

### CI/CD
- GitHub Actions для автоматизации
- Автоматическое тестирование
- Автоматический деплой
  
### Лицензия
MIT

### Контакты
Для вопросов и предложений: stassinelnikov6@gmail.com
