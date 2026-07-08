-- Base schema. Run first, then 001_hardening.sql.
-- psql "$DATABASE_URL" -f migrations/000_schema.sql

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_id                     TEXT UNIQUE NOT NULL,
  name                          TEXT NOT NULL,
  parent_phone                  TEXT NOT NULL,
  interhall_ticket              TEXT UNIQUE NOT NULL,
  dob                           DATE NOT NULL,
  password_hash                 TEXT NOT NULL,
  branch_code                   TEXT DEFAULT '1A',
  verification_status           TEXT NOT NULL DEFAULT 'pending',
  rejection_reason              TEXT,

  first_name                    TEXT,
  last_name                     TEXT,
  email                         TEXT,
  phone                         TEXT,
  address                       TEXT,

  tenth_percentage              TEXT,
  inter_college                 TEXT,
  inter_hallticket              TEXT,
  inter_marks                   TEXT,

  hostel_type                   TEXT,
  transport_type                TEXT,

  father_name                   TEXT,
  father_phone                  TEXT,
  father_profession             TEXT,
  mother_name                   TEXT,
  mother_phone                  TEXT,
  mother_profession             TEXT,

  emacet_hall_ticket            TEXT,
  emacet_rank                   TEXT,

  higher_studies_interest       TEXT,
  higher_studies_country        TEXT,
  higher_studies_country_detail TEXT,
  higher_studies_program        TEXT,

  hobbies                       TEXT,
  skills_values                 TEXT,
  goals_short_term              TEXT,
  goals_long_term               TEXT,
  books_newspaper               TEXT,
  sport_name                    TEXT,
  sport_role                    TEXT,
  tournament_won                TEXT,
  placement_domain              TEXT,

  photo_url                     TEXT,

  must_change_password          BOOLEAN NOT NULL DEFAULT TRUE,

  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin', -- 'Super Admin' | 'admin' | ...
  branch_code   TEXT,                          -- NULL = all branches (super admin / principal)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  code       TEXT UNIQUE NOT NULL,
  seats      INTEGER NOT NULL DEFAULT 60,
  intake     INTEGER,
  hod_name   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type   TEXT NOT NULL,
  title           TEXT,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  file_url        TEXT,
  file_type       TEXT,
  file_size       INTEGER,
  rejection_reason TEXT,
  uploaded_at     TIMESTAMPTZ,
  verified_at     TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (student_id, document_type)
);

INSERT INTO branches (name, code, seats) VALUES
  ('Computer Science & Engineering', 'CSE', 60),
  ('Computer Science & Data Science', 'CSD', 60),
  ('Electronics & Communication Engineering', 'ECE', 60),
  ('Electrical & Electronics Engineering', 'EEE', 60),
  ('Mechanical Engineering', 'ME', 60),
  ('Civil Engineering', 'CE', 60),
  ('Computer Science & Business Systems', 'CSBS', 60),
  ('Chemical Engineering', 'CHE', 60),
  ('Computer Science & Machine Learning', 'CSM', 60),
  ('Biomedical Engineering', 'BME', 60),
  ('Pharmaceutical Engineering', 'PHE', 60)
ON CONFLICT (code) DO NOTHING;

COMMIT;
