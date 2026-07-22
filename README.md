# Headless CMS - Frontend Engineering Assignment

A production-ready Headless Content Management System (CMS) built using Next.js, React, Express.js, MongoDB, Redux Toolkit, and Docker.

The application allows administrators to manage dynamic website content through an Admin CMS while the public-facing website consumes all content through REST APIs without relying on hardcoded data.

---

## Features

- JWT Authentication (Login & Logout)
- Protected Admin Routes
- Dynamic Content Management System
- Rich Text Content Support
- Mathematical Equation Rendering (LaTeX)
- Dynamic Public Website
- Redux Toolkit State Management
- Responsive Design
- Dockerized Multi-Service Architecture
- RESTful APIs
- MongoDB Database Integration
- Global Error Handling & Input Validation
- Production Ready Project Structure

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 |
| Admin CMS | React + Vite |
| Backend | Express.js |
| Database | MongoDB |
| State Management | Redux Toolkit |
| Authentication | JWT + bcrypt |
| Rich Content Editor | EditorJS |
| Math Rendering | React KaTeX |
| Infrastructure | Docker & Docker Compose |
| Styling | TailwindCSS |
| API Client | Axios |

---

## Project Structure

```
cms-assignment/
│
├── backend/
├── admin-cms/
├── public-frontend/
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start

### Clone Repository

```bash
git clone <repository-url>
cd cms-assignment
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Update the required values inside:

```text
JWT_SECRET=
MONGO_URI=
NODE_ENV=
PORT=
SESSION_SECRET=
```

---

## Run the Entire Project

```bash
docker compose up --build
```

Docker Compose will automatically:

- Start MongoDB
- Start Express Backend API
- Seed Sample Data
- Start Admin CMS
- Start Public Frontend

---

## Application URLs

| Service | URL |
|---------|-----|
| Public Frontend | http://localhost:3000 |
| Admin CMS | http://localhost:3001 |
| Backend API | http://localhost:5000/api |
| API Health | http://localhost:5000/api/health |

---

## Evaluation Credentials

The project includes seeded sample data for evaluation purposes.

```text
Email    : admin@gmail.com
Password : Admin@123
```

> Note: These credentials are provided only for assignment evaluation.

---

## Rich Content Support

The CMS supports:

- Long-form Text
- Multiple Paragraphs
- Ordered & Unordered Lists
- Nested Lists
- Tables
- Mathematical Equations (LaTeX)
- Documentation Blocks
- Mixed Content Blocks
- Images
- Dynamic Structured Content

---

## Assignment Requirements Implemented

- Login & Logout
- JWT Authentication
- Admin Dashboard
- Content Management (CRUD)
- Dynamic API Driven Content
- Redux Toolkit Integration
- Responsive Design
- Mathematical Equation Rendering
- Dockerized Infrastructure
- Environment Variable Configuration
- Protected Routes
- Input Validation
- Security Middleware
- Rich Content Management
- Dynamic Public Rendering
- Production Ready Architecture

---

## Environment Variables

```text
JWT_SECRET=
MONGO_URI=
NODE_ENV=
PORT=
SESSION_SECRET=
```

Refer to `.env.example` for additional configuration options.

---

## Documentation

Additional project documentation is available inside the `docs` directory.

- API Documentation
- Requirement Mapping
- Submission Guide

---

## Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Helmet Security Headers
- Rate Limiting
- MongoDB Sanitization
- Protected Routes
- Input Validation
- Global Error Handling
- CORS Configuration

---

## Stopping the Containers

```bash
docker compose down
```

Remove containers and volumes:

```bash
docker compose down -v
```

Rebuild the project:

```bash
docker compose down -v
docker compose up --build
```

---

## Submission Contents

This repository contains:

- Source Code
- Docker Configuration
- Environment Variable Template
- API Documentation
- Assignment Requirement Mapping
- Submission Guide
- Seed Data
- Production Ready Project Structure

---

## License

This project was developed as part of a Frontend Engineering Assignment for evaluation purposes.
