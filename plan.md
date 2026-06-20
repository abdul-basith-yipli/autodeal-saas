# AutoDeal SaaS — Used Vehicle E-commerce Platform

## Overview
Multi-tenant SaaS platform for used vehicle dealerships. Supports multiple showrooms, staff roles, departments, vehicle inventory with dynamic specs, customer enquiry management with follow-ups, sales tracking, real-time notifications, and admin dashboards.

## Tech Stack
| Layer | Technology |
|---|---|
| Backend | Django 5.2, Django REST Framework, Django Channels |
| Frontend | React 19 + Vite + Material UI (MUI) |
| Database | PostgreSQL 16 |
| Cache / WS | Redis 7 |
| Async Tasks | Celery + Redis broker |
| Auth | djangorestframework-simplejwt (JWT) |
| Multi-tenancy | Shared schema, tenant_id FK on all scoped models |
| Containerization | Docker + docker-compose |
| Testing | pytest, pytest-django, factory-boy |
| API Docs | drf-spectacular (OpenAPI 3) |

## Project Structure
```
autodeal/
├── backend/
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── tenants/           # Company/Tenant CRUD
│   │   ├── accounts/          # User model, roles, JWT auth
│   │   ├── showrooms/         # Branch management
│   │   ├── departments/       # Organizational units
│   │   ├── staff/             # Employees, positions, performance
│   │   ├── vehicles/          # Categories, brands, models, specs, inventory
│   │   ├── enquiries/         # Customer enquiries + follow-ups
│   │   ├── sales/             # Deal closure, payments, documents
│   │   ├── notifications/     # Channels consumers, notification model
│   │   └── dashboard/         # Aggregated analytics endpoints
│   ├── common/                # Base models, mixins, tenant utilities
│   ├── requirements/
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── vehicles/
│   │   │   ├── enquiries/
│   │   │   ├── showrooms/
│   │   │   ├── staff/
│   │   │   └── sales/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx/
    └── default.conf
```

## Django Apps & Models

### 1. tenants — Company/Tenant Management
- `Tenant` (id, name, slug, domain, logo, subscription_tier, is_active, created_at)
- `TenantConfig` (id, tenant, currency, timezone, date_format)

### 2. accounts — Authentication & Roles
- `User` (extends AbstractBaseUser) — email-based auth, role field
- Roles: `super_admin`, `tenant_admin`, `showroom_manager`, `sales_staff`, `cr_staff`, `inventory_staff`, `finance_staff`

### 3. showrooms — Multi-Branch Support
- `Showroom` (id, tenant, name, code, address, phone, email, manager, is_active)
- `ShowroomPerformance` (id, showroom, period, metrics JSON)

### 4. departments — Organizational Structure
- `Department` (id, tenant, name, code, description, is_active)

### 5. staff — Employee Management
- `StaffProfile` (id, user, tenant, showroom, department, position, employee_id, joining_date, phone, address, is_active)
- `Position` (id, tenant, title, department, level, base_salary)
- `PerformanceRecord` (id, staff, period_start, period_end, metric_name, metric_value, target_value)

### 6. vehicles — Core Inventory (EAV specs)
- `VehicleCategory` (id, tenant, name, slug, parent)
- `VehicleBrand` (id, tenant, name, logo)
- `VehicleModel` (id, brand, name)
- `VehicleYear` (id, model, year)
- `VehicleSpecification` (id, tenant, category, name, field_type, is_required, options)
- `VehicleSpecValue` (id, vehicle, specification, value)
- `Vehicle` (id, tenant, showroom, category, brand, model, year, vin, reg_number, mileage, fuel_type, transmission, color, condition, price, status, added_by, added_at)
- `VehicleImage` (id, vehicle, image, is_primary, sort_order)
- `VehicleInspection` (id, vehicle, inspector, report, rating, inspected_at)
- `VehiclePriceHistory` (id, vehicle, old_price, new_price, changed_by, changed_at)

