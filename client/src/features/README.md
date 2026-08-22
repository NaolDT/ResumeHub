# Frontend feature modules

Domain code belongs in these folders (implemented in later milestones):

| Folder | Responsibility |
| --- | --- |
| `auth/` | Login, registration, verification, password reset |
| `resume/` | Resume editor, sections, autosave |
| `templates/` | Template catalog and styling |
| `ats/` | ATS scoring UI |
| `ai/` | Writing assistant UI (calls API only) |
| `portfolio/` | Public portfolio builder |
| `tracker/` | Job applications |
| `analytics/` | User career analytics |
| `admin/` | Platform administration |

Do not put Express-side business rules in React components. Talk to the backend through `src/api/`.
