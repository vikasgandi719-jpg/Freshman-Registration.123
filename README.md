# BVRITN Freshman Registration

A React Native (Expo web) + Node.js app for freshman document submission and
admin verification at B V Raju Institute of Technology, Naraspur.

Students register, upload required documents (Aadhaar, 10th memo, EAPCET rank
card, etc.), and admins review and approve/reject each document. Files are
stored on Cloudinary, metadata in Postgres.

> **This branch (`backend_functional`)** has the real backend wired up — no
> demo mode. Everything hits real Postgres and real Cloudinary.

---

## Tech stack

| Layer          | Stack                                                          |
| -------------- | -------------------------------------------------------------- |
| Frontend       | Expo SDK 55, React Native 0.83, React Navigation 7             |
| Backend        | Node.js 18+, Express 4, `pg` (Postgres client)                 |
| Database       | PostgreSQL 15+ (tested on 18)                                  |
| File storage   | Cloudinary                                                     |
| Auth           | JWT (student + separate admin token)                           |
| Security       | Helmet, express-rate-limit, bcrypt                             |

---

## Prerequisites — install these once

| Tool                     | Version | Why                              |
| ------------------------ | ------- | -------------------------------- |
| **Node.js**              | ≥ 18    | Runs backend + Expo              |
| **PostgreSQL**           | ≥ 15    | Local database                   |
| **Git**                  | any     | Clone the repo                   |
| **Cloudinary account**   | free    | File storage (2 min signup)      |

**Windows:**
- Node: https://nodejs.org (LTS)
- Postgres: https://www.postgresql.org/download/windows/ — remember the
  `postgres` superuser password you set during install
- After install, verify `psql --version` works in a new terminal

**macOS/Linux:** use Homebrew / apt as usual.

---

## One-time setup

### 1. Clone and install

```bash
git clone https://github.com/vikasgandi719-jpg/Freshman-Registration.123.git
cd Freshman-Registration.123
git checkout backend_functional
npm install                # frontend deps
cd backend && npm install  # backend deps
cd ..
```

### 2. Create the database

Open a terminal (Windows: PowerShell/Git Bash) and run:

```bash
# Uses your postgres superuser password when prompted
psql -U postgres -h localhost -c "CREATE ROLE bvritn_app LOGIN PASSWORD 'bvritn_dev_pw';"
psql -U postgres -h localhost -c "CREATE DATABASE bvritn OWNER bvritn_app;"
```

Then run both migrations against the new database:

```bash
cd backend
psql "postgresql://bvritn_app:bvritn_dev_pw@localhost:5432/bvritn" -f migrations/000_schema.sql
psql "postgresql://bvritn_app:bvritn_dev_pw@localhost:5432/bvritn" -f migrations/001_hardening.sql
```

### 3. Sign up for Cloudinary (free tier)

1. Go to https://cloudinary.com/users/register_free
2. After signup, on the dashboard, note down:
   - **Cloud name**
   - **API key**
   - **API secret**

### 4. Create `backend/.env`

Copy the template and fill it in:

```bash
cd backend
cp .env.example .env
```

Then open `backend/.env` and set:

```
JWT_SECRET=<paste output of: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
DATABASE_URL=postgresql://bvritn_app:bvritn_dev_pw@localhost:5432/bvritn
NODE_ENV=development
PORT=5000
JWT_EXPIRES_IN=7d
DB_POOL_MAX=10

CLOUDINARY_CLOUD_NAME=<from Cloudinary dashboard>
CLOUDINARY_API_KEY=<from Cloudinary dashboard>
CLOUDINARY_API_SECRET=<from Cloudinary dashboard>
```

> **Never commit `.env`** — it's already in `.gitignore`.

### 5. Seed one admin account

```bash
cd backend
node -e "require('bcrypt').hash('SuperAdmin@123', 10).then(h => console.log(h))"
```

Copy the hash it prints, then:

```bash
psql "postgresql://bvritn_app:bvritn_dev_pw@localhost:5432/bvritn" -c \
"INSERT INTO admins (name, email, password_hash, role, branch_code)
 VALUES ('Super Admin', 'super@bvritn.ac.in', '<paste hash here>', 'Super Admin', NULL)
 ON CONFLICT (email) DO NOTHING;"
```

---

## Running the app

You need **two terminals** open — one for backend, one for frontend.

