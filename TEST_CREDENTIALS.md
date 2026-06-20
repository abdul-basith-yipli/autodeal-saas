# Test Credentials

## Staff / Admin

| Email | Password | Role | Notes |
|---|---|---|---|
| `admin@autodeal.com` | `password123` | super_admin | Full system access |
| `demo@autodeal.com` | `demo1234` | tenant_admin | Demo Dealership tenant manager |

## Customer Portal

| Email | Password | Role | Notes |
|---|---|---|---|
| `customer@test.com` | `pass1234` | customer | Test customer account |
| `jane@example.com` | `testpass123` | customer | Registered during dev |

## URL Reference

| Page | URL | Auth Required |
|---|---|---|
| Public listing | `/browse` | No |
| Staff login | `/login` | No |
| Customer login | `/customer/login` | No |
| Customer registration | `/register` | No |
| Staff dashboard | `/` | Yes (staff) |
| Customer dashboard | `/customer/dashboard` | Yes (customer) |
