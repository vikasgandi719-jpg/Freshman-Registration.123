const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: 15_000,
  query_timeout: 15_000,
});

pool.on('connect', () => console.log('Connected to PostgreSQL'));
pool.on('error', (err) => {
  // A backend closed the idle connection, network hiccup, etc.
  // The pool auto-replaces the client; log so we notice recurring issues.
  console.error('[db] pool error:', err.message);
});

module.exports = pool;
