# GenesisConnect — Phase 3: Product Data Layer & Catalogue Architecture

## 1. Executive Summary

Phase 3 establishes a robust, decoupled, and strongly-typed data layer for the **Genesis Power Equipments Pvt. Ltd.** product catalogue. It isolates product domain types, data definitions, query logic, and frontend components so that the upcoming **Phase 4 (FastAPI + PostgreSQL + SQLAlchemy)** integration will require zero modifications to the UI pages or component hierarchy.

---

## 2. Product Data Model

The centralized TypeScript model is declared in `frontend/src/types/product.ts` and re-exported through `frontend/src/types/index.ts`.

### 2.1 Core Interfaces

```typescript
export type ProductCategory =
  | "UPS"
  | "Voltage Stabilizers"
  | "Power Conditioning"
  | "Medical Power Solutions"
  | "Other";

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory | string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: ProductSpecification[];
  image?: string;
  images?: string[];
  datasheet?: string;
  isActive: boolean;

  // Equipment domain metadata
  tagline?: string;
  applications?: string[];
  keyHighlights?: string[];

  // Compatibility aliases
  short_description?: string;
  key_highlights?: string[];
  image_url?: string;
  datasheet_url?: string;
  is_active?: boolean;
}

export interface ProductFilterParams {
  category?: ProductCategory | "All" | string;
  search?: string;
}
```

---

## 3. Product Categories

The categories reflect the official industrial and healthcare manufacturing scope of Genesis Power Equipments:

| Category | Primary Equipment Lines |
| :--- | :--- |
| **`UPS`** | UPS for Small Office, Industrial Online Double Conversion UPS |
| **`Voltage Stabilizers`** | IGBT Static Voltage Stabilizers, Servo Stabilizers |
| **`Power Conditioning`** | Constant Voltage Constant Frequency (CVCF) Converters |
| **`Medical Power Solutions`** | CT Scanner UPS, Ultrasound EMI Filters, Cath Laboratory UPS |
| **`Other`** | Custom & Specialized Engineering Enclosures, Bespoke Battery Racks |

---

## 4. Product Slugs & URL Conventions

Slugs conform strictly to the following rules:
- **Unique**: No duplicate slugs are permitted across the entire catalogue.
- **Lowercase**: Always strictly lowercase.
- **URL-Safe**: Hyphen-delimited alphanumeric characters matching `^[a-z0-9]+(-[a-z0-9]+)*$`.
- **Stable**: Slugs are derived from standardized model identifiers, never random numbers or ephemeral session IDs.

### Standard Catalogue Slugs:
1. `ups-for-small-office`
2. `industrial-ups`
3. `ct-scanner-ups`
4. `emi-filter-ultrasound`
5. `igbt-static-voltage-stabilizers`
6. `servo-stabilizers`
7. `cvcf-systems`
8. `cath-laboratory-ups`
9. `custom-specialized-power-systems`

Routing schema: `/products/:slug` (e.g. `/products/industrial-ups`).

---

## 5. Non-Fabrication Policy for Technical Content

In strict accordance with Genesis engineering standards:
- **Never fabricated**: Voltage, capacity, efficiency, warranty, certifications, standards, dimensions, power ratings.
- **Unavailable parameters**: Explicitly marked as `"Not provided"` in specification tables.
- **Consultation notice**: Specifications include the official disclaimer:
  > *"Specifications will be provided by Genesis Power Equipments Pvt. Ltd. based on exact site capacity sizing and customized installation requirements."*

---

## 6. Product Service Layer

Located in `frontend/src/services/productService.ts`.

### 6.1 Exposed Service Methods

```typescript
// Synchronous local data accessors
getProducts(params?: ProductFilterParams): Product[]
getProductBySlug(slug?: string): Product | undefined
getProductsByCategory(category: string): Product[]
searchProducts(query: string, category?: string): Product[]
getFeaturedProducts(): Product[]

// Asynchronous API-ready contract wrappers (Phase 4 ready)
fetchProducts(params?: ProductFilterParams): Promise<Product[]>
fetchProductBySlug(slug: string): Promise<Product | null>
fetchProductsByCategory(category: ProductCategory | string): Promise<Product[]>
fetchSearchResults(query: string, category?: string): Promise<Product[]>
```

---

## 7. Future Phase 4 API Contract

In Phase 4, the backend FastAPI service will implement the following endpoints to back `productService.ts`:

### 7.1 Endpoints Specification

#### `GET /api/v1/products`
- **Description**: Returns active products matching optional search keywords and category filters.
- **Query Parameters**:
  - `category` (optional, string): e.g. `UPS`, `Voltage Stabilizers`
  - `search` (optional, string): case-insensitive search matching name, category, shortDescription
  - `is_active` (optional, boolean, default: `true` for public catalogue)
- **Response Shape (200 OK)**:
```json
[
  {
    "id": "genesis-industrial-ups",
    "name": "Industrial UPS",
    "slug": "industrial-ups",
    "category": "UPS",
    "shortDescription": "Ruggedized industrial grade online double-conversion UPS...",
    "description": "Engineered specifically for continuous industrial duty...",
    "features": [
      "Heavy-duty industrial grade power electronics for continuous 24/7 duty",
      "Galvanic isolation transformer architecture"
    ],
    "specifications": [
      { "label": "Capacity Range", "value": "Not provided" },
      { "label": "Operating Duty", "value": "Continuous Industrial Duty" }
    ],
    "image": "/images/products/industrial-ups.svg",
    "images": ["/images/products/industrial-ups.svg"],
    "datasheet": null,
    "isActive": true
  }
]
```

#### `GET /api/v1/products/{slug}`
- **Description**: Fetch detailed equipment data by URL slug.
- **Path Parameter**: `slug` (string, e.g. `ct-scanner-ups`)
- **Response Shape (200 OK)**: Product object (same as above).
- **Response Shape (404 Not Found)**:
```json
{
  "detail": "Product with slug 'xyz' not found",
  "status_code": 404
}
```

---

## 8. Development-Time Data Validation

Located in `frontend/src/data/validateProducts.ts`.

Automatically runs in development (`import.meta.env.DEV`) to verify:
1. Missing ID or duplicate ID
2. Missing name or name length < 3
3. Missing slug, duplicate slug, or non-URL-safe characters
4. Invalid category outside official Genesis scope
5. Missing shortDescription or description
6. Empty features array
7. Empty specifications array or malformed label/value pairs
8. Non-boolean `isActive` flag

---

## 9. Modular Component Structure

The product presentation layer is decoupled into specialized components in `frontend/src/components/products/`:

| Component | Responsibility |
| :--- | :--- |
| `ProductCard` | Reusable catalogue item card with fallback placeholder & quote CTA |
| `ProductGallery` | Multi-image preview, thumbnail selector, and Genesis industrial visual |
| `ProductSummary` | Model tags, title, engineering tagline, and recommended applications |
| `ProductFeatures` | Responsive grid of engineering feature highlights with checkmarks |
| `ProductSpecifications` | Semantic accessible table of technical parameters and consultation notice |
| `ProductDatasheet` | Available download link vs unavailable consultation enquiry notice |
| `ProductActions` | Sticky commercial quotation sidebar with warranty & direct helpline |

---

## 10. Quote CTA Navigation Integration

Every product card and detail page links seamlessly to the quotation system:
```text
/request-quote?product=<slug>
```
The quote request form reads the `product` URL search parameter, validates it against `productService.getProductBySlug()`, preselects the corresponding dropdown option, and displays a prominent **"Selected Catalogue Item"** confirmation banner with a direct link back to technical specifications.
