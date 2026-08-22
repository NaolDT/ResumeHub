# ResumeHub

ResumeHub is an AI-powered resume builder and career platform. This repository is a **modular MERN TypeScript monolith**: a React SPA (`client/`) consuming a versioned Express REST API (`server/`) backed by MongoDB.

Phase 1 is a **zero-cost, fully functional** product using free/open-source providers and rule-based AI fallbacks. Phase 2 is a configuration and infrastructure upgrade (paid LLM, managed storage, payments), not a rewrite.

## Authoritative documents

Treat these as the source of truth (not this README):

- `AI_Resume_Builder_SRS.docx` — functional and non-functional requirements
- `AI_Resume_Builder_System_Architecture.docx` — layered architecture and provider abstractions

Local copies of those Word files live alongside this repository in `Pictures/WebDevelopment/`. Engineering notes derived from them are in `docs/`.

## Stack (Phase 1)

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript, MongoDB, Mongoose |
| Auth (later milestones) | JWT access + refresh rotation, bcrypt, Google/GitHub OAuth |
| API | `GET/POST/... /api/v1/...` |

## Repository layout

```text
resumehub/
├── client/          # React SPA
├── server/          # Express API
├── docs/            # architecture, API, decisions, development
├── package.json     # npm workspaces
└── .env.example     # safe placeholders only
```

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB is **not** required until Milestone 1

## Setup

```bash
cd resumehub
copy .env.example .env
copy client\.env.example client\.env
npm install
```

On macOS/Linux, use `cp` instead of `copy`.

## Commands

```bash
npm run dev          # API on :5000 and SPA on :5173 (proxied /api)
npm run lint
npm run typecheck
npm test
npm run format
npm run build
```

The Vite dev server proxies `/api` to `http://localhost:5000`. Keep `VITE_API_BASE_URL=/api/v1` in local development.

## Development sequence

Work **one milestone at a time**. Milestone 0 (this commit) is repository foundation only. Do not implement authentication, resumes, or AI until the matching milestone.

## Security

Never commit `.env` files or real credentials. JWT secrets, OAuth secrets, and API keys must stay in environment variables.
