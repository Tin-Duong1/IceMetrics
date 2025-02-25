# IceMetrics

IceMetrics is a hockey analyzer app that utilizes OpenCV for automated game analysis. The application leverages AI capabilities with a React frontend and FastAPI backend.

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Backend Setup

1. Create and activate Python virtual environment:

```bash
cd server
python3 -m venv venv
source venv/bin/activate
```

2. Install requirements:

```bash
pip install -r requirements.txt
```

3. Configure environment:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```properties
DATABASE_URL=postgresql+psycopg2://username@localhost:5432/OpenCVAPP
```

## Database Setup

1. Install PostgreSQL and pgAdmin:

```bash
brew install postgresql@14
brew services start postgresql@14
```

2. Create database:

```bash
createdb OpenCVAPP
```

3. Apply database migrations:

```bash
cd server
alembic upgrade head
```

4. Start the FastAPI server:

```bash
uvicorn server:app --reload
```

## Development Guide

### Database Migrations

When making schema changes:

```bash
# Generate new migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

This maintains consistent database structure across all development instances.
