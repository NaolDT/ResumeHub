# ResumeHub

ResumeHub is an AI-powered resume builder and career platform. This repository is a **modular MERN TypeScript monolith**: a React SPA (`client/`) consuming a versioned Express REST API (`server/`) backed by MongoDB.

Phase 1 is a **zero-cost, fully functional** product using free/open-source providers and rule-based AI fallbacks. Phase 2 is a configuration and infrastructure upgrade (paid LLM, managed storage, payments), not a rewrite.

## Features (Phase 1)

| Feature | Route | Auth |
|---------|-------|------|
| **Resume Builder** — drag-and-drop sections, live preview, PDF export | `/builder/:id` | ✅ Required |
| **ATS Score Checker** — keyword analysis, 0-100 score, improvement tips | `/ats-check` | ✅ Required |
| **AI Cover Letter Generator** — template-based, tailored to JD | `/cover-letters` | ✅ Required |
| **Job Application Tracker** — CRUD pipeline with status tracking | `/tracker` | ✅ Required |
| **Interview Prep** — flashcard deck, topic filtering | `/interview-prep` | ✅ Required |
| **Public Portfolio** — toggle resume public, shareable URL | `/portfolio` | ✅ Required |
| **Public Resume View** — read-only resume preview with download | `/r/:slug` | 🌐 Public |
| **Public Portfolio Page** — branded landing page with contact | `/portfolio/:slug` | 🌐 Public |
| **Dark Mode** — system preference + toggle, persisted to localStorage | All pages | — |

## Authoritative documents

Treat these as the source of truth (not this README):

- `AI_Resume_Builder_SRS.docx` — functional and non-functional requirements
- `AI_Resume_Builder_System_Architecture.docx` — layered architecture and provider abstractions

Local copies of those Word files live alongside this repository in `Pictures/WebDevelopment/`. Engineering notes derived from them are in `docs/`.

## Stack (Phase 1)

| Layer | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4, React Router v7, TanStack Query, React Hook Form, Zod |
| Backend | Node.js, Express 5, TypeScript, MongoDB, Mongoose |
| Auth | JWT access + refresh rotation, bcrypt |
| AI | Rule-based ATS scorer + cover letter generator (Gemini-ready abstraction) |
| Testing | Vitest, Testing Library, mongodb-memory-server |

## Repository layout

```text
resumehub/
├── client/                   # React SPA
│   └── src/
│       ├── api/              # apiGet/apiPost/… helpers
│       ├── app/              # router, providers
│       ├── features/
│       │   ├── auth/         # AuthContext, AuthProvider
│       │   ├── templates/    # TemplateRenderer (6 resume templates)
│       │   └── theme/        # ThemeContext, ThemeProvider, useTheme
│       ├── layouts/          # AppLayout (sidebar, mobile nav, theme toggle)
│       └── pages/            # All page components
├── server/                   # Express API
│   └── src/
│       ├── controllers/      # Request handlers
│       ├── models/           # Mongoose schemas
│       ├── routes/           # Express routers
│       └── services/         # Business logic (AI, Resume, Auth, JobTracker, Interview)
│   └── tests/                # Vitest integration tests
├── docs/                     # Architecture, API, decisions
├── package.json              # npm workspaces root
└── .env.example              # Safe placeholders only
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB running locally (or set `MONGODB_URI` to Atlas)

## Setup

```bash
cd resumehub
copy .env.example .env        # Windows
cp .env.example .env          # macOS/Linux
npm install
```

Edit `.env` and set at minimum:

```env
MONGODB_URI=mongodb://localhost:27017/resumehub
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
```

## Commands

```bash
# Development (API on :5000, SPA on :5173 with /api proxy)
npm run dev

# Type-checking
npm run typecheck

# Linting
npm run lint

# Testing (both client and server)
npm test

# Production build
npm run build
```

The Vite dev server proxies `/api` to `http://localhost:5000`. Keep `VITE_API_BASE_URL=/api/v1` in local development.

## API reference (v1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login, returns access + refresh tokens |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `GET` | `/api/v1/resumes` | List user's resumes |
| `POST` | `/api/v1/resumes` | Create resume |
| `GET` | `/api/v1/resumes/:id` | Get resume |
| `PUT` | `/api/v1/resumes/:id` | Update resume |
| `DELETE` | `/api/v1/resumes/:id` | Delete resume |
| `GET` | `/api/v1/resumes/public/:slug` | Public resume (no auth) |
| `POST` | `/api/v1/resumes/public/:slug/download` | Record download (no auth) |
| `POST` | `/api/v1/ai/ats-score` | Calculate ATS score |
| `POST` | `/api/v1/ai/cover-letter` | Generate cover letter |
| `GET` | `/api/v1/interview-questions` | Get interview questions (optional `?topic=`) |
| `GET` | `/api/v1/job-tracker/applications` | List job applications |
| `POST` | `/api/v1/job-tracker/applications` | Create job application |
| `PATCH` | `/api/v1/job-tracker/applications/:id` | Update job application |
| `DELETE` | `/api/v1/job-tracker/applications/:id` | Delete job application |

## Testing

```bash
# Client (13 tests)
cd client && npm test

# Server (30 tests)
cd server && npm test
```

Tests use `mongodb-memory-server` for integration tests — no real MongoDB connection needed.

## Security

Never commit `.env` files or real credentials. JWT secrets and API keys must stay in environment variables.
