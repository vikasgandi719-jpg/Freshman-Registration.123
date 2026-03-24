# Signup Flow Setup (Backend)

## Install dependencies

```bash
cd backend
npm install
```

This project already includes `bcrypt` and `multer` in `backend/package.json`.

## Prisma setup

1. Set `DATABASE_URL` in your backend environment.
2. Apply migrations:

```bash
cd backend
npx prisma migrate dev --name signup_flow
npx prisma generate
```

> If `DATABASE_URL` is not set, migration will fail.

## Signup endpoint

- **Method**: `POST`
- **Path**: `/api/auth/signup`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `name` (required)
  - `email` (required)
  - `password` (required, min 8 chars)
  - `file` (optional: jpeg/png/webp/pdf, max 5MB)

## Example cURL request

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -F "name=Jane Doe" \
  -F "email=jane@example.com" \
  -F "password=securePass123" \
  -F "file=@/absolute/path/to/profile.png"
```

## Response behavior

- `201` when signup succeeds
- `400` for validation errors
- `409` when email already exists
- `500` for unexpected server errors

## Troubleshooting: "Data is not stored in DB"

1. **Frontend Demo Mode enabled**
   - `src/services/authService.js` uses `EXPO_PUBLIC_DEMO_MODE`.
   - If this is `true`, API requests are mocked and nothing is written to DB.

2. **Signup payload mismatch**
   - Frontend must send `name`, `email`, `password` (and optional `file`) as multipart.
   - Missing `email`/`password` results in `400`.

3. **Database/migration not applied**
   - If Prisma migrations are not applied, `prisma.user.create` will fail at runtime.

4. **Invalid API URL**
   - Ensure `API.BASE_URL` points to your running backend.
