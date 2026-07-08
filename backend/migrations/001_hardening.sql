-- Hardening migration for the freshman registration backend.
-- Run once: psql "$DATABASE_URL" -f migrations/001_hardening.sql

BEGIN;

-- 1. Atomic student counter — replaces the race-prone `COUNT(*)` fallback
--    used by User.getNextCounter().
CREATE SEQUENCE IF NOT EXISTS student_counter_seq START 1;

-- Backfill the sequence to the current max, so we never re-issue an ID.
-- GREATEST(1, ...) — setval's is_called=true form rejects 0 on an empty table.
SELECT setval(
  'student_counter_seq',
  GREATEST(
    1,
    (SELECT COUNT(*) FROM users),
    (SELECT COALESCE(MAX(
        CAST(SPLIT_PART(unique_id, '-', 4) AS INTEGER)
      ), 0) FROM users)
  ),
  (SELECT COUNT(*) FROM users) > 0
);

-- 2. Unique constraint the document upsert relies on (ON CONFLICT).
--    Without it, upsert silently duplicates rows on re-upload.
CREATE UNIQUE INDEX IF NOT EXISTS documents_student_type_uniq
  ON documents(student_id, document_type);

-- 3. Store cloudinary public_id so we can delete without brittle URL parsing.
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;

-- 4. Cascade docs when a user is deleted so we don't orphan blobs / rows.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'documents_student_id_fkey'
      AND table_name = 'documents'
  ) THEN
    ALTER TABLE documents
      ADD CONSTRAINT documents_student_id_fkey
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Automatic updated_at trigger so it never goes stale on ad-hoc updates.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_touch ON users;
CREATE TRIGGER users_touch BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS documents_touch ON documents;
CREATE TRIGGER documents_touch BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. Helpful indexes for admin list filtering.
CREATE INDEX IF NOT EXISTS users_verification_status_idx ON users(verification_status);
CREATE INDEX IF NOT EXISTS users_branch_code_idx         ON users(branch_code);
CREATE INDEX IF NOT EXISTS documents_status_idx          ON documents(status);

COMMIT;
