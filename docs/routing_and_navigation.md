# GenesisConnect Frontend Routing & Navigation Specification

## 1. Overview

GenesisConnect implements a clean two-tier routing structure powered by **React Router v6**:
1. **Public Website:** Public corporate pages, product discovery, dynamic catalog, technical specification review, quote submission, and enquiry forms wrapped in `PublicLayout`.
2. **Admin Panel:** Protected administrative console for managing catalog items, reviewing incoming leads, updating service descriptions, and company content wrapped in `AdminLayout` and secured with an `AdminAuthGuard`.

---

## 2. Public Website Routes (`PublicLayout`)

All public routes share a consistent industrial header (logo, product categories navigation, contact information, quote CTA) and footer.

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Corporate landing page highlighting industrial equipment, reliability metrics, key services, and prominent CTAs. |
| `/about` | `AboutPage` | Company history, infrastructure, leadership, certifications, and quality standards for Genesis Power Equipments. |
| `/products` | `ProductsPage` | Searchable and filterable dynamic product catalog fetched from FastAPI. |
| `/products/:slug` | `ProductDetailPage` | Detailed equipment specifications, high-res gallery, downloadable PDF datasheets, and direct "Request Quote" modal/link. |
| `/services` | `ServicesPage` | Comprehensive list of engineering services (Maintenance, AMC, Overhauling, Generator Rentals). |
| `/request-quote` | `RequestQuotePage` | Interactive quotation request form with optional pre-selected product context. |
| `/customized-requirement` | `CustomizedRequirementPage` | Engineering requirement form for capacity, battery bank specifications, backup hours, and document uploads. |
| `/contact` | `ContactPage` | Direct corporate inquiry form, office addresses, emergency phone lines, and interactive map placeholder. |

---

## 3. Admin Console Routes (`AdminLayout`)

All administrative routes (except `/admin/login`) are protected by `AdminAuthGuard`. Unauthenticated visitors are redirected to `/admin/login`.

| Path | Component | Description |
| :--- | :--- | :--- |
| `/admin/login` | `AdminLoginPage` | Secure admin login with email and password, receiving JWT access token. |
| `/admin/dashboard` | `AdminDashboardPage` | Overview KPI cards (new inquiries, pending quotes, active products, recent submissions). |
| `/admin/products` | `AdminProductsPage` | List, search, activate/deactivate, and delete products in the catalog. |
| `/admin/products/new` | `AdminProductFormPage` | Form for creating a new product with image and datasheet upload links. |
| `/admin/products/:id/edit` | `AdminProductFormPage` | Edit existing product details, specifications JSON, and associated media. |
| `/admin/enquiries` | `AdminEnquiriesPage` | Unified management table for Quote Requests, Custom Requirements, and Contact Messages with status filters. |
| `/admin/enquiries/:id` | `AdminEnquiryDetailPage` | Detailed view of a specific customer inquiry, customer details, and status transition selector. |
| `/admin/services` | `AdminServicesPage` | Manage listed service offerings, service descriptions, and promotional images. |
| `/admin/content` | `AdminContentPage` | Manage dynamic company announcements, homepage banners, and trust badges. |
| `/admin/settings` | `AdminSettingsPage` | Administrator profile, password management, and system integration status. |

---

## 4. Route Hierarchy Diagram

```mermaid
graph TD
    A[App Root] --> B[BrowserRouter]
    B --> C[PublicLayout Outlet]
    B --> D[AdminAuthGuard]
    B --> E[/admin/login]

    subgraph Public Routes
        C --> P1[/]
        C --> P2[/about]
        C --> P3[/products]
        C --> P4[/products/:slug]
        C --> P5[/services]
        C --> P6[/request-quote]
        C --> P7[/customized-requirement]
        C --> P8[/contact]
    end

    subgraph Protected Admin Routes
        D --> AdminLayout
        AdminLayout --> A1[/admin/dashboard]
        AdminLayout --> A2[/admin/products]
        AdminLayout --> A3[/admin/products/new]
        AdminLayout --> A4[/admin/products/:id/edit]
        AdminLayout --> A5[/admin/enquiries]
        AdminLayout --> A6[/admin/enquiries/:id]
        AdminLayout --> A7[/admin/services]
        AdminLayout --> A8[/admin/content]
        AdminLayout --> A9[/admin/settings]
    end
```
