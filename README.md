# Headless CMS — Production Ready Assignment

A fully containerized, production-ready Headless CMS system consisting of four interconnected applications: a public-facing Next.js frontend, a React + Vite admin panel, an Express.js REST API, and a MongoDB database.

---

## Architecture

```
cms-assignment/
├── backend/              # ExpressJS API (port 5000)
│   ├── src/
│   │   ├── config/       # MongoDB connection
│   │   ├── controllers/  # auth, pages, blocks
│   │   ├── middleware/   # auth, errorHandler, validate
│   │   ├── models/       # Admin, Page (with embedded Blocks)
│   │   ├── routes/       # /api/auth, /api/pages, /api/blocks
│   │   ├── seed/         # Seed data script
│   │   ├── utils/        # ApiError, response helpers
│   │   └── validators/   # express-validator schemas
│   └── server.js
│
├── admin-cms/            # React + Vite Admin Panel (port 3001)
│   └── src/
│       ├── components/   # Editor, Layout, Pages, UI
│       ├── hooks/        # useAuth, usePages
│       ├── layouts/      # DashboardLayout
│       ├── pages/        # Login, Dashboard, Pages, Create, Edit, Settings
│       ├── redux/        # store + slices (auth, pages, loading, error)
│       └── services/     # api, authService, pagesService, blocksService
│
├── public-frontend/      # Next.js 14 Public Site (port 3000)
│   └── src/
│       ├── app/          # App Router (layout, page, pages/[slug], not-found)
│       ├── components/   # BlockRenderer (9 types), Layout, UI
│       ├── redux/        # store + slices + provider
│       ├── services/     # API service (SSR-aware)
│       └── utils/        # helpers
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) 24+
- [Docker Compose](https://docs.docker.com/compose/) v2+

### 1. Clone & Configure

```bash
git clone <repository-url>
cd cms-assignment
cp .env.example .env
# Edit .env and set a strong JWT_SECRET
```

### 2. Start Everything

```bash
docker compose up --build
```

This single command will:
1. Pull MongoDB 7.0 and start the database
2. Build and start the Express.js backend (waits for MongoDB health)
3. Run the seed script to populate sample data
4. Build and start the Admin CMS (nginx serving Vite build)
5. Build and start the Next.js public frontend

### 3. Access the Applications

| Application      | URL                        | Description                  |
|------------------|----------------------------|------------------------------|
| Public Frontend  | http://localhost:3000      | Public article viewer        |
| Admin CMS        | http://localhost:3001      | Content management dashboard |
| Backend API      | http://localhost:5000/api  | REST API                     |
| API Health       | http://localhost:5000/api/health | Health check            |

### 4. Admin Login

```
Email:    admin@gmail.com
Password: Admin@123
```

---

## Tech Stack

### Backend
| Technology         | Purpose                              |
|--------------------|--------------------------------------|
| Node.js 20         | Runtime                              |
| Express.js 4       | Web framework                        |
| Mongoose 7         | MongoDB ODM                          |
| JWT + bcryptjs     | Authentication & password hashing    |
| express-validator  | Input validation                     |
| helmet             | Security headers                     |
| express-rate-limit | Rate limiting                        |
| express-mongo-sanitize | NoSQL injection prevention       |
| morgan             | HTTP request logging                 |

### Admin CMS
| Technology         | Purpose                              |
|--------------------|--------------------------------------|
| React 18           | UI framework                         |
| Vite 5             | Build tool                           |
| Redux Toolkit      | State management                     |
| React Router DOM 6 | Client-side routing                  |
| EditorJS           | Block-based rich text editor         |
| TailwindCSS 3      | Utility-first CSS                    |
| Axios              | HTTP client                          |
| KaTeX              | Math equation preview in editor      |
| nginx              | Static file serving + API proxy      |

### Public Frontend
| Technology         | Purpose                              |
|--------------------|--------------------------------------|
| Next.js 14         | React framework with App Router      |
| React 18           | UI framework                         |
| Redux Toolkit      | State management                     |
| React KaTeX        | LaTeX math equation rendering        |
| TailwindCSS 3      | Utility-first CSS                    |
| Axios              | HTTP client                          |

### Infrastructure
| Technology         | Purpose                              |
|--------------------|--------------------------------------|
| Docker             | Containerization                     |
| Docker Compose     | Multi-container orchestration        |
| MongoDB 7          | Primary database                     |
| nginx (alpine)     | Admin CMS reverse proxy              |

---

## API Reference

### Authentication

| Method | Endpoint            | Access    | Description              |
|--------|---------------------|-----------|--------------------------|
| POST   | /api/auth/login     | Public    | Login with email/password |
| POST   | /api/auth/logout    | Protected | Invalidate session        |
| GET    | /api/auth/verify    | Protected | Verify JWT token          |

### Pages

| Method | Endpoint            | Access                 | Description              |
|--------|---------------------|------------------------|--------------------------|
| GET    | /api/pages          | Public (published only) / Admin (all) | List pages |
| GET    | /api/pages/:slug    | Public (published only) / Admin (any) | Get page by slug |
| POST   | /api/pages          | Protected              | Create new page          |
| PUT    | /api/pages/:id      | Protected              | Update page              |
| DELETE | /api/pages/:id      | Protected              | Delete page              |

#### Query Parameters for GET /api/pages

| Parameter | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| status    | string | Filter by `draft` or `published`        |
| search    | string | Search title, slug, or description      |
| page      | number | Page number (default: 1)                |
| limit     | number | Items per page (default: 20)            |

### Blocks

| Method | Endpoint            | Access    | Description              |
|--------|---------------------|-----------|--------------------------|
| POST   | /api/blocks         | Protected | Add block to a page       |
| PUT    | /api/blocks/:id     | Protected | Update a block            |
| DELETE | /api/blocks/:id     | Protected | Delete a block            |

---

## Database Schema

### Admin Model

```javascript
{
  username:  String (required, unique, 3-50 chars),
  email:     String (required, unique, valid email),
  password:  String (required, hashed with bcrypt salt=12),
  role:      Enum ['superadmin', 'admin', 'editor'] (default: admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Page Model

```javascript
{
  title:       String (required, max 200 chars),
  slug:        String (required, unique, lowercase-with-hyphens),
  description: String (max 500 chars),
  status:      Enum ['draft', 'published'] (default: draft),
  publishedAt: Date,
  blocks:      [Block] (embedded array),
  createdBy:   ObjectId → Admin,
  createdAt:   Date,
  updatedAt:   Date
}
```

### Block Schema (embedded in Page)

```javascript
{
  _id:   ObjectId (auto),
  type:  Enum ['header', 'paragraph', 'list', 'nested-list',
               'table', 'equation', 'image', 'documentation', 'mixed-content'],
  data:  Mixed (type-specific JSON payload),
  order: Number (0-based sort index)
}
```

---

## Supported Block Types

| Block Type       | Data Structure                                      |
|------------------|-----------------------------------------------------|
| `header`         | `{ text, level }` — level 1–6                       |
| `paragraph`      | `{ text }` — supports inline HTML                   |
| `list`           | `{ style: 'ordered'|'unordered', items: [...] }`    |
| `nested-list`    | `{ style, items: [{ content, items: [...] }] }`     |
| `table`          | `{ withHeadings, content: [[cell,...],...]  }`      |
| `equation`       | `{ equation, displayMode, description }` — LaTeX    |
| `image`          | `{ file: { url, name }, caption, withBorder }`      |
| `documentation`  | `{ title, sections: [{ heading, content }] }`       |
| `mixed-content`  | `{ title, content: [{ type, ...typeData }] }`       |

---

## Seed Data

Running `docker compose up --build` automatically seeds the database with:

- **1 Admin user** — `admin@gmail.com` / `Admin@123`
- **4 Sample pages** (all published):

| Page               | Slug                | Highlights                                           |
|--------------------|---------------------|------------------------------------------------------|
| Electric Vehicles  | `ev`                | Power equations P=IV, battery comparison table, charging list |
| Renewable Energy   | `renewable-energy`  | Solar/wind equations, energy source table, nested lists |
| Methanol Economy   | `methanol`          | Combustion equations, property comparison table, production pathways |
| Mohar Platform     | `mohar`             | Optimization equations, MILP table, mixed content blocks |

---

## Environment Variables

| Variable              | Default               | Description                    |
|-----------------------|-----------------------|--------------------------------|
| `JWT_SECRET`          | (required)            | Secret key for JWT signing     |
| `JWT_EXPIRES_IN`      | `7d`                  | JWT expiration duration        |
| `MONGO_URI`           | mongodb://...         | MongoDB connection string      |
| `PORT`                | `5000`                | Backend server port            |
| `NODE_ENV`            | `production`          | Node environment               |
| `CORS_ORIGIN`         | (comma-separated)     | Allowed CORS origins           |
| `VITE_API_URL`        | (empty in docker)     | Admin CMS API base URL         |
| `API_URL`             | `http://backend:5000` | NextJS server-side API URL     |
| `NEXT_PUBLIC_API_URL` | (client URL)          | NextJS client-side API URL     |

---

## Development (without Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Set MONGO_URI to your local MongoDB
npm install
npm run dev        # nodemon auto-reload
npm run seed       # seed sample data
```

### Admin CMS

```bash
cd admin-cms
cp .env.example .env
npm install
npm run dev        # http://localhost:3001
```

### Public Frontend

```bash
cd public-frontend
cp .env.example .env
npm install
npm run dev        # http://localhost:3000
```

---

## Security Features

- **JWT Authentication** — HS256 signed tokens with configurable expiry
- **bcrypt Password Hashing** — salt rounds = 12
- **Helmet** — sets 14 security-related HTTP headers
- **Rate Limiting** — 200 req/15min globally, 20 req/15min for login
- **MongoDB Sanitization** — prevents NoSQL injection attacks
- **Input Validation** — all endpoints validated via express-validator
- **CORS** — configurable allowed origins whitelist
- **Protected Routes** — JWT middleware on all write operations
- **Global Error Handler** — consistent error responses, no stack traces in production
- **Proper HTTP Status Codes** — 200, 201, 400, 401, 403, 404, 409, 422, 500

---

## Content Flow

```
Admin logs in → JWT issued
     ↓
Admin creates/edits page with EditorJS
     ↓
Page saved to MongoDB with embedded blocks
     ↓
Admin publishes page (status: published)
     ↓
GET /api/pages/:slug (public)
     ↓
Next.js fetches page server-side (ISR, 60s revalidation)
     ↓
Redux Toolkit manages state client-side
     ↓
BlockRenderer renders each block by type
     ↓
React KaTeX renders LaTeX equations
     ↓
User sees dynamic, richly-formatted content
```

---

## Stopping & Cleanup

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (destroys database data)
docker compose down -v

# Rebuild from scratch
docker compose down -v && docker compose up --build
```

---

## Project Requirements Checklist

- [x] Login / Logout with JWT
- [x] JWT Authentication + Protected Routes
- [x] Admin Dashboard with statistics
- [x] Content Management (Create, Read, Update, Delete pages)
- [x] Rich Text Support via EditorJS
- [x] Mathematical Equations (LaTeX via KaTeX / React KaTeX)
- [x] Dynamic Page Rendering (all content from APIs — no hardcoded content)
- [x] Redux Toolkit (auth, pages, loading, error slices)
- [x] Responsive Design (mobile, tablet, desktop)
- [x] Error Handling (global error handler, custom error classes)
- [x] Dockerization (Dockerfile per service + docker-compose.yml)
- [x] Seed Data (admin user + 4 sample pages with rich content)
- [x] Environment Variables (.env.example for all services)
- [x] GitHub Ready Structure (.gitignore, README, folder structure)
- [x] Input Validations (express-validator on all endpoints)
- [x] Security (helmet, rate limiting, sanitization, bcrypt)
- [x] All Block Types (header, paragraph, list, nested-list, table, equation, image, documentation, mixed-content)
- [x] SEO Optimization (Next.js metadata API, OpenGraph tags)
- [x] ISR (Incremental Static Regeneration, 60s revalidation)
