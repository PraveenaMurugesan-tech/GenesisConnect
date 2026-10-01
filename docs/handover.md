# GenesisConnect — Client Administration & Handover Guide
**Client:** Genesis Power Equipments Pvt. Ltd.  
**System:** GenesisConnect (Official Website & Customer Enquiry Management System)  
**Audience:** Genesis IT Administrators, Sales Operations, and Executive Management  
**Confidentiality:** Internal Corporate Document  

---

## 1. System Access & Administrator Authentication

### 1.1 Accessing the Admin Console
- **Production URL:** `https://genesispower.in/admin/login` (or `/admin` which automatically redirects to login).
- **Staging / Local URL:** `http://localhost:5173/admin/login`.

### 1.2 Authentication Credentials
- Initial administrator email: Provided securely through corporate transfer channel (default template: `admin@genesispower.in`).
- Initial administrator password: A high-entropy temporary password is provided during secure handover.
- **First-Time Login Protocol:** Upon initial sign-in, navigate immediately to **Admin Settings** to update your password.

> [!SECURITY NOTICE]
> GenesisConnect enforces secure JSON Web Tokens (JWT) with bcrypt salt hashing. Unauthenticated users cannot access administrative views, APIs, or private customer records. Sessions expire after 24 hours of inactivity.

---

## 2. Managing Products (Equipment Catalogue)

Navigate to **Admin -> Products** (`/admin/products`):

### 2.1 Adding a New Product
1. Click the **"+ Add Product"** button in the top right.
2. Complete the equipment details:
   - **Product Name:** Official commercial model title (e.g. `CT Scanner Online UPS 100 kVA`).
   - **URL Slug:** Auto-generated lowercase identifier (e.g. `ct-scanner-online-ups-100-kva`).
   - **Category:** Select from the five approved corporate categories:
     - `UPS`
     - `Voltage Stabilizers`
     - `Power Conditioning`
     - `Medical Power Solutions`
     - `Other`
   - **Short Description:** High-impact 1-2 sentence engineering overview for catalogue cards.
   - **Detailed Description:** Comprehensive operational breakdown and electrical characteristics.
3. Configure **Key Highlights & Features:** Add bullet points detailing galvanic isolation, crest factor, THD tolerance, or microprocessor controls.
4. Configure **Technical Specifications:** Use the interactive specification table to enter electrical ratings (Voltage, Frequency, Overload capacity, Efficiency, Dimensions).
5. Upload or link **Product Image** and **Technical Datasheet** (see Section 6).
6. Toggle **"Publish Immediately"** to make it publicly visible, or save as draft.
7. Click **"Save Product"**.

### 2.2 Editing & Deactivating Products
- **Edit:** Click the edit pencil icon on any product card to modify technical specifications or descriptions.
- **Deactivate / Draft:** Toggle the active status switch. Deactivated products are immediately removed from the public website catalogue and cannot be viewed via direct URLs by public visitors.
- **Delete:** Remove obsolete products from the system database.

---

## 3. Managing Services & Engineering Capabilities

Navigate to **Admin -> Services** (`/admin/services`):

1. **Viewing Services:** Inspect all active industrial engineering services (e.g., Annual Maintenance Contracts, Harmonic Analysis, Load Bank Testing).
2. **Adding a Service:** Click **"+ Add Service"**, provide the service title, URL slug, and technical scope of deliverables.
3. **Status Control:** Toggle active or inactive status depending on seasonal engineering availability.

---

## 4. Managing Website Content & Public Announcements

Navigate to **Admin -> Content** (`/admin/content`):

### 4.1 Homepage Content Management
- **Hero Banner:** Update the primary headline, subtitle, and call-to-action button links.
- **Value Propositions:** Maintain the company's core engineering commitments.
- **Stats Counter:** Update statistics (e.g., Years of Excellence, kVA Deployed, Healthcare Clients Supported).

### 4.2 Corporate Contact Information
- **Headquarters Address:** Keep factory and registered office address updated.
- **Hotlines & Direct Lines:** Manage 24/7 technical breakdown phone numbers and sales desk contacts.
- **Official Mailboxes:** Manage sales (`sales@genesispower.in`) and general inquiries (`info@genesispower.in`).

