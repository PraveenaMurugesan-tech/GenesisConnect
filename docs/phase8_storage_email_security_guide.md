# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Phase 8: Storage, Email Notifications & Security Hardening Architecture Guide
# ==============================================================================

## 1. Executive Summary

Phase 8 elevates GenesisConnect into a production-hardened platform by delivering:
1. **Provider-Agnostic Storage Service**: Decoupled asset pipeline supporting product photography, engineering PDF datasheets, and customer requirement specifications.
2. **Encrypted Document Vault**: Strictly private bucket storage for customer site drawings and single-line diagrams, accessible exclusively to authenticated administrators via time-limited signed URLs.
3. **Resilient Transactional Email Architecture**: Customer receipt confirmations and internal administrative lead notifications with guaranteed non-blocking failure tolerance.
4. **Defense-in-Depth Security Hardening**: HTTP security response headers, environment-strict CORS origin enforcement, automated logging redaction of credentials, sliding-window rate limiting, and input sanitization.
5. **Backup & Disaster Recovery Runbook**: Concrete procedures for PostgreSQL WAL archiving, Supabase storage replication, and secret retention under Genesis Power Equipments Pvt. Ltd. governance.

---

## 2. Storage Architecture

```
                          ┌────────────────────────┐
                          │   FastAPI Endpoints    │
                          └───────────┬────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │      StorageService      │
                         │ (Validation/Sanitization)│
                         └────────────┬─────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
      ┌───────▼────────┐      ┌───────▼────────┐      ┌───────▼────────┐
      │SupabaseProvider│      │ LocalProvider  │      │ MemoryProvider │
      │  (Production)  │      │ (Offline Dev)  │      │  (Unit Tests)  │
      └───────┬────────┘      └────────────────┘      └────────────────┘
              │
    ┌─────────┴─────────────────────────────────┐
    │                                           │
┌───▼─────────────────────┐           ┌─────────▼─────────────────┐
│ Public CDN Buckets      │           │ Private Document Vault    │
│ - product-images        │           │ - requirement-documents   │
│ - product-datasheets    │           │ (No public URLs; signed   │
└─────────────────────────┘           │  temporary links only)    │
                                      └───────────────────────────┘
```

### 2.1 Storage Buckets & Path Strategy

| Bucket Name | Access Level | Path Pattern | Permitted MIME Types | Max Size | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `product-images` | **Public CDN** | `products/images/<uuid>.<ext>` | `image/jpeg`, `image/png`, `image/webp` | **5 MB** | Primary catalogue images & gallery views |
| `product-datasheets` | **Public CDN** | `products/datasheets/<uuid>.pdf` | `application/pdf` | **10 MB** | Downloadable technical engineering sheets |
| `requirement-documents` | **Private Vault** | `enquiries/documents/<uuid>.pdf` | `application/pdf` | **10 MB** | Confidential client site drawings & SLDs |

### 2.2 Strict Binary Validation & Sanitization

1. **Dangerous Extension Rejection**: Files ending in `.exe`, `.bat`, `.cmd`, `.sh`, `.js`, `.html`, `.php`, `.vbs`, `.dll`, `.msi`, `.svg`, etc., are unconditionally rejected with HTTP 400.
2. **Binary Magic Byte Inspection**:
   - PDF: Must initiate with binary signature `%PDF-` (`0x25 0x50 0x44 0x46 0x2D`).
   - JPEG: Must begin with `\xff\xd8\xff`.
   - PNG: Must begin with `\x89PNG\r\n\x1a\n`.
   - WebP: Must contain `RIFF` and `WEBP` container identifiers.
3. **Secure Filename Generation**: The physical storage path is never derived from raw user input. Instead, the backend generates an unguessable UUIDv4 key while safely preserving the original sanitized filename for display metadata.
4. **Path Traversal Shield**: Null bytes, directory traversal sequences (`../`, `..\\`), and absolute path prefixes are stripped.

### 2.3 Storage Endpoints

- `POST /api/v1/admin/storage/product-image`: Uploads catalogue photos (Admin JWT required).
- `POST /api/v1/admin/storage/product-datasheet`: Uploads technical datasheets (Admin JWT required).
- `POST /api/v1/storage/enquiry-document`: Public customer upload for customized requirements attachments (PDF only, strictly private).
- `GET /api/v1/admin/storage/enquiry-document-url`: Generates temporary signed URL for private customer documents (Admin JWT required).
- `GET /api/v1/custom-requirements/{id}/document-url`: Admin-only shortcut to retrieve signed URL for a specific enquiry attachment.
- `DELETE /api/v1/admin/storage/file`: Removes an asset from storage (Admin JWT required).

---

## 3. Email Notification Architecture

### 3.1 Non-Blocking Dispatch Guarantee

Customer lead persistence takes absolute priority over email transport availability.
1. The enquiry record is validated and saved to PostgreSQL within a database transaction.
2. The transaction commits and the record receives an autoincrement ID.
3. The email service attempts delivery to the customer and admin in a safe `try/except` block.
4. Any network timeout or provider authentication error is logged with detailed error diagnostics.
5. The API returns `HTTP 201 Created` with the confirmed entity. **The saved enquiry is never rolled back due to email delivery issues.**

### 3.2 Notification Matrix