### 7. enquiries — Customer Relations
- `Customer` (id, tenant, name, phone, email, address, city, state, source, created_at)
- `Enquiry` (id, tenant, customer, vehicle, showroom, assigned_to, source, message, status, expected_budget, created_at)
- `FollowUp` (id, enquiry, assigned_to, note, followup_type, status, scheduled_at, completed_at)
- `CommunicationLog` (id, enquiry, staff, type, note, attachment, created_at)

### 8. sales — Deal Management
- `Sale` (id, tenant, showroom, vehicle, customer, sales_staff, sale_price, tax, fees, total_amount, payment_method, payment_status, sale_date, delivery_date)
- `SaleDocument` (id, sale, document_type, file, uploaded_at)
- `Commission` (id, sale, staff, amount, paid)

### 9. notifications — Real-time
- `Notification` (id, recipient, tenant, title, message, type, is_read, link, created_at)
- Django Channels WebSocket consumer

## API Endpoints
```
POST   /api/auth/login/
POST   /api/auth/refresh/
POST   /api/auth/register/
GET    /api/auth/me/

GET/POST    /api/tenants/
GET/PATCH   /api/tenants/{id}/

GET/POST    /api/showrooms/
GET/PATCH   /api/showrooms/{id}/
GET         /api/showrooms/{id}/performance/

GET/POST    /api/departments/
GET/PATCH   /api/departments/{id}/

GET/POST    /api/staff/
GET/PATCH   /api/staff/{id}/
GET/POST    /api/staff/{id}/performance/

GET/POST    /api/vehicle-categories/
GET/POST    /api/brands/
GET/POST    /api/models/
GET/POST    /api/years/
GET/POST    /api/vehicle-specs/
GET/POST    /api/vehicles/
GET/PATCH   /api/vehicles/{id}/
POST        /api/vehicles/{id}/images/
POST        /api/vehicles/{id}/inspect/

GET/POST    /api/customers/
GET/POST    /api/enquiries/
GET/PATCH   /api/enquiries/{id}/
GET/POST    /api/enquiries/{id}/followups/
GET/POST    /api/enquiries/{id}/communication-log/
PATCH       /api/followups/{id}/
POST        /api/followups/{id}/complete/

GET/POST    /api/sales/
GET         /api/sales/{id}/

GET         /api/notifications/
PATCH       /api/notifications/{id}/read/
WS          /ws/notifications/

GET         /api/dashboard/overview/
GET         /api/dashboard/showroom-comparison/
GET         /api/dashboard/staff-leaderboard/
GET         /api/dashboard/sales-trends/
GET         /api/dashboard/inventory-report/
```

## User Roles
| Feature | Super Admin | Tenant Admin | Showroom Mgr | Sales | CR | Inventory |
|---|---|---|---|---|---|---|
| Manage tenants | Y | - | - | - | - | - |
| Manage showrooms | Y | Y | - | - | - | - |
| Manage staff | Y | Y | Y (own) | - | - | - |
| Add vehicles | Y | Y | Y | Y | - | Y |
| Manage enquiries | - | Y | Y | - | Y | - |
| Manage follow-ups | - | Y | Y | - | Y | - |
| Close sales | Y | Y | Y | Y | - | - |
| View dashboards | Y | Y | Y | own | own | own |

## Implementation Phases
| Phase | Scope |
|---|---|
| v0.1 — Foundation | Docker, Django, User model, JWT auth, React scaffold, login |
| v0.2 — Core Data | Tenants, Showrooms, Departments, Staff models + CRUD |
| v0.3 — Vehicle Inventory | Categories, Brands, Models, Specs (EAV), Vehicle CRUD, images |
| v0.4 — Enquiries & Follow-ups | Customer, Enquiry, Follow-up, comm log |
| v0.5 — Sales & Deals | Sales, documents, commissions |
| v0.6 — Notifications | Django Channels, WebSocket, real-time alerts |
| v0.7 — Dashboards | Analytics endpoints, React charts, performance reports |
| v1.0 — Launch | Permissions hardening, testing, CI/CD, polish |
