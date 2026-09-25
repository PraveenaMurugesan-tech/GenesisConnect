# GenesisConnect – Official Web Platform & Customer Enquiry Management System

GenesisConnect is the official digital web platform and customer enquiry management system developed for **Genesis Power Equipments Pvt. Ltd.** Genesis Power Equipments specializes in industrial power solutions, high-capacity diesel generators, customized energy systems, transformers, and electrical switchgear.

> **Project Phase Status: PHASE 4 COMPLETED (Backend + PostgreSQL + Product API Integration)**  
> - Phase 0 — Planning & Architecture: COMPLETED
> - Phase 1 — Frontend Foundation: COMPLETED
> - Phase 2 — Public Website: COMPLETED
> - Phase 3 — Product Catalogue & Data Layer: COMPLETED
> - Phase 4 — Backend + PostgreSQL Database + Product API Integration: COMPLETED  
>
> The production-ready backend is built with FastAPI, SQLAlchemy 2.0, PostgreSQL, Alembic migrations, and Pydantic v2. The frontend React catalogue is integrated with the backend REST API via Axios and a decoupled product service layer. Testing suite with 12 automated unit/integration tests verifies all API contracts.

---

## 1. System Architecture

GenesisConnect employs a decoupled, production-ready multi-tier architecture:

```
                    CUSTOMER / VISITOR
                            |
                            v
              +----------------------------+
              |       PUBLIC WEBSITE       |
              | React 18 + TypeScript      |
              | Vite + Tailwind CSS        |
              | React Router v6 + Axios    |
              +--------------+-------------+
                             |
                   HTTPS / JSON API
                             |
                             v
              +----------------------------+
              |      FASTAPI BACKEND       |
              | Python 3.11 + FastAPI      |
              | Pydantic v2 + SQLAlchemy   |
              | JWT Auth + Password Hash   |
              +--------------+-------------+
                             |
               +-------------+-------------+
               |                           |
               v                           v
      +------------------+       +-------------------+
      |    PostgreSQL    |       | Supabase Storage  |
      | Relational Data  |       | Images, Docs,     |
      | & Enquiries      |       | Datasheets        |
      +------------------+       +-------------------+
```

---

## 2. Core Modules & Entities

The system defines 8 relational PostgreSQL entities using SQLAlchemy 2.0 ORM:

1. **`User`**: Secure administrator authentication with bcrypt password hashing and JWT access tokens.
2. **`Product`**: Master equipment catalog (name, slug, description, features JSON, specifications JSON, category, image URL, datasheet URL).
3. **`ProductImage`**: Multi-image gallery per equipment item with display order.
4. **`ProductDocument`**: Technical PDF datasheets, dimensional drawings, and operation manuals.
5. **`Service`**: Industrial services offered (AMC, Installation, Commissioning, Overhauling).
6. **`QuoteRequest`**: Customer quotation inquiries with workflow statuses (`NEW`, `CONTACTED`, `IN_PROGRESS`, `QUOTED`, `CLOSED`).
7. **`CustomRequirement`**: Technical capacity requests (capacity, battery specs, backup requirements, equipment info, attachment URLs).
8. **`ContactMessage`**: General customer messages and inquiries.

---

## 3. Frontend Routing Foundation

Configured using React Router v6 with clean separation of public and administrative layouts:

### Public Website Routes (`PublicLayout`)
* `/` — Company landing page & industrial equipment showcase
* `/about` — About Genesis Power Equipments Pvt. Ltd.
* `/products` — Dynamic product catalog with category search
* `/products/:slug` — Product detail page with technical specs & datasheets
* `/services` — Engineering & lifecycle maintenance services
* `/request-quote` — Formal quotation submission system
* `/customized-requirement` — Sizing & customized power capacity form
* `/contact` — Company contact details & message inquiry

### Admin Routes (`AdminLayout`)
* `/admin/login` — Administrator JWT sign-in
* `/admin/dashboard` — Operations overview & inquiry KPIs
* `/admin/products` — Catalog management
* `/admin/products/new` — Create new equipment item
* `/admin/products/:id/edit` — Edit equipment & specifications
* `/admin/enquiries` — Customer quote & requirement management
* `/admin/enquiries/:id` — Inquiry dossier & status transition
* `/admin/services` — Manage listed maintenance services
* `/admin/content` — Manage announcements & hero banners
* `/admin/settings` — Admin profile & integration settings

---

## 4. Repository Structure

```text
GenesisConnect/
├── docs/                               # Phase 0 Architectural Specifications
│   ├── architecture.md                 # System context & tier architecture
│   ├── database_schema.md              # PostgreSQL schema & ER diagram
│   ├── api_specification.md            # REST API endpoints & request/response models
│   ├── routing_and_navigation.md       # Frontend routing architecture
│   └── supabase_storage_guide.md       # Storage bucket policies & upload flow
├── backend/                            # FastAPI Backend Foundation
│   ├── app/
│   │   ├── api/                        # API routes & dependency injection
│   │   │   ├── deps.py                 # Auth and DB session dependencies
│   │   │   └── v1/                     # Version 1 endpoints (products, quotes, auth...)
│   │   ├── core/                       # App configuration & security (JWT, bcrypt)
│   │   ├── db/                         # SQLAlchemy base & session maker
│   │   ├── models/                     # Relational ORM models (8 entities)
│   │   ├── schemas/                    # Pydantic validation schemas
│   │   ├── services/                   # Supabase Storage client
│   │   └── main.py                     # FastAPI application factory
│   ├── alembic/                        # Migration scripts & configuration
│   ├── alembic.ini                     # Alembic migration settings
│   ├── requirements.txt                # Python dependencies
│   └── .env.example                    # Backend environment template
├── frontend/                           # React Frontend Foundation
│   ├── src/
│   │   ├── layouts/                    # PublicLayout & AdminLayout
│   │   ├── pages/                      # Page components for all defined routes
│   │   │   └── admin/                  # Admin console pages
│   │   ├── routes/                     # Master React Router definition
│   │   ├── services/                   # Axios API client with token interceptor
│   │   ├── types/                      # TypeScript interfaces matching backend models
│   │   ├── App.tsx                     # Root router provider
│   │   ├── main.tsx                    # React DOM entry
│   │   └── index.css                   # Tailwind CSS directives & theme tokens
│   ├── package.json                    # Dependencies & scripts
│   ├── vite.config.ts                  # Vite build configuration with alias '@'
│   ├── tailwind.config.js              # Theme design tokens for Genesis Power
│   └── .env.example                    # Frontend environment template
├── .gitignore                          # Comprehensive ignore rules
├── .env.example                        # Root environment reference
└── README.md                           # Project documentation
```

---

## 5. Git Workflow Guidelines

* `dev` is the default/stable branch.
* `pravee` is the active development branch.
* All development commits are executed on `pravee`.
* Work is pushed to `origin/pravee`.
* Pull requests or merges into `dev` are performed only upon explicit review.

---

## 6. Getting Started

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation: `http://localhost:8000/docs`

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Development web application: `http://localhost:5173`

---

## 7. Next Steps: Phase 5 Implementation

With Phase 4 (Backend + Database + Product API Integration) completed, Phase 5 will focus on:
1. Administrator authentication & JWT login workflow.
2. Protected Admin Dashboard for operations and inquiry overview.
3. Admin product management UI (CRUD operations for equipment catalogue).
4. Customer quotation enquiry submission and customized requirement submission workflow.
5. Automated transactional email alerts and PDF quote generation.
6. Object storage integration for requirement attachment uploads.
