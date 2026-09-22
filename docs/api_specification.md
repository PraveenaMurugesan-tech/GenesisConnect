# GenesisConnect API Specification (v1)

## 1. Overview

The GenesisConnect API is built using **FastAPI**. All API endpoints are prefixed with `/api/v1`.
Interactive documentation is available in development at:
* Swagger UI: `http://localhost:8000/docs`
* ReDoc: `http://localhost:8000/redoc`

---

## 2. Authentication & Authorization

All administrative endpoints require a Bearer token in the `Authorization` header:
```http
Authorization: Bearer <access_token>
```

### Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate admin, returns JWT access token | Public |
| `GET` | `/api/v1/auth/me` | Fetch profile of currently logged-in admin | Admin |

---

## 3. Products Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products` | List active products with category filtering & pagination | Public |
| `GET` | `/api/v1/products/{slug}` | Get product detail with images & documents by slug | Public |
| `POST` | `/api/v1/products` | Create a new product | Admin |
| `PUT` | `/api/v1/products/{id}` | Update product details | Admin |
| `DELETE` | `/api/v1/products/{id}` | Soft delete or deactivate product | Admin |
| `POST` | `/api/v1/products/{id}/images` | Attach image record to product | Admin |
| `POST` | `/api/v1/products/{id}/documents` | Attach datasheet/manual to product | Admin |

---

## 4. Services Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/services` | List active company services | Public |
| `GET` | `/api/v1/services/{slug}` | Retrieve service details by slug | Public |
| `POST` | `/api/v1/services` | Create service | Admin |
| `PUT` | `/api/v1/services/{id}` | Update service | Admin |
| `DELETE` | `/api/v1/services/{id}` | Delete or deactivate service | Admin |

---

## 5. Quote Requests Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/quotes` | Submit quotation request (optional product link) | Public |
| `GET` | `/api/v1/quotes` | List all quotation requests with status filtering | Admin |
| `GET` | `/api/v1/quotes/{id}` | Retrieve specific quotation request detail | Admin |
| `PATCH` | `/api/v1/quotes/{id}/status` | Update enquiry status (`NEW`, `CONTACTED`, etc.) | Admin |

---

## 6. Customized Requirements Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/custom-requirements` | Submit detailed custom technical requirement | Public |
| `GET` | `/api/v1/custom-requirements` | List custom requirements with status filters | Admin |
| `GET` | `/api/v1/custom-requirements/{id}` | Retrieve custom requirement detail | Admin |
| `PATCH` | `/api/v1/custom-requirements/{id}/status` | Update requirement status | Admin |

---

## 7. Contact Messages Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/contact` | Submit a general customer contact message | Public |
| `GET` | `/api/v1/contact` | List received messages | Admin |
| `GET` | `/api/v1/contact/{id}` | Retrieve specific message detail | Admin |
| `PATCH` | `/api/v1/contact/{id}/status` | Update message status (`READ`, `REPLIED`, etc.) | Admin |

---

## 8. Storage & File Upload Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/storage/upload` | Upload binary file to Supabase Storage bucket | Admin / Form Upload |

---

## 9. Standard Error Response Format

All error responses adhere to standard JSON:
```json
{
  "detail": "Descriptive error message or validation errors list",
  "status_code": 404
}
```
