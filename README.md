# GenesisConnect — Official Web Platform & Customer Enquiry Management System

GenesisConnect is the official enterprise web platform and customer enquiry management system developed for **Genesis Power Equipments Pvt. Ltd.** Genesis Power Equipments specializes in industrial power conditioning, online uninterruptible power supplies (UPS), static voltage stabilizers, medical power solutions, and lifecycle maintenance services.

> **Project Phase Status: PHASE 9 COMPLETED (Final Testing, Security Audit, Deployment & Handover Ready)**  
> - Phase 0 — Planning & Architecture: COMPLETED
> - Phase 1 — Frontend Foundation & Components: COMPLETED
> - Phase 2 — Public Website Pages: COMPLETED
> - Phase 3 — Product Catalogue & Data Layer: COMPLETED
> - Phase 4 — Backend REST API & PostgreSQL Database: COMPLETED
> - Phase 5 — Admin Authentication & Protected Routes: COMPLETED
> - Phase 6 — Admin CMS (Products, Services, Announcements, Content): COMPLETED
> - Phase 7 — Enquiry & Quotation Management (Quotes, Custom Specs, Contact): COMPLETED
> - Phase 8 — Object Storage, Transactional Email & Security Hardening: COMPLETED
> - Phase 9 — Final Testing, Production Build, Deployment & Handover: COMPLETED

---

## 1. System Architecture

GenesisConnect employs a decoupled, production-ready multi-tier architecture:

```
                      +------------------------------------------+
                      |   DNS: genesispower.in / www. / api.     |
                      +--------------------+---------------------+
                                           |
                   +-----------------------+-----------------------+
                   | (HTTPS / TLS 1.3)                             | (HTTPS / TLS 1.3)
                   v                                               v
     +---------------------------+                   +---------------------------+
     |   Frontend (SPA)          |                   |   Backend (FastAPI)       |
     |   Host: Vercel / Edge     |                   |   Host: Render / Railway  |
     |   React 18 + TypeScript   |                   |   Python 3.11 ASGI Engine |
     |   Vite + Tailwind CSS     |                   |   Pydantic v2 + Security  |
     +-------------+-------------+                   +-------------+-------------+
                   |                                               |
                   |   REST API (JSON over HTTPS)                  |
                   +-----------------------------------------------+
                                                                   |
                            +--------------------------------------+--------------------------------------+
                            |                                      |                                      |
                            v                                      v                                      v
              +---------------------------+          +---------------------------+          +---------------------------+
              |   PostgreSQL Database     |          |   Object Storage          |          |   Transactional Email     |
              |   Host: Supabase / Cloud  |          |   Host: Supabase Storage  |          |   Provider: Resend / SMTP |
              |   Alembic Migrations      |          |   Private Document Vault  |          |   Domain Verified DKIM/SPF|
              +---------------------------+          +---------------------------+          +---------------------------+
```

---

## 2. Core Features & Modules

### 2.1 Public Web Platform
* **Homepage (`/`):** Dynamic hero showcase, company credibility metrics, equipment highlights, and customer testimonial trust badges.
* **About Us (`/about`):** Engineering philosophy, corporate values, facility details, and manufacturing credentials.
* **Equipment Catalogue (`/products`):** Multi-category filtering (`UPS`, `Voltage Stabilizers`, `Power Conditioning`, `Medical Power Solutions`), keyword search, and pagination. Inactive/draft products are strictly hidden.
* **Product Detail (`/products/:slug`):** Full technical ratings, topology breakdown, application notes, datasheet availability notices, and 1-click quote pre-population.
* **Services (`/services`):** Comprehensive engineering service overview (AMC, harmonic calibration, load bank testing).
* **Quotation Generator (`/request-quote`):** Intelligent RFQ form with URL query pre-population (`?product=slug`), validation, and duplicate-click protection.
* **Customized Requirements (`/customized-requirement`):** Engineering sizing calculator with secure technical specification PDF uploads.
* **Contact (`/contact`):** Corporate inquiry submission with validated contact information and direct emergency hotlines.

### 2.2 Protected Admin Console
* **Authentication (`/admin/login`):** Secure bcrypt password hashing, JWT bearer token generation, and automatic session expiration handling.
* **Dashboard (`/admin/dashboard`):** Real-time inquiry KPIs, recent submissions feed, and system health status.
* **Product Management (`/admin/products`):** Full CRUD interface with dynamic specification editor, status toggling (publish/draft), image uploads, and datasheet attachments.
* **Service Management (`/admin/services`):** Create, update, and manage engineering service deliverables.
* **Content Management (`/admin/content`):** Real-time homepage content editing, contact details management, and public emergency advisory announcements.
* **Enquiry Management (`/admin/enquiries`):** Unified dossier covering Quote Requests, Customized Requirements, and Contact Messages with status progression (`NEW` -> `CONTACTED` -> `IN_PROGRESS` -> `QUOTED` -> `CLOSED`) and temporary 1-hour signed URL access to private customer documents.

### 2.3 Storage & File Security
* **Product Images:** Public bucket with MIME validation (`image/jpeg`, `image/png`, `image/webp`) and 5MB size limit.
* **Datasheets:** Public PDF bucket with magic byte validation and 10MB size limit.
* **Customer Attachments:** Strictly private bucket (`requirement-documents`). Zero direct public access. Only accessible by authorized administrators via backend signed URLs.