**Terminal 1 — backend:**
```bash
cd backend
npm start
```
Wait for `Server running on port 5000`.

**Terminal 2 — frontend:**
```bash
npx expo start --web
```
Wait for `Web Bundled`, then open http://localhost:8081 in your browser
(usually auto-opens).

**To stop:** `Ctrl+C` in each terminal.

---

## Credentials cheatsheet

- **Super admin login:** `super@bvritn.ac.in` / `SuperAdmin@123`
- **Student login:** the unique ID shown on the registration success screen
  (e.g. `2026-BVRITN-1A-0001`), password = DOB in `DDMMYYYY` format (until
  the student changes it via **Profile → Change Password**)
- **Postgres (for pgAdmin):** DB `bvritn`, user `bvritn_app`, password
  `bvritn_dev_pw`

---

## Testing the full flow

1. Open http://localhost:8081
2. Click **Create Account**, fill in name / parent phone / interhall ticket /
   DOB
3. On the success screen, note the Unique ID + password
4. **Sign In** as the student
5. Go to **Documents** tab → tap any doc → **Choose File** → **Upload
   Document**
6. Confirm the doc shows "Under Review" status
7. Go back to landing screen → **🔐 Admin Portal**
8. Log in with the super admin credentials above
9. **Students** → click your student → **Documents** tab
10. Tap **View** to see the uploaded file on Cloudinary
11. Tap **Approve** or **Reject** — status flips instantly

---

## Troubleshooting

| Symptom                                    | Fix                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------- |
| Backend: `ECONNREFUSED 5432`               | Postgres isn't running. Windows: check Services. macOS: `brew services start postgresql` |
| Backend: `password authentication failed`  | DB password in `.env` doesn't match what you set in step 2           |
| Backend: `cloud_name is disabled`          | Cloudinary keys missing / wrong in `.env`                            |
| Frontend: "Port 8081 already in use"       | Kill the old process: `taskkill /F /IM node.exe` (Win) or `pkill node` |
| Upload fails silently                      | Check backend terminal for the exact error (Multer, Cloudinary, etc.) |
| Admin sees no students                     | Nothing registered yet — register a student first                    |

---

## Project structure

```
Freshman-Registration.123/
├── backend/
│   ├── server.js                    # Express entrypoint
│   ├── migrations/
│   │   ├── 000_schema.sql           # Tables, seed branches
│   │   └── 001_hardening.sql        # Sequences, indexes, triggers
│   ├── src/
│   │   ├── config/                  # db.js, jwt.js, cloudinary.js
│   │   ├── controllers/             # auth, student, admin, document
│   │   ├── middleware/              # auth, adminAuth, upload, errorHandler
│   │   ├── models/                  # User, Admin, Document, Branch
│   │   ├── routes/                  # authRoutes, studentRoutes, ...
│   │   └── services/                # otpService, storageService
│   └── .env                         # ⚠️ your local secrets, never commit
├── src/
│   ├── screens/                     # auth / student / admin screens
│   ├── components/                  # shared UI components
│   ├── services/                    # api.js, authService, studentService,
│   │                                # documentService, adminService, exportService
│   ├── context/                     # AuthContext, AdminContext, StudentContext
│   ├── hooks/                       # useAuth, useDocuments, useStudents
│   ├── navigation/                  # AuthNavigator, StudentNavigator, AdminNavigator
│   └── constants/                   # config, branches, documents, colors
└── App.js                           # Root component, providers
```

---

## Feature status

| Feature                                    | Status  |
| ------------------------------------------ | ------- |
| Register / login / logout                  | ✅ Live |
| Profile view + edit                        | ✅ Live |
| Document upload → Cloudinary → DB          | ✅ Live |
| Admin: list / detail / verify / reject     | ✅ Live |
| Admin: per-document approve/reject         | ✅ Live |
| Student: change password                   | ✅ Live |
| CSV / JSON export of students              | ✅ Live |
| Force change password on first login       | 🚧 Planned |
| Password reset via email                   | 🚧 Planned |
| SMS OTP                                    | ⏭️ College-managed |
| Photo (avatar) upload                      | 🚧 Component exists but not wired |
| Branch-scoped admin roles                  | 🚧 Planned |
| Native Android build (EAS)                 | 🚧 Planned |

---

## Contributing

Work off `backend_functional` for now. When you push a fix, open a PR to
`backend_functional` (not `main` — that still has the old demo-mode code).
