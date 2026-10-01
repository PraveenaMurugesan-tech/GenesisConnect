# GenesisConnect — Production Deployment Guide
**Client:** Genesis Power Equipments Pvt. Ltd.  
**System:** GenesisConnect (Official Website & Customer Enquiry Management System)  
**Document Version:** 1.0 (Phase 9 Final Handover)  
**Target Environment:** Staging & Production  

---

## 1. Executive Architecture Overview

GenesisConnect is architected as a modern, decoupled web application engineered for industrial reliability, high security, and low operational overhead.

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
     |   Static Assets + React   |                   |   Python 3.11 ASGI Engine |
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
              |   Encrypted at Rest       |          |   Private Document Vault  |          |   Domain Verified DKIM/SPF|
              +---------------------------+          +---------------------------+          +---------------------------+
```

### Component Responsibilities:
- **Frontend:** React 18 Single Page Application built with Vite and Tailwind CSS. Hosted on Vercel or Cloudflare Pages with edge caching and automatic HTTPS.
- **Backend:** FastAPI (Python 3.11) ASGI application providing RESTful APIs, JWT authentication, rate limiting, and security headers. Hosted on Render, Railway, or containerized Linux VM.
- **Database:** PostgreSQL 15+ managed instance (Supabase or AWS RDS) with foreign key constraints, unique indexes, and automated daily snapshots.
- **Object Storage:** S3-compatible cloud storage (Supabase Storage) separating public product assets from strictly private customer requirement attachments.
- **Email:** Transactional email provider (Resend, SendGrid, or Google Workspace SMTP) delivering customer quote confirmations and sales notifications.

---

## 2. Infrastructure Ownership & Prerequisites

> [!IMPORTANT]
> All cloud accounts, domains, and credentials must be created under corporate accounts owned and controlled by Genesis Power Equipments Pvt. Ltd. No production resources should reside on personal developer accounts.

Before initiating production deployment, confirm ownership of:
1. **Domain Registrar Access:** Access to DNS zone editor for `genesispower.in`.
2. **Cloud Database Account:** Supabase or Managed PostgreSQL organization account.
3. **Cloud Hosting Account:** Vercel (Frontend) and Render/Railway (Backend) organization accounts.
4. **Email Provider Account:** Resend or corporate Google Workspace admin access.

---

## 3. Production Environment Variables Reference

Create a secure `.env` file in the hosting provider dashboard. Never commit production values to version control.

### 3.1 Backend Variables (Render / Railway)

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `PROJECT_NAME` | Name displayed in API responses | `GenesisConnect API` |
| `ENVIRONMENT` | Application run mode (`production` disables debug) | `production` |
| `API_V1_STR` | REST API v1 routing prefix | `/api/v1` |
| `BACKEND_PORT` | Port for ASGI server | `8000` |
| `BACKEND_HOST` | Host binding interface | `0.0.0.0` |
| `FRONTEND_URL` | Canonical frontend origin | `https://genesispower.in` |
| `CORS_ORIGINS` | JSON array of permitted origins | `["https://genesispower.in","https://www.genesispower.in"]` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB]?sslmode=require` |
| `SECRET_KEY` | 256-bit cryptographically random JWT secret | Generate via `openssl rand -hex 32` |
| `ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Admin session duration in minutes | `1440` (24 hours) |
| `FIRST_SUPERADMIN_EMAIL` | Initial admin account email | `admin@genesispower.in` |
| `FIRST_SUPERADMIN_PASSWORD` | Strong initial admin password | Strong random password (min 16 chars) |
| `ENABLE_DOCS` | Public visibility of /docs and OpenAPI | `false` |
| `ENABLE_SECURITY_HEADERS` | Activates OWASP security headers | `true` |
| `RATE_LIMIT_ENABLED` | Activates IP rate limiting | `true` |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | Max requests per minute per IP | `30` |
| `STORAGE_PROVIDER` | Storage backend provider | `supabase` |
| `SUPABASE_URL` | Supabase project API URL | `https://[PROJECT-ID].supabase.co` |
| `SUPABASE_KEY` | Supabase anon key | `ey...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role secret | `ey...` (Admin operations only) |
| `SUPABASE_STORAGE_BUCKET_PRODUCT_IMAGES` | Product pictures bucket | `product-images` |
| `SUPABASE_STORAGE_BUCKET_PRODUCT_DOCS` | Datasheets PDF bucket | `product-datasheets` |
| `SUPABASE_STORAGE_BUCKET_REQUIREMENTS` | Customer RFQ documents bucket | `requirement-documents` |
| `EMAIL_ENABLED` | Global email toggle | `true` |
| `EMAIL_PROVIDER` | Selected email engine (`resend` or `smtp`) | `resend` or `smtp` |
| `EMAIL_FROM` | Sender display identity | `Genesis Power <no-reply@genesispower.in>` |
| `ADMIN_NOTIFICATION_EMAIL` | Recipient for customer enquiry alerts | `sales@genesispower.in` |
| `EMAIL_API_KEY` | Provider API key (if using Resend/SendGrid) | `re_123456789...` |

### 3.2 Frontend Variables (Vercel)

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Production Backend API v1 endpoint | `https://api.genesispower.in/api/v1` |
| `VITE_APP_TITLE` | Application brand title | `Genesis Power Equipments Pvt. Ltd.` |

---

## 4. PostgreSQL Database Setup & Migrations

### Step 4.1: Provision Database
1. Provision a PostgreSQL 15+ database instance on Supabase or AWS RDS.
2. Ensure connection encryption is enforced (`sslmode=require`).
3. Note the connection URI: `postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require`.

### Step 4.2: Execute Alembic Migrations
Run the ordered Alembic migration chain against the production database:

```bash
# In backend/ directory
export DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/genesisconnect?sslmode=require"
alembic upgrade head
```

Verify that the following tables exist:
- `products`, `product_images`, `product_documents`
- `users`
- `services`
- `site_content`, `announcements`
- `quote_requests`, `custom_requirements`, `contact_messages`
- `alembic_version` (must reflect revision `0005_add_enquiry_document_name`)

### Step 4.3: Initialize Master Data & Admin User
Seed only approved master product categories, services, and the initial system administrator:

```bash
python -m app.db.seed_products
python -m app.db.seed_admin
```

> [!CAUTION]
> Never insert dummy or mock enquiries (`quote_requests`, `custom_requirements`, `contact_messages`) into the production database.

---

## 5. Cloud Storage Configuration (Supabase Storage)

Log into the Supabase Dashboard and verify bucket configuration:

1. **`product-images` Bucket:**
   - **Public Access:** Enabled.
   - **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`.
   - **Max File Size:** `5 MB`.

2. **`product-datasheets` Bucket:**
   - **Public Access:** Enabled.
   - **Allowed MIME Types:** `application/pdf`.
   - **Max File Size:** `10 MB`.

3. **`requirement-documents` Bucket (Customer Technical Attachments):**
   - **Public Access:** **DISABLED (Strictly Private)**.
   - **Allowed MIME Types:** `application/pdf`.
   - **Max File Size:** `10 MB`.
   - **Access Policy:** Direct public download blocked. File access is restricted exclusively to authenticated administrators through backend-generated signed URLs (`expires_in=3600`).

---

## 6. Transactional Email Configuration

To ensure reliable inbox delivery of quotation acknowledgments and sales leads:

1. **Verify Sender Domain:** Add domain `genesispower.in` in your email provider dashboard (e.g. Resend).
2. **Configure DNS Records:**
   - **SPF:** `v=spf1 include:resend.com ~all`
   - **DKIM:** TXT record provided by email service.
   - **DMARC:** `v=DMARC1; p=quarantine; rua=mailto:dmarc@genesispower.in`
3. **Resilience Guarantee:** GenesisConnect is engineered with asynchronous, isolated email dispatch. If the external email provider suffers a temporary network timeout, the customer enquiry remains **100% saved and committed** in PostgreSQL. No customer data is lost due to third-party mail outages.

---

## 7. Backend Deployment (Render / Railway)

1. Connect the Genesis GitHub repository to Render / Railway.
2. Select root directory: `backend/`.
3. Set Environment: `Python 3.11`.
4. Configure Build Command:
   ```bash
   pip install -r requirements.txt
   ```
5. Configure Start Command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2
   ```
6. Set Health Check Endpoint: `/api/health`.
7. Enter all environment variables listed in Section 3.1.
8. Verify deployment: `curl -I https://api.genesispower.in/api/health` should return `HTTP 200 OK`.

---

## 8. Frontend Deployment (Vercel)

1. Connect repository to Vercel.
2. Select root directory: `frontend/`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://api.genesispower.in/api/v1`
7. Ensure SPA Client Routing rewrites are active (handled automatically by `vercel.json` or Vercel SPA detection):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
8. Verify deployment by visiting the live URL and navigating between routes (`/`, `/about`, `/products`, `/request-quote`, `/admin/login`).

---

## 9. Domain, DNS & SSL Configuration

Configure the following DNS records with your registrar:

| Type | Host / Name | Target / Value | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `A` / `CNAME` | `@` (or apex) | `76.76.21.21` (Vercel IP) | 300 | Primary website |
| `CNAME` | `www` | `cname.vercel-dns.com` | 300 | WWW redirect |
| `CNAME` | `api` | `[RENDER-APP-NAME].onrender.com` | 300 | Backend REST API |
| `TXT` | `resend._domainkey` | `[PROVIDER-DKIM-KEY]` | 300 | Email authentication |
| `TXT` | `@` | `v=spf1 include:resend.com ~all` | 300 | Email SPF record |

### SSL / HTTPS:
- Vercel and Render automatically provision free, renewing Let's Encrypt TLS/SSL certificates.
- Verify HTTP automatically redirects to HTTPS:
  - `http://genesispower.in` -> `https://genesispower.in`
  - `http://api.genesispower.in/api/health` -> `https://api.genesispower.in/api/health`

---

## 10. Backup & Disaster Recovery Strategy

1. **PostgreSQL Automated Backups:**
   - Supabase/Managed PostgreSQL provides automated daily point-in-time recovery (PITR) backups retained for 7 to 30 days.
   - Weekly automated logical export script:
     ```bash
     pg_dump -h [HOST] -U postgres -d genesisconnect -F c -b -v -f genesisconnect_backup_$(date +%Y%m%d).dump
     ```
2. **Storage Backups:**
   - Bucket replication or secondary S3 sync for product catalog images and critical specification files.
3. **Restoration Procedure:**
   ```bash
   pg_restore -h [HOST] -U postgres -d genesisconnect -v -c genesisconnect_backup_[DATE].dump
   ```

---

## 11. Rollback Procedure

If a critical issue occurs after deployment:

1. **Frontend Instant Rollback:**
   - In Vercel Dashboard -> Deployments -> locate the previous stable deployment -> click **Promote to Production**. Instant rollback within 5 seconds.
2. **Backend Rollback:**
   - In Render Dashboard -> Deployments -> Rollback to previous deployment.
3. **Database Migration Rollback:**
   - If a schema issue requires rolling back the last migration:
     ```bash
     alembic downgrade -1
     ```
   - *Note: Only downgrade if strictly necessary and validated on a staging database first.*
