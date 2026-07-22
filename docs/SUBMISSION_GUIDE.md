# Headless CMS — Submission Guide

## Quick Start (Evaluator Instructions)

### Prerequisites

- Docker 24+ installed
- Docker Compose v2+ installed
- Ports 3000, 3001, 5000 available on localhost

### Step 1 — Start the System

```bash
cd cms-assignment
docker compose up --build
```

Expected output sequence:
```
cms-mongodb      | Ready for connections
cms-backend      | Server running in production mode on port 5000
cms-seed         | Seed complete!
cms-admin        | nginx ready
cms-public       | Next.js server ready
```

**First-time build takes 3–5 minutes** (downloading images, installing npm packages, building apps).

### Step 2 — Verify Services

| Service | URL | Expected |
|---------|-----|----------|
| Backend health | http://localhost:5000/api/health | `{"success":true}` |
| Admin CMS | http://localhost:3001 | Login page |
| Public frontend | http://localhost:3000 | Homepage with articles |

### Step 3 — Test Admin Panel

1. Navigate to **http://localhost:3001**
2. Login with:
   - Email: `admin@gmail.com`
   - Password: `Admin@123`
3. You should see the dashboard with stats: **4 pages**, **4 published**, **0 drafts**

### Step 4 — Test Public Frontend

1. Navigate to **http://localhost:3000**
2. You should see 4 published articles on the homepage
3. Click any article to view the full page with:
   - Mathematical equations rendered via React KaTeX
   - Tables with proper styling
   - Nested lists
   - Documentation blocks
   - Mixed content blocks

---

## Testing Scenarios

### Admin CMS — Full CRUD Flow

**Create a Page:**
1. Login → Click "New Page"
2. Enter title (slug auto-generates)
3. Add blocks using the EditorJS toolbar (+)
4. Add an equation block: click (+) → "Equation" → type `E = mc^2`
5. Click "Save as Draft" or "Save & Publish"

**Edit a Page:**
1. Pages list → click "Edit" on any card
2. Modify title, slug, content, or blocks
3. Click "Save Changes"

**Publish/Unpublish:**
- From Pages list → click "Publish" on a draft card
- From EditPage → change status dropdown → Save

**Delete a Page:**
- Pages list → click "Delete" → confirm in modal

### API Testing (curl)

```bash
# Health check
curl http://localhost:5000/api/health

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Admin@123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

# List published pages (public)
curl http://localhost:5000/api/pages

# Get page by slug with full blocks
curl http://localhost:5000/api/pages/ev

# List all pages including drafts (authenticated)
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/pages

# Create a page
curl -X POST http://localhost:5000/api/pages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Page",
    "slug": "test-page",
    "description": "Created via API",
    "status": "published",
    "blocks": [
      {"type": "header", "data": {"text": "Hello", "level": 1}, "order": 0},
      {"type": "paragraph", "data": {"text": "World"}, "order": 1},
      {"type": "equation", "data": {"equation": "\\\\pi r^2", "displayMode": true}, "order": 2}
    ]
  }'

# Verify token
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/verify
```

---

## Stopping the System

```bash
# Stop all containers (data persists)
docker compose down

# Stop and remove all data (full reset)
docker compose down -v

# Restart with fresh seed
docker compose down -v && docker compose up --build
```

---

## Troubleshooting

### Port already in use
```bash
# Check which process uses the port
lsof -i :3000   # or :3001, :5000
# Kill it, then re-run docker compose up --build
```

### Seed didn't run / no pages showing
```bash
# Manually re-run the seed
docker compose exec backend node src/seed/seed.js
```

### Admin CMS not showing API data
- Check browser console for network errors
- Verify backend is running: `docker compose ps`
- Check nginx proxy: `docker compose logs admin-cms`

### Public frontend shows no articles
- Backend must be healthy first
- Check: `docker compose logs backend`
- Check: `curl http://localhost:5000/api/pages`

### Complete rebuild
```bash
docker compose down -v
docker system prune -f
docker compose up --build
```

---

## Architecture Overview

```
Browser (localhost:3001)
        ↓
   nginx (Admin CMS)
  ┌─────────────────┐
  │  React SPA      │
  │  + Redux        │
  │  + EditorJS     │
  └─────────────────┘
        ↓ /api/* proxy
        ↓
   Express.js Backend (:5000)
        ↓
   MongoDB (:27017)


Browser (localhost:3000)
        ↓
   Next.js App (:3000)
  ┌─────────────────┐
  │  App Router     │
  │  + ISR          │
  │  + Redux        │
  │  + React KaTeX  │
  └─────────────────┘
        ↓ server-side: http://backend:5000
        ↓ client-side: http://localhost:5000
   Express.js Backend (:5000)
```

---

## Project Structure Reference

```
cms-assignment/
├── backend/              # Express API (port 5000)
├── admin-cms/            # React + Vite Admin (port 3001)
├── public-frontend/      # Next.js Public Site (port 3000)
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── REQUIREMENT_MAPPING.md
│   └── SUBMISSION_GUIDE.md
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Evaluation Checklist

- [ ] `docker compose up --build` completes without errors
- [ ] All 5 services start and pass health checks
- [ ] Seed data is populated (4 pages visible)
- [ ] Admin login works at http://localhost:3001
- [ ] CRUD operations work in Admin CMS
- [ ] Equations render in EditorJS (live preview with KaTeX)
- [ ] Public frontend shows articles at http://localhost:3000
- [ ] Article pages render equations with React KaTeX
- [ ] Tables render correctly
- [ ] Nested lists render correctly
- [ ] Protected routes redirect to login when not authenticated
- [ ] JWT token stored and cleared correctly on login/logout
- [ ] Redux state updates reflect in UI
- [ ] Responsive design works on mobile viewport
- [ ] API returns correct HTTP status codes
- [ ] 404 page shows for unknown routes
