# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 7: Customer Enquiry & Quotation Management System Specification
# ==============================================================================

## 1. Executive Summary & Goals

Phase 7 implements the complete customer enquiry and quotation workflow for **Genesis Power Equipments Pvt. Ltd.** The system provides seamless digital intake for:

1. **Request for Quotation (RFQ)**: Prospective clients specify equipment lines from the product catalogue, desired capacity ratings, project scope, and contact coordinates.
2. **Customized Power Requirements**: Clients with non-standard technical loads (medical imaging, semiconductor cleanrooms, harmonic mitigation, extreme climates) submit in-depth electrical profiles, battery specifications, and attachment references.
3. **General Contact Messages**: Direct customer correspondence from the official contact portal, routed cleanly to engineering and corporate desks.

All submissions are validated by the FastAPI backend, persisted with default initial statuses (`NEW` or `UNREAD`) in PostgreSQL, and made accessible exclusively to authenticated administrators through the Admin Enquiries dashboard (`/admin/enquiries` and `/admin/enquiries/:type/:id`).

---

## 2. Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                      React + TypeScript Frontend                       │
│  ┌────────────────────────┐              ┌──────────────────────────┐  │
│  │   Public Customer Forms│              │   Protected Admin CMS    │  │
│  │   - /request-quote     │              │   - /admin/enquiries     │  │
│  │   - /customized-req.   │              │   - /admin/enquiries/    │  │
│  │   - /contact           │              │     :type/:id (Detail)   │  │
│  └───────────┬────────────┘              └────────────▲─────────────┘  │
└──────────────┼────────────────────────────────────────┼────────────────┘
               │ (Public POST)                          │ (Admin GET/PATCH + JWT)
               ▼                                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend v1.0.0                          │
│  ┌────────────────────────┐              ┌──────────────────────────┐  │
│  │ Public Intake Endpoints│              │ Protected Admin Endpoints│  │
│  │ POST /quote-requests   │              │ GET   /admin/quote-reqs  │  │
│  │ POST /custom-reqs      │              │ PATCH /admin/quote-reqs/ │  │
│  │ POST /contact-messages │              │       :id/status         │  │
│  │ (Safe Sanitization)    │              │ (Admin Auth via JWT)     │  │
│  └───────────┬────────────┘              └────────────▲─────────────┘  │
│              └───────────────────┬────────────────────┘                │
│                                  ▼                                     │
│                         SQLAlchemy 2.0 ORM                             │
│               QuoteRequest, CustomRequirement, ContactMessage          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
                   PostgreSQL 15+ Relational Database
               (Alembic Migration: 0004_create_enquiry_tables)
