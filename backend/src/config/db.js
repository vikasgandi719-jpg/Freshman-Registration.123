const { Pool } = require('pg');

const { DATABASE_URL, NODE_ENV } = process.env;

const ssl =
  NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false;

// We rely on a full connection string so deployments are simple and consistent.
// If it's missing (or missing the password), fail fast with a clear message.
if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Please configure PostgreSQL connection string (e.g. postgres://USER:PASSWORD@HOST:5432/DBNAME).'
  );
}

// Basic sanity check: postgres://user:pass@host/db
// (pg will accept many forms, but missing password is a common cause of SCRAM errors)
const hasPasswordInUrl = (() => {
  try {
    const u = new URL(DATABASE_URL);
    return typeof u.password === 'string' && u.password.length > 0;
  } catch (_) {
    return false;
  }
})();

if (!hasPasswordInUrl) {
  throw new Error(
    'DATABASE_URL appears invalid or missing password. Expected format like postgres://USER:PASSWORD@HOST:5432/DBNAME.'
  );
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl });

pool.on('connect', () => console.log('Connected to PostgreSQL'));
pool.on('error', (err) => console.error('Unexpected DB error', err));

module.exports = pool;
