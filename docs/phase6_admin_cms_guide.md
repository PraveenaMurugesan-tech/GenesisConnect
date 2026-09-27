# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 6: Admin CMS / Product & Content Management Specification
# ==============================================================================

## 1. Executive Summary & Goals

Phase 6 delivers a secure, production-grade Administrative Content Management System (CMS) for authorized administrators of **Genesis Power Equipments Pvt. Ltd.** The CMS provides complete lifecycle management for:

1. **Industrial Equipment & Products**: Live CRUD operations, slug uniqueness, strict category validation, dynamic key-value specification editing, and active/inactive visibility toggles.
2. **Engineering Services**: Managed offerings for AMCs, maintenance, power quality audits, and commissioning.
3. **Homepage Business Content**: Managed hero headlines, value proposition copy, primary/secondary CTA actions, and featured product/service highlights.
4. **Corporate Contact Information**: Address, official board telephone, 24/7 emergency hotline, department emails, and support coverage hours.
5. **Website Notification Banners & Announcements**: Operational advisories, maintenance schedules, and factory announcements rendered dynamically on public portals.

All CMS operations integrate seamlessly with the existing FastAPI backend, SQLAlchemy ORM, PostgreSQL schema, JWT Bearer authentication, and React + TypeScript frontend.

---

## 2. Architecture & Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                 React + TypeScript Frontend                 │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │   Public Portal Views │       │   Protected Admin CMS │  │
│  │   - Home, About,      │       │   - Products Table    │  │
│  │     Products, Services│       │   - ProductForm &     │  │
│  │   - Contact & Dynamic │       │     SpecificationEd.  │  │
│  │     AnnouncementBanner│       │   - Services Manager  │  │
│  └───────────▲───────────┘       │   - Content & Announce│  │
│              │                   └───────────▲───────────┘  │
└──────────────┼───────────────────────────────┼──────────────┘
               │ (Public GET)                  │ (Bearer JWT Auth)
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       FastAPI Backend                       │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │ Public Read Endpoints │       │ Admin Control Endpoints│ │
│  │ /api/v1/products      │       │ /api/v1/admin/products│  │
│  │ /api/v1/services      │       │ /api/v1/admin/services│  │
│  │ /api/v1/content/*     │       │ /api/v1/admin/content │  │
│  │ /api/v1/announcements │       │ /api/v1/admin/announce│  │
│  └───────────▲───────────┘       └───────────▲───────────┘  │
│              │                               │              │
│              └───────────────┬───────────────┘              │
│                              ▼                              │
│                    SQLAlchemy 2.0 ORM                       │
│      Models: Product, Service, SiteContent, Announcement     │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
               PostgreSQL 15+ Relational Database
             (Alembic Migration: 0003_create_cms_tables)
```

### Security & Access Control
- **Authentication**: JWT access tokens signed with HMAC-SHA256 (`HS256`).
- **Authorization**: Protected endpoints enforce `Depends(get_current_admin)`. Requests without valid tokens are rejected with `401 Unauthorized`. Non-admin accounts receive `403 Forbidden`.
- **Public vs. Protected Separation**: Public product, service, and announcement APIs remain strictly read-only and return only active (`is_active == True`) records. All mutation APIs (`POST`, `PUT`, `PATCH`, `DELETE`) require administrator credentials.

---

## 3. Protected Admin API Endpoints

### 3.1 Product Management (`/api/v1/admin/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/admin/products` | List all products (with optional `category` and `is_active` filters) | Yes (Admin) |
| `POST` | `/api/v1/admin/products` | Create a new product with structured specifications | Yes (Admin) |
| `GET` | `/api/v1/admin/products/{id}` | Get product details by primary key | Yes (Admin) |
| `PUT` | `/api/v1/admin/products/{id}` | Full update of product fields and specifications | Yes (Admin) |
| `PATCH` | `/api/v1/admin/products/{id}/status` | Toggle or explicitly set active/inactive status | Yes (Admin) |
| `DELETE` | `/api/v1/admin/products/{id}` | Soft-deactivate or permanently delete (`?hard_delete=true`) | Yes (Admin) |

### 3.2 Engineering Services Management (`/api/v1/admin/services`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/admin/services` | List all services (active and inactive) | Yes (Admin) |
| `POST` | `/api/v1/admin/services` | Create new service offering | Yes (Admin) |
| `GET` | `/api/v1/admin/services/{id}` | Get service details by ID | Yes (Admin) |
| `PUT` | `/api/v1/admin/services/{id}` | Update service details | Yes (Admin) |
| `PATCH` | `/api/v1/admin/services/{id}/status` | Toggle service active status | Yes (Admin) |
| `DELETE` | `/api/v1/admin/services/{id}` | Delete service offering | Yes (Admin) |

### 3.3 Site Content & Contact Management (`/api/v1/admin/content`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/admin/content/homepage` | Get editable homepage copy & featured item slugs | Yes (Admin) |
| `PUT` | `/api/v1/admin/content/homepage` | Update homepage hero copy, CTA buttons, and featured slugs | Yes (Admin) |
| `GET` | `/api/v1/admin/content/contact` | Get official corporate contact details | Yes (Admin) |
| `PUT` | `/api/v1/admin/content/contact` | Update address, telephones, emails, and operating hours | Yes (Admin) |

### 3.4 Announcements & Advisories (`/api/v1/admin/announcements`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/admin/announcements` | List all announcements with optional status filter | Yes (Admin) |
| `POST` | `/api/v1/admin/announcements` | Create new announcement banner | Yes (Admin) |
| `GET` | `/api/v1/admin/announcements/{id}` | Get announcement details | Yes (Admin) |
| `PUT` | `/api/v1/admin/announcements/{id}` | Update announcement copy, links, and dates | Yes (Admin) |
| `PATCH` | `/api/v1/admin/announcements/{id}/status` | Toggle active status | Yes (Admin) |
| `DELETE` | `/api/v1/admin/announcements/{id}` | Permanently remove announcement | Yes (Admin) |

### 3.5 Public Read Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/content/homepage` | Returns active homepage hero messaging & featured slugs | None (Public) |
| `GET` | `/api/v1/content/contact` | Returns verified corporate address & emergency hotline | None (Public) |
| `GET` | `/api/v1/announcements` | Returns active banners within valid scheduled dates | None (Public) |

---

## 4. Frontend Admin CMS Components

1. **`AdminProductsPage` (`/admin/products`)**:
   - Product count KPI badges.
   - Search by name, category filter, active/inactive status filter.
   - Live status toggle with instant UI feedback.
   - Soft/hard delete confirmation dialog.
   - Direct link to public product page for previewing.

2. **`ProductForm` & `SpecificationEditor` (`/admin/products/new`, `/admin/products/:id/edit`)**:
   - Single reusable form component handling both creation and editing.
   - Slug auto-generation with manual override and format validation.
   - Genesis category selector: `"UPS"`, `"Voltage Stabilizers"`, `"Power Conditioning"`, `"Medical Power Solutions"`, `"Other"`.
   - Structured key-value specification editor with Genesis technical presets (Capacity Range, Input Voltage, Output Voltage, Topology, Efficiency, etc.), row reordering, and instant deletion.
   - Image reference URLs and datasheet document links.

3. **`AdminServicesPage` (`/admin/services`)**:
   - Full CRUD modal for Genesis engineering services.
   - Status toggle and soft-delete capabilities.
   - Live synchronization with public service listings.

4. **`AdminContentPage` (`/admin/content`, `/admin/contact-info`, `/admin/announcements`)**:
   - Tab 1: **Homepage CMS** (Hero headline, subheadline, primary/secondary CTA labels and destinations, featured equipment checklist, featured services checklist).
   - Tab 2: **Contact Information** (Registered address, Guindy plant location, board phone, emergency 24/7 hotline, sales and support emails, coverage hours).
   - Tab 3: **Announcements & Banners** (Banner creation, start/end scheduling, link URLs, live activate/deactivate, delete modal).

5. **`AnnouncementBanner` (Public Layout)**:
   - Dismissible gradient banner mounted on public headers.
   - Automatically polls `/api/v1/announcements` and displays active corporate alerts.
   - Session storage persistence for dismissed announcements.

---

## 5. Database Models & Schema Migrations

Three new database models were introduced in Phase 6:

1. **`Service` (`app/models/service.py`)**:
   - `id`: Integer primary key.
   - `title`: String(255), not null.
   - `slug`: String(255), unique, indexed.
   - `description`: Text, optional.
   - `image_url`: String(512), optional.
   - `is_active`: Boolean, default true, indexed.
   - `created_at`, `updated_at`: DateTime(timezone=True).

2. **`SiteContent` (`app/models/site_content.py`)**:
   - `id`: Integer primary key.
   - `key`: String(100), unique, indexed (e.g. `"homepage"`, `"contact"`).
   - `content`: JSONB (PostgreSQL) / JSON (SQLite fallback), not null.
   - `updated_at`: DateTime(timezone=True).

3. **`Announcement` (`app/models/announcement.py`)**:
   - `id`: Integer primary key.
   - `title`: String(255), not null.
   - `content`: Text, not null.
   - `link_url`: String(512), optional.
   - `link_text`: String(100), optional.
   - `is_active`: Boolean, default true, indexed.
   - `start_date`, `end_date`: DateTime(timezone=True), optional.
   - `created_at`, `updated_at`: DateTime(timezone=True).

### Alembic Migration
- Migration file: `backend/alembic/versions/0003_create_cms_tables.py`
- Up revision: `0002_create_enquiries_table`
- Command to execute once PostgreSQL is reachable:
  ```bash
  cd backend
  alembic upgrade head
  ```

---

## 6. How to Run & Test

### Starting the Backend
```powershell
cd c:\Users\prave\OneDrive\Desktop\Pravee\GenesisConnect\backend
venv\Scripts\activate  # if virtualenv configured
uvicorn app.main:app --reload --port 8000
```
Swagger OpenAPI docs: `http://localhost:8000/docs`

### Starting the Frontend
```powershell
cd c:\Users\prave\OneDrive\Desktop\Pravee\GenesisConnect\frontend
npm run dev
```
Public site: `http://localhost:5173/`
Admin Portal: `http://localhost:5173/admin/login`

### Running Backend Pytest Suite
```powershell
cd c:\Users\prave\OneDrive\Desktop\Pravee\GenesisConnect\backend
pytest
```
Results: **37 passed** in ~11s.

### Running Frontend Validation
```powershell
cd c:\Users\prave\OneDrive\Desktop\Pravee\GenesisConnect\frontend
npx tsc --noEmit
npm run build
```
Results: **Zero errors**, production build bundled cleanly into `dist/`.

---

## 7. Environment Status & Pending Verification

> [!IMPORTANT]
> **Pending Local PostgreSQL Execution Note**:
> The local PostgreSQL database is currently offline on the developer workstation (`localhost:5432`).
>
> All backend models, Pydantic schemas, admin controllers, repository queries, and Alembic migrations (`0003_create_cms_tables.py`) are **100% code-complete** and validated using SQLite in-memory isolated test runs.
>
> Migration execution (`alembic upgrade head`) and live PostgreSQL database verification will be executed once the PostgreSQL service is started on the developer host. No architecture or database technology has been modified or replaced.