### 2.4 Security & Abuse Protection
* **OWASP Security Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy`, and `Permissions-Policy`.
* **CORS Restrictions:** Hardened against wildcard origin exploits in production mode.
* **Abuse Protection / Rate Limiting:** Sliding-window IP rate limiting protecting public form submissions and upload endpoints.
* **Input Sanitization:** HTML tag stripping and pseudo-protocol rejection protecting against stored XSS attacks.
* **Log Masking:** Automatic filtering of JWT tokens, passwords, and sensitive keys from application logs.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript 5.4, Vite 5.4, Tailwind CSS 3.4, Lucide Icons, Axios |
| **Backend** | Python 3.11, FastAPI 0.110, Pydantic v2, Uvicorn, Starlette |
| **Database & ORM** | PostgreSQL 15+, SQLAlchemy 2.0, Alembic 1.13, Psycopg3 |
| **Security & Auth** | Python-Jose (JWT HS256), Passlib (Bcrypt), Python-Multipart |
| **Storage** | Supabase Storage (S3-compatible object storage with signed URL engine) |
| **Email** | Multi-provider transactional email service (Resend, SMTP, Console fallback) |
| **Testing** | Pytest 8.4, Pytest-Asyncio, FastAPI TestClient, SQLite in-memory runner |

---

## 4. Repository Structure

```text
GenesisConnect/
├── .env.example                               # Root environment configuration template
├── .gitignore                                 # Git ignore rules (secrets & builds excluded)
├── README.md                                  # Master project documentation
├── docs/                                      # Project documentation & guides
│   ├── deployment.md                          # Production deployment guide
│   ├── handover.md                            # Client administration & handover manual
│   ├── production-checklist.md                # Final pre-flight verification checklist
│   ├── architecture.md                        # Architectural specification
│   ├── database_schema.md                     # PostgreSQL relational schema
│   ├── api_specification.md                   # REST API documentation
│   └── phase8_storage_email_security_guide.md # Storage, email, and security guide
├── backend/                                   # FastAPI Backend Application
│   ├── alembic/                               # Alembic migration revisions (0001–0005)
│   ├── app/
│   │   ├── api/v1/                            # API v1 route endpoints
│   │   ├── core/                              # Config, database, security, rate limiter, headers
│   │   ├── db/                                # Session maker, seed scripts (products, admin)
│   │   ├── models/                            # SQLAlchemy ORM models (8 entities)
│   │   ├── repositories/                      # Repository data-access layer
│   │   ├── schemas/                           # Pydantic validation schemas
│   │   ├── services/                          # Storage (Supabase) and Email services
│   │   └── main.py                            # FastAPI entrypoint & middleware pipeline
│   ├── tests/                                 # 100+ automated unit & integration tests
│   ├── requirements.txt                       # Python dependencies
│   └── .env.example                           # Backend environment template
└── frontend/                                  # React Frontend Application
    ├── src/
    │   ├── auth/                              # ProtectedRoute & AuthContext
    │   ├── components/                        # Reusable UI, admin, and domain components
    │   ├── data/                              # Static data layer & corporate metadata
    │   ├── layouts/                           # PublicLayout & AdminLayout
    │   ├── pages/                             # Public and administrative views
    │   ├── routes/                            # React Router v6 definitions
    │   ├── services/                          # Axios API clients
    │   └── types/                             # TypeScript interfaces matching backend
    ├── package.json                           # NPM dependencies and scripts
    ├── tsconfig.json                          # TypeScript configuration
    └── vite.config.ts                         # Vite build configuration
```

---

## 5. Development & Local Setup

### 5.1 Prerequisites
- Node.js (v18+ recommended)
- Python (v3.11 recommended)
- Git

### 5.2 Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Run database migrations (requires local or cloud PostgreSQL)
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation: `http://localhost:8000/docs` (active in development mode).

### 5.3 Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```
Development web application: `http://localhost:5173`.

---

## 6. Automated Testing & Validation

### 6.1 Backend Automated Tests (Pytest)
GenesisConnect includes a test suite covering public routes, admin authentication, CMS operations, enquiry lifecycles, storage security, email resilience, and security headers:

```bash
cd backend
.venv\Scripts\activate
pytest
```
*Expected Result: 100+ tests passing (0 failures).*

### 6.2 Frontend Production Build Verification
```bash
cd frontend
npm run build
```
*Expected Result: Clean TypeScript compilation and Vite minification with 0 errors.*

---

## 7. Production Deployment Overview

GenesisConnect is prepared for zero-downtime deployment:
1. **Frontend:** Deploy to Vercel or Cloudflare Pages with SPA route rewriting.
2. **Backend:** Deploy to Render, Railway, or Linux VM via Uvicorn ASGI server.
3. **Database:** Supabase PostgreSQL or AWS RDS with automated daily backups.
4. **Storage:** Supabase Storage with bucket policies enforcing public images/datasheets and private customer documents.
5. **Email:** Transactional email via Resend or Google Workspace SMTP with verified SPF/DKIM records.

Refer to [`docs/deployment.md`](./docs/deployment.md) for full, step-by-step instructions.  
Refer to [`docs/production-checklist.md`](./docs/production-checklist.md) for the pre-flight verification checklist.  
Refer to [`docs/handover.md`](./docs/handover.md) for administrative handover procedures.

---

## 8. Ownership & Licensing

 pravee
* **System:** GenesisConnect
* **Client / Legal Owner:** Genesis Power Equipments Pvt. Ltd. (Chennai, Tamil Nadu, India)
* **Confidentiality:** Proprietary Enterprise Software developed exclusively for Genesis Power Equipments Pvt. Ltd.
=======
With Phase 4 (Backend + Database + Product API Integration) completed, Phase 5 will focus on:
1. Administrator authentication & JWT login workflow.
2. Protected Admin Dashboard for operations and inquiry overview.
3. Admin product management UI (CRUD operations for equipment catalogue).
4. Customer quotation enquiry submission and customized requirement submission workflow.
5. Automated transactional email alerts and PDF quote generation.
6. Object storage integration for requirement uploads.
 dev
