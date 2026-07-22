# Headless CMS — API Documentation

**Base URL:** `http://localhost:5000/api`
**Content-Type:** `application/json`
**Authentication:** Bearer JWT token in `Authorization` header

---

## Response Format

All endpoints return a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": [ { "field": "email", "message": "Invalid email" } ]
}
```

---

## Authentication Endpoints

### POST /api/auth/login

Login with email and password. Returns a JWT token.

**Access:** Public

**Request Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "65a1b2c3d4e5f6789012345",
      "username": "admin",
      "email": "admin@gmail.com",
      "role": "superadmin"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized` — Invalid email or password
- `429 Too Many Requests` — Rate limit exceeded (20 req/15min)
- `422 Unprocessable Entity` — Validation failed

---

### POST /api/auth/logout

Logout the current admin session. Token should be removed from client storage.

**Access:** Protected (JWT required)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

### GET /api/auth/verify

Verify the current JWT token and return the authenticated admin's profile.

**Access:** Protected (JWT required)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "admin": {
      "id": "65a1b2c3d4e5f6789012345",
      "username": "admin",
      "email": "admin@gmail.com",
      "role": "superadmin"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized` — Missing, invalid, or expired token

---

## Pages Endpoints

### GET /api/pages

List pages. Public users see only published pages; authenticated admins see all pages.
Response **excludes blocks** for performance (use `GET /api/pages/:slug` to get blocks).

**Access:** Public (published only) / Protected (all statuses)

**Query Parameters:**

| Parameter | Type   | Default | Description                              |
|-----------|--------|---------|------------------------------------------|
| status    | string | —       | Filter by `draft` or `published`         |
| search    | string | —       | Search in title, slug, description       |
| page      | number | 1       | Page number for pagination               |
| limit     | number | 20      | Items per page (max 200)                 |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Pages retrieved successfully",
  "data": {
    "pages": [
      {
        "_id": "65a1b2c3d4e5f6789012345",
        "title": "Electric Vehicles (EV)",
        "slug": "ev",
        "description": "A comprehensive guide to electric vehicles...",
        "status": "published",
        "publishedAt": "2024-01-15T10:30:00.000Z",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 4,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

---

### GET /api/pages/:slug

Get a single page by slug, **including all blocks** sorted by order.
Public users can only access published pages; admins can access any status.

**Access:** Public (published only) / Protected (any status)

**URL Parameter:** `slug` — URL-safe slug (e.g. `ev`, `renewable-energy`)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Page retrieved successfully",
  "data": {
    "page": {
      "_id": "65a1b2c3d4e5f6789012345",
      "title": "Electric Vehicles (EV)",
      "slug": "ev",
      "description": "A comprehensive guide...",
      "status": "published",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "blocks": [
        {
          "_id": "65a1b2c3d4e5f6789012346",
          "type": "header",
          "data": { "text": "Electric Vehicles", "level": 1 },
          "order": 0
        },
        {
          "_id": "65a1b2c3d4e5f6789012347",
          "type": "equation",
          "data": {
            "equation": "P = IV",
            "displayMode": true,
            "description": "Electric power equation"
          },
          "order": 1
        }
      ],
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404 Not Found` — Page not found (or not published for public access)

---

### POST /api/pages

Create a new page.

**Access:** Protected (JWT required)

**Request Body:**
```json
{
  "title": "My New Page",
  "slug": "my-new-page",
  "description": "Optional description",
  "status": "draft",
  "blocks": [
    {
      "type": "header",
      "data": { "text": "Hello World", "level": 1 },
      "order": 0
    },
    {
      "type": "paragraph",
      "data": { "text": "This is the first paragraph." },
      "order": 1
    }
  ]
}
```

**Validation Rules:**
- `title` — required, max 200 chars
- `slug` — required, unique, lowercase alphanumeric with hyphens (`^[a-z0-9]+(?:-[a-z0-9]+)*$`)
- `description` — optional, max 500 chars
- `status` — optional, `draft` | `published` (default: `draft`)
- `blocks` — optional, array of block objects

**Success Response (201):**
```json
{
  "success": true,
  "message": "Page created successfully",
  "data": {
    "page": { ... }
  }
}
```

**Error Responses:**
- `409 Conflict` — Slug already exists
- `422 Unprocessable Entity` — Validation failed

---

### PUT /api/pages/:id

Update an existing page, including its blocks.

**Access:** Protected (JWT required)

**URL Parameter:** `id` — MongoDB ObjectId of the page

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "slug": "updated-slug",
  "description": "Updated description",
  "status": "published",
  "blocks": [ ... ]
}
```

**Notes:**
- Setting `status: "published"` automatically sets `publishedAt` if not already published
- Setting `status: "draft"` clears `publishedAt`
- Providing `blocks` replaces the entire blocks array

**Success Response (200):**
```json
{
  "success": true,
  "message": "Page updated successfully",
  "data": {
    "page": { ... }
  }
}
```

**Error Responses:**
- `404 Not Found` — Page not found
- `409 Conflict` — New slug conflicts with existing page
- `422 Unprocessable Entity` — Validation failed

---

### DELETE /api/pages/:id

Delete a page and all its embedded blocks.

**Access:** Protected (JWT required)

**URL Parameter:** `id` — MongoDB ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Page deleted successfully",
  "data": null
}
```