### 4.3 Public Advisories & Announcements
- Publish emergency advisories, scheduled factory holiday shutdowns, or new equipment launch banners displayed prominently across the website header.
- Quickly activate or deactivate announcements with a single toggle.

---

## 5. Enquiry & Quotation Management

Navigate to **Admin -> Enquiries** (`/admin/enquiries`):

GenesisConnect captures all prospective customer engagements across three specialized workflows:
1. **Quote Requests:** Inquiries directly tied to catalogue equipment models.
2. **Customized Requirements:** Complex engineering project inquiries requiring tailored voltage, battery autonomy, or harsh electrical environment considerations.
3. **Contact Messages:** General commercial or maintenance communications.

### 5.1 The Standard Enquiry Lifecycle
Every customer submission follows a strict state-machine lifecycle:

```
    [ NEW ]  -->  [ CONTACTED ]  -->  [ IN_PROGRESS ]  -->  [ QUOTED ]  -->  [ CLOSED ]
```

- **NEW:** Customer submitted the form; waiting for sales team review.
- **CONTACTED:** Genesis sales engineer has reached out via phone or email.
- **IN_PROGRESS:** Site survey scheduled or electrical engineering team sizing the solution.
- **QUOTED:** Formal commercial proposal and Single Line Diagram (SLD) delivered to customer.
- **CLOSED:** Deal finalized or procurement concluded.

### 5.2 Processing an Enquiry
1. Click **"View Details"** on any enquiry card.
2. Inspect customer information (Name, Company, Email, Phone, Equipment specs, Ambient site notes).
3. If the customer attached a technical requirement file or Single Line Diagram, click **"Download / View Technical Attachment"** to generate a secure, temporary signed link.
4. Update the **Status Dropdown** to record progress.

---

## 6. Digital Asset & Datasheet Management

### 6.1 Product Images
- **Format:** High-resolution JPEG, PNG, or WebP.
- **Recommended Dimensions:** 1200x800px (3:2 aspect ratio). Max size: 5 MB.
- Images are stored in the public `product-images` bucket on Supabase Storage.

### 6.2 Technical Datasheets
- **Format:** PDF documents up to 10 MB.
- Uploaded directly through the Admin Product Form.
- When no datasheet is uploaded for an equipment model, the public website automatically displays a professional notice: *"Detailed datasheets and SLD documents are provided upon formal procurement enquiry"* with a 1-click Request Quote link.

### 6.3 Customer Requirement Documents
- **Privacy Standard:** Strictly confidential.
- Customer documents are stored in the private `requirement-documents` bucket.
- **Security Policy:** No public direct link ever exists. Only logged-in Genesis administrators can generate secure 1-hour signed URLs to inspect customer files.

---

## 7. Ownership, Infrastructure & Credential Control

To ensure perpetual business continuity and security:

| Domain | Responsible Entity | Control Location |
| :--- | :--- | :--- |
| **Domain Registrar (`genesispower.in`)** | Genesis Power Equipments Pvt. Ltd. | Corporate Registrar Account (GoDaddy, Cloudflare, etc.) |
| **DNS Zone Management** | Genesis Power Equipments Pvt. Ltd. | Registrar or Cloudflare DNS Dashboard |
| **Frontend Web Hosting** | Genesis Power Equipments Pvt. Ltd. | Vercel / Cloudflare Pages Dashboard |
| **Backend API Server** | Genesis Power Equipments Pvt. Ltd. | Render / Railway / Cloud Provider Dashboard |
| **PostgreSQL Database** | Genesis Power Equipments Pvt. Ltd. | Supabase / Managed Cloud Database Console |
| **Object Storage Buckets** | Genesis Power Equipments Pvt. Ltd. | Supabase Storage Console |
| **Transactional Email** | Genesis Power Equipments Pvt. Ltd. | Resend / SendGrid / Google Workspace Console |

### Security Checklist for Genesis IT:
- [ ] Ensure two-factor authentication (2FA) is enforced on all cloud hosting accounts.
- [ ] Periodically rotate JWT secret key and database passwords.
- [ ] Deactivate admin accounts for personnel who leave the organization.
- [ ] Monitor daily PostgreSQL backup snapshots in the database dashboard.