```

### Security & Privacy Protections
- **Public Create Access**: Unauthenticated visitors can create enquiry records via public `POST` endpoints.
- **Strict Listing & Modification Protection**: Public users cannot list (`GET`), inspect (`GET /{id}`), modify (`PATCH`), or delete any enquiries.
- **Admin Authentication**: All administrative review endpoints require a valid JWT Bearer token verified against the administrative user repository (`Depends(get_current_admin)`).
- **Data Protection**: Internal database stack traces, SQL errors, and sensitive customer coordinates are never leaked in error messages.

---

## 3. Database Models & Schema

The enquiry data layer is defined in `backend/app/models/enquiry.py` using SQLAlchemy 2.0 mapped columns:

### A. QuoteRequest (`quote_requests`)
- `id`: Integer (PK, autoincrement)
- `customer_name`: String(255), not null
- `company_name`: String(255), nullable
- `email`: String(255), indexed, not null
- `phone`: String(50), not null
- `product_id`: Integer, ForeignKey to `products.id` with `ondelete="SET NULL"`, nullable, indexed
- `product_name`: String(255), nullable
- `quantity`: String(50), nullable
- `requirement`: Text, nullable
- `message`: Text, nullable
- `status`: Enum `QuoteStatus` (`NEW`, `CONTACTED`, `IN_PROGRESS`, `QUOTED`, `CLOSED`), default `NEW`, indexed
- `created_at`: DateTime(timezone=True), default UTC now
- `updated_at`: DateTime(timezone=True), default UTC now, onupdate UTC now
- `product`: Relationship to `Product` model

### B. CustomRequirement (`custom_requirements`)
- `id`: Integer (PK, autoincrement)
- `customer_name`: String(255), not null
- `company_name`: String(255), nullable
- `email`: String(255), indexed, not null
- `phone`: String(50), not null
- `product`: String(255), nullable
- `capacity`: String(100), nullable
- `battery_specifications`: String(255), nullable
- `backup_requirements`: String(255), nullable
- `equipment_information`: Text, nullable
- `additional_requirements`: Text, nullable
- `document_url`: String(512), nullable
- `status`: Enum `RequirementStatus` (`NEW`, `CONTACTED`, `IN_PROGRESS`, `QUOTED`, `CLOSED`), default `NEW`, indexed
- `created_at`: DateTime(timezone=True), default UTC now
- `updated_at`: DateTime(timezone=True), default UTC now, onupdate UTC now

### C. ContactMessage (`contact_messages`)
- `id`: Integer (PK, autoincrement)
- `name`: String(255), not null
- `company_name`: String(255), nullable
- `email`: String(255), indexed, not null
- `phone`: String(50), nullable
- `subject`: String(255), nullable
- `message`: Text, not null
- `status`: Enum `ContactStatus` (`UNREAD`, `READ`, `REPLIED`, `CLOSED`, `ARCHIVED`), default `UNREAD`, indexed
- `created_at`: DateTime(timezone=True), default UTC now
- `updated_at`: DateTime(timezone=True), default UTC now, onupdate UTC now

---

## 4. Alembic Migrations

Migration file: `backend/alembic/versions/0004_create_enquiry_tables.py`
- Down revision: `0003_create_cms_tables`
- Creates enums: `quote_status_enum`, `requirement_status_enum`, `contact_status_enum`
- Creates tables: `quote_requests`, `custom_requirements`, `contact_messages`
- Creates indexes on IDs, emails, product foreign keys, and statuses
- Complete bidirectional rollback (`downgrade()`) dropping tables and enum types cleanly.

### Migration Commands:
```bash
# Execute upgrade in production PostgreSQL environment
cd backend
alembic upgrade head

# Rollback migration if necessary
alembic downgrade 0003_create_cms_tables
```

---

## 5. API Endpoints

### Public Endpoints (No Authentication Required)
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/quote-requests` | Submit customer quotation request |
| `POST` | `/api/v1/quotes` | Alias for backwards compatibility |
| `POST` | `/api/v1/custom-requirements` | Submit customized industrial requirement |
| `POST` | `/api/v1/contact-messages` | Submit direct corporate message |
| `POST` | `/api/v1/contact` | Alias for backwards compatibility |

### Protected Administrator Endpoints (Requires Bearer JWT)
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Admin dashboard metrics with live enquiry counts |
| `GET` | `/api/v1/admin/quote-requests` | List quote requests (filters: `status`, `search`, `product_id`) |
| `GET` | `/api/v1/admin/quote-requests/{id}` | Retrieve quote request detail by ID |
| `PATCH`| `/api/v1/admin/quote-requests/{id}/status` | Update quote workflow status (`NEW` -> `CLOSED`) |
| `GET` | `/api/v1/admin/custom-requirements` | List custom requirements (filters: `status`, `search`) |
| `GET` | `/api/v1/admin/custom-requirements/{id}` | Retrieve custom requirement detail by ID |
| `PATCH`| `/api/v1/admin/custom-requirements/{id}/status` | Update requirement workflow status |
| `GET` | `/api/v1/admin/contact-messages` | List direct contact messages (filters: `status`, `search`) |
| `GET` | `/api/v1/admin/contact-messages/{id}` | Retrieve contact message detail by ID |
| `PATCH`| `/api/v1/admin/contact-messages/{id}/status` | Update message status (`UNREAD` -> `ARCHIVED`) |

---

