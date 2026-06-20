# Running AutoDeal SaaS Locally

## Prerequisites

- Docker & Docker Compose
- Python 3.12+ (for native option)
- Node.js 20+ (for native option)

---

## Option 1: Docker (Full Stack — Recommended)

```bash
# 1. Start all services
docker compose up -d

# 2. Run database migrations
docker compose exec backend python manage.py migrate

# 3. Create a superuser
docker compose exec backend python manage.py createsuperuser

# 4. Open in browser
# Frontend:  http://localhost:5173
# API Docs:  http://localhost:8000/api/docs/
# Admin:     http://localhost:8000/admin/
```

### Useful Docker Commands

```bash
# View logs
docker compose logs -f backend

# Run tests
docker compose exec backend pytest

# Shell into backend
docker compose exec backend bash

# Make migrations
docker compose exec backend python manage.py makemigrations

# Stop everything
docker compose down
```

---

## Option 2: Native (Faster Reload, DB/Redis in Docker)

```bash
# 1. Start only DB and Redis
docker compose up -d db redis

# 2. Set up Python virtual environment
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements/development.txt

# 3. Run migrations & start backend
cd backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000

# 4. Install frontend deps & start (new terminal)
cd frontend
npm install
npm run dev

# 5. Open in browser
# Frontend:  http://localhost:5173
# API Docs:  http://localhost:8000/api/docs/
```

---

## Testing Auth Flow

```bash
# Register a new user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","full_name":"Test User","password":"testpass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"testpass123"}'

# Use the returned access token for authenticated requests
curl http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer <access_token>"
```

---

## Project Structure

```
autodeal/
├── backend/
│   ├── config/           # Django settings, URLs, ASGI/WSGI
│   ├── apps/
│   │   ├── accounts/     # User model, JWT auth
│   │   ├── tenants/      # Company/Tenant management
│   │   ├── showrooms/    # Branch management
│   │   ├── departments/  # Organizational units
│   │   ├── staff/        # Employees, positions
│   │   ├── vehicles/     # Inventory with EAV specs
│   │   ├── enquiries/    # Customer enquiries
│   │   ├── sales/        # Deal management
│   │   ├── notifications/# Real-time alerts
│   │   └── dashboard/    # Analytics
│   └── common/           # Base models, mixins
├── frontend/src/
│   ├── pages/            # Route pages
│   ├── components/       # Reusable UI
│   ├── contexts/         # Auth context
│   └── services/         # API clients
└── docker-compose.yml
```

---

## Running Tests

```bash
# Docker
docker compose exec backend pytest -v

# Native (with venv active)
cd backend && pytest -v
```
