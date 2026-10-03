# DoAide Payroll

Indian payroll management system for SMBs.

## Layout

```
backend/          FastAPI + SQLAlchemy
  app/
    core/         config, database, security, deps, errors, middleware
    models/       SQLAlchemy ORM models
    routers/      FastAPI route handlers
    schemas/      Pydantic request/response models
    services/     Business logic (salary calc, payroll processing, PDF)
  tests/          pytest test suite
frontend/         React 18 + Vite + Tailwind CSS 3.4
  src/
    components/   Shell, ProtectedRoute
    hooks/        useAuth, useTheme, usePageTitle
    lib/          API client
    pages/        All page components
```

## Commands

```bash
# Backend
cd backend && pip install -r requirements.txt
cd backend && pytest
cd backend && uvicorn app.main:app --reload

# Frontend
cd frontend && npm install
cd frontend && npm test
cd frontend && npm run dev
```

## Rules

- Money columns use `Decimal(16, 2)`. Never use `float` for money.
- All business-scoped queries filter by `business_id`.
- Role hierarchy: owner > accountant > viewer.
- Indian payroll: PF 12% on basic (cap ₹15,000), ESI 0.75%+3.25% (cap ₹21,000 gross), TDS per FY 2024-25 slabs.
- Coverage gates are ratchets — never lower them.
- Comments explain why, not what.
- Tests are named as claims about behavior.
- Use Tailwind CSS 3.4 — do NOT upgrade to v4.