## 6. Status Lifecycle & Workflow

### Quotations & Custom Requirements Lifecycle
```
[ NEW ] ──► [ CONTACTED ] ──► [ IN_PROGRESS ] ──► [ QUOTED ] ──► [ CLOSED ]
  Initial      Client reached     Proposal in       Official quote   Sale won or
  intake       by sales engineer  drafting stage    delivered        archived
```

### Direct Contact Messages Lifecycle
```
[ UNREAD ] ──► [ READ ] ──► [ REPLIED ] ──► [ CLOSED ] (or [ ARCHIVED ])
  New message    Assigned to    Response sent   Inquiry         Message
  received       support lead   to customer     resolved        stored
```

---

## 7. Frontend Integration & User Experience

1. **Request Quote Page (`/request-quote`)**:
   - Dynamic equipment preselection via `/request-quote?product=<slug>`.
   - Comprehensive validation for contact name, company, email, and phone.
   - Live API submission via `submitQuoteRequest`.
   - Double-submission protection: buttons disabled, spinner displayed.
   - Clean confirmation view with generated reference dossier code (e.g. `GEN-QT-00001`).

2. **Customized Requirement Page (`/customized-requirement`)**:
   - Complete technical intake: equipment line, capacity rating, battery bank specs, autonomy run time, load characteristics, and document attachment reference.
   - Live API submission via `submitCustomRequirement`.
   - Accessible error banners and form reset controls.

3. **Contact Page (`/contact`)**:
   - Validates name, corporate email, mobile number, subject, and message.
   - Dispatches payload to `/contact-messages`.
   - Clear confirmation dossier reference (e.g. `GEN-MSG-00001`).

4. **Admin Enquiries Inbox (`/admin/enquiries`)**:
   - Tabbed layout: "Quotation Requests", "Custom Requirements", "Direct Inquiries".
   - Badges showing record counts for each category.
   - Search bar filtering by customer name, company, email, or product.
   - Status dropdown filter.
   - Clean empty states when no records exist.

5. **Admin Enquiry Detail View (`/admin/enquiries/:type/:id`)**:
   - Complete customer coordinate dossier with clickable `mailto:` and `tel:` links.
   - Comprehensive technical scope and customer specifications.
   - Dedicated workflow status transition selector with instant backend patch.
   - Audit timestamps for creation and last update.

6. **Admin Dashboard Overview (`/admin/dashboard`)**:
   - Card 4 updated to reflect real live enquiry counts.
   - Clicking Card 4 links directly to `/admin/enquiries`.

---

## 8. Verification & Test Execution

### Backend Pytest Suite
All 57 backend tests pass cleanly in `backend/tests/`:
```bash
pytest
# Output:
# tests/test_admin.py ...                                                  [  5%]
# tests/test_admin_cms.py ............                                     [ 26%]
# tests/test_auth.py ..........                                            [ 43%]
# tests/test_enquiries.py ....................                             [ 78%]
# tests/test_health.py ...                                                 [ 84%]
# tests/test_products.py .........                                         [100%]
# ======================= 57 passed, 6 warnings in 10.61s =======================
```

### Frontend TypeScript & Vite Production Build
The React + Vite frontend builds with zero TypeScript errors:
```bash
cd frontend
npm run build
# Output:
# ✓ 1603 modules transformed.
# dist/index.html                   1.33 kB │ gzip:   0.69 kB
# dist/assets/index-BSG2JgQ6.css   61.34 kB │ gzip:  10.23 kB
# dist/assets/index-JUX5keLx.js   613.74 kB │ gzip: 156.69 kB
# ✓ built in 13.20s
```

### PostgreSQL Status & Production Deployment Note
- Local developer PostgreSQL at `localhost:5432` is currently not running on this development machine.
- All backend models, schemas, routers, dependencies, and Alembic migrations (`0004_create_enquiry_tables.py`) are strictly written for PostgreSQL and validated against isolated in-memory test databases.
- Database tests on a live PostgreSQL instance will be performed once the local PostgreSQL service is started or production environment credentials are provided.
