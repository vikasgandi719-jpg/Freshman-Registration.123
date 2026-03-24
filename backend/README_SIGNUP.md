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
