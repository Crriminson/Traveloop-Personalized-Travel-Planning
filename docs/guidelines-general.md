# Traveloop — General Guidelines

## Stack
| Layer | Choice |
|---|---|
| Frontend | React + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| State | Zustand (auth + current trip context only) |
| HTTP | Axios with JWT interceptor |
| Charts | Recharts |
| Maps | Leaflet.js + React-Leaflet (OpenStreetMap, no API key) |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh) + bcrypt |
| Validation | Zod (backend) + React Hook Form (frontend) |

No Firebase, Supabase, or any BaaS. No GraphQL. Backend must be self-contained.

---

## Project Structure

```
traveloop/
├── client/
│   └── src/
│       ├── api/           # Axios instance + one file per resource
│       ├── components/    # ui/ (primitives), layout/, shared/ (domain cards)
│       ├── pages/         # One folder per screen
│       ├── store/         # Zustand stores
│       ├── hooks/         # Custom hooks
│       ├── utils/         # Pure functions (dates, currency, formatting)
│       └── constants/     # Enums, category lists, config values
└── server/
    ├── prisma/            # schema.prisma, migrations/, seed.js
    └── src/
        ├── config/        # DB client, env validation
        ├── middleware/     # auth, admin, validate, errorHandler
        ├── routes/        # Route definitions only
        ├── controllers/   # Parse request → call service → return response
        ├── services/      # All business logic and Prisma queries
        ├── schemas/       # Zod validation schemas
        └── utils/         # jwt, hash, apiResponse
```

---

## API Conventions

- Base: `/api/v1`
- All responses: `{ success, data, message, errors? }`
- Protected routes: `Authorization: Bearer <token>`
- Pagination: `?page=1&limit=20` on all list endpoints
- Filtering: query params (`?category=FOOD&cityId=xxx`)
- Correct HTTP status codes always (200, 201, 400, 401, 403, 404, 409, 500)

---

## Auth

- Access token: 15min expiry, in-memory (Zustand)
- Refresh token: 7-day expiry, stored in `refresh_tokens` table, sent via `httpOnly` cookie
- Axios interceptor: on 401 → call `/auth/refresh` → retry original request → on failure, clear auth + redirect to `/login`
- Passwords: bcrypt, salt rounds 12. Never return `passwordHash` in any response.

---

## Patterns

**Controllers are thin.** They parse the request, call a service, return the response. No logic.

**Services own all logic.** DB queries, calculations, error throwing — all here.

**Never put Prisma queries in controllers or routes.**

```js
// Controller pattern
export const createTrip = async (req, res, next) => {
  try {
    const trip = await tripsService.createTrip(req.user.id, req.body);
    res.status(201).json(apiResponse.success(trip, 'Trip created'));
  } catch (err) { next(err); }
};
```

---

## Validation

- Every POST/PUT route has a Zod schema, enforced via `validate.middleware.js`
- Frontend validates with React Hook Form + Zod before any request is sent
- Key rules: email format, password min 8 chars + 1 uppercase + 1 number, end date ≥ start date, costs non-negative

---

## Error Handling

- All async handlers wrapped with try/catch (or an `asyncHandler` util)
- Global error middleware formats all errors consistently
- Frontend: field-level errors inline, async errors as toast notifications (top-right, 3s)
- 401 → auto refresh, 403 → "Access denied", 404 → custom page

---

## Coding Standards

- camelCase for variables/functions, PascalCase for components, UPPER_SNAKE for constants
- Files over 200 lines → split them
- Always async/await, never `.then()/.catch()` chains
- No magic numbers — all constants go in `constants/`
- No `console.log` in production — use env-gated logging
- Comment the *why*, not the *what*

---

## Security

- Rate limit auth routes: 10 requests / 15min per IP (`express-rate-limit`)
- CORS: allow frontend origin only
- Prisma `select`: always explicitly select fields, never return full objects with sensitive data
- Authorization: every trip route verifies the user is creator or member before proceeding

---

## Performance

- Debounce all search inputs (300ms)
- `React.memo` on heavy list items (activity cards in kanban)
- `loading="lazy"` on all images
- Paginate all list endpoints
- Seed script populates real data — no hardcoded JSON anywhere in the final app

---

## Build Order

**Phase 1 — Foundation**
Auth → User profile → Trip CRUD → Stops CRUD + reorder → Stop Activities CRUD → Dashboard → Itinerary Builder → Itinerary View

**Phase 2 — Core Features**
City Search → Activity Discovery → Budget (allocations + expenses + charts) → Public sharing → Packing checklist

**Phase 3 — Polish**
Trip Notes → Profile/Settings → Map view → Admin Dashboard → Trip cloning

---

## Environment Variables

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