**Error Responses:**
- `404 Not Found` — Page not found

---

## Blocks Endpoints

Blocks are embedded subdocuments within pages. These endpoints modify the parent page's `blocks` array.

### POST /api/blocks

Add a new block to an existing page. Automatically re-orders existing blocks at or above the specified `order`.

**Access:** Protected (JWT required)

**Request Body:**
```json
{
  "pageId": "65a1b2c3d4e5f6789012345",
  "type": "equation",
  "data": {
    "equation": "E = mc^2",
    "displayMode": true,
    "description": "Mass-energy equivalence"
  },
  "order": 2
}
```

**Block Types:**

| Type | Required Data Fields | Description |
|------|---------------------|-------------|
| `header` | `text` (string), `level` (1–6) | Heading block |
| `paragraph` | `text` (string) | Rich text paragraph |
| `list` | `style` (ordered/unordered), `items` (array of strings) | Simple list |
| `nested-list` | `style`, `items` (array of `{content, items}`) | Nested list |
| `table` | `withHeadings` (bool), `content` (2D array of strings) | Data table |
| `equation` | `equation` (LaTeX string), `displayMode` (bool), `description` (optional) | Math equation |
| `image` | `file: {url, name}`, `caption` (optional), `withBorder` (optional) | Image block |
| `documentation` | `title`, `sections: [{heading, content}]` | Documentation block |
| `mixed-content` | `title`, `content: [{type, ...typeData}]` | Mixed content block |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Block created successfully",
  "data": {
    "block": { "_id": "...", "type": "equation", "data": {...}, "order": 2 },
    "page": { ... }
  }
}
```

---

### PUT /api/blocks/:id

Update an existing block's type, data, or order.

**Access:** Protected (JWT required)

**URL Parameter:** `id` — MongoDB ObjectId of the block (embedded `_id`)

**Request Body (all fields optional):**
```json
{
  "type": "equation",
  "data": { "equation": "F = ma", "displayMode": true },
  "order": 3
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Block updated successfully",
  "data": {
    "block": { ... }
  }
}
```

---

### DELETE /api/blocks/:id

Delete a block from its parent page. Remaining blocks are automatically re-ordered (0-based, sequential).

**Access:** Protected (JWT required)

**URL Parameter:** `id` — MongoDB ObjectId of the block

**Success Response (200):**
```json
{
  "success": true,
  "message": "Block deleted successfully",
  "data": null
}
```

---

## Health Check

### GET /api/health

Check API server status.

**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "message": "CMS API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — Request succeeded |
| 201 | Created — Resource created |
| 400 | Bad Request — Malformed request |
| 401 | Unauthorized — Missing or invalid token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource not found |
| 409 | Conflict — Duplicate slug |
| 422 | Unprocessable Entity — Validation failed |
| 429 | Too Many Requests — Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/auth/login` | 20 requests | 15 minutes |
| All other `/api/*` routes | 200 requests | 15 minutes |

---

## Authentication Flow

```
1. POST /api/auth/login  → receive JWT token
2. Store token in localStorage (admin CMS)
3. Send token in every protected request:
   Authorization: Bearer <token>
4. Token expires after 7 days (configurable via JWT_EXPIRES_IN)
5. On 401 response → redirect to /login
6. POST /api/auth/logout → clear token from localStorage
```