| Event | Recipient | Subject Line Pattern | Contents |
| :--- | :--- | :--- | :--- |
| **Quote Request** | Prospective Customer | `Quote Request Received [GEN-QUO-XXXXX] — Genesis Power Equipments` | Reference ID, equipment model, requested quantity, response SLA. |
| **Custom Requirement** | Prospective Customer | `Customized Requirement Received [GEN-REQ-XXXXX] — Genesis Power Equipments` | Reference ID, system classification, capacity rating, attachment notice. |
| **Contact Message** | Inquirer | `Message Received [GEN-MSG-XXXXX] — Genesis Power Equipments` | Reference ID, subject inquiry line, customer support contact info. |
| **New Lead Alert** | Admin Desk (`sales@genesispower.in`) | `[New Enquiry] <Type> from <Customer> (<Company>) [GEN-XXX-XXXXX]` | Full lead parameters, contact phone/email, equipment specifications. |

### 3.3 Email Providers

- **ConsoleEmailProvider** (`EMAIL_PROVIDER=console`): Default for development and automated test suites. Captures sent messages in memory without external dependencies.
- **SMTPEmailProvider** (`EMAIL_PROVIDER=smtp`): Standard TLS-encrypted transport compatible with Google Workspace, Microsoft 365, or private mail relays.
- **ResendEmailProvider** (`EMAIL_PROVIDER=resend`): Transactional REST API dispatch using Resend.

---

## 4. Security Hardening

### 4.1 HTTP Security Headers

Every HTTP response from GenesisConnect is augmented by `SecurityHeadersMiddleware`:
- `X-Content-Type-Options: nosniff`: Prevents browsers from MIME-sniffing away from the declared Content-Type.
- `X-Frame-Options: DENY`: Prevents clickjacking by prohibiting framing inside external `<frame>`, `<iframe>`, or `<embed>`.
- `Referrer-Policy: strict-origin-when-cross-origin`: Restricts URL referrer leaking when navigating off-site.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Restricts hardware APIs from execution.
- `Content-Security-Policy`: Restricts scripts, frames, and resource origins (`frame-ancestors 'none'`).
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`: Enforces TLS encryption for 1 year when serving HTTPS.

### 4.2 Production CORS Policy

- Development: Whitelists `http://localhost:5173`, `http://localhost:3000`, `http://127.0.0.1:5173`.
- Production: Strictly resolves origins from `CORS_ORIGINS` and `FRONTEND_URL`. Unrestricted wildcards (`"*"`) are explicitly stripped during startup in production mode to prevent credential theft.

### 4.3 Abuse Protection & Rate Limiting

- `AbuseProtectionMiddleware` protects public submission endpoints:
  - `/api/v1/quotes` & `/api/v1/quote-requests`
  - `/api/v1/custom-requirements`
  - `/api/v1/contact` & `/api/v1/contact-messages`
  - `/api/v1/storage/enquiry-document`
- **Threshold**: 15 requests per minute per client IP (configurable via `RATE_LIMIT_REQUESTS_PER_MINUTE`).
- Exceeded requests receive `HTTP 429 Too Many Requests` with `Retry-After: 60`.
- Authenticated administrators and automated tests are automatically exempt.

### 4.4 Input Sanitization & Anti-Injection

- Pydantic models apply `sanitize_input_text`:
  - Strips `<script>`, `<iframe>`, `<object>`, `<svg>` elements.
  - Strips HTML markup tags to ensure customer text is treated as plain text.
  - Eliminates `javascript:` pseudo-protocol URIs.
  - Removes null bytes and forbidden ASCII control characters.

### 4.5 Secret & Credential Log Masking

- `SensitiveDataMaskingFilter` is wired into the application's root logger.
- Automatically redacts:
  - Authorization Bearer tokens: `Bearer [REDACTED_TOKEN]`
  - JSON and form passwords: `[REDACTED_PASSWORD]`
  - PostgreSQL connection strings containing passwords: `postgresql://user:***@host:port/db`
  - API and storage keys: `[REDACTED_KEY]`

---

## 5. Backup & Disaster Recovery Runbook

### 5.1 PostgreSQL Backup Strategy

1. **Point-In-Time Recovery (PITR)**: Supabase automated backups retain continuous WAL archives with 7-day retention.
2. **Logical Daily Dump**:
   ```bash
   # Automated night-run via cron/GitHub Actions
   pg_dump "$DATABASE_URL" \
     --format=custom \
     --compress=9 \
     --clean \
     --if-exists \
     --file="genesisconnect_backup_$(date +%Y%m%d_%H%M%S).dump"
   ```
3. **Restoration Command**:
   ```bash
   pg_restore --clean --if-exists -d "$DATABASE_URL" genesisconnect_backup_20261001_000000.dump
   ```

### 5.2 Storage Backup Strategy

1. **Bucket Versioning**: Enabled in Supabase Storage settings to prevent accidental file overwrites.
2. **Cold Storage Sync**: Scheduled rclone or AWS S3 cross-region sync to an encrypted cold bucket (e.g. AWS S3 Glacier or Wasabi) under Genesis Power Equipments AWS account.

### 5.3 Secrets & Environment Backup

1. Production environment variables (`.env`) are securely preserved in the client's corporate password manager (e.g. 1Password / Bitwarden for Genesis Power Equipments Pvt. Ltd.).
2. The repository commits only `.env.example` templates with generic placeholders.

---

## 6. Client Ownership & Infrastructure Governance

All production systems must be registered under and owned by:

**Genesis Power Equipments Pvt. Ltd.**
- **Domain & DNS**: Client registrar account (e.g. GoDaddy / Cloudflare).
- **PostgreSQL / Supabase**: Registered under official client email (`admin@genesispower.in` or corporate IT).
- **Email Infrastructure**: Official Genesis Power Equipments transactional account.
- **Source Repository**: Client-owned GitHub/GitLab organization.
- **Deployment Platform**: Client-owned cloud hosting accounts.

No developer-owned or personal accounts should be used in production infrastructure.
