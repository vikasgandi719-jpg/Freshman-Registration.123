const jwt = require('jsonwebtoken');

const SECRET     = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!SECRET || SECRET === 'changeme') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET is not set. Refusing to start in production with an insecure secret.',
    );
  }
  console.warn(
    '[WARN] JWT_SECRET not set — using a random dev secret. Sessions will invalidate on restart.',
  );
}

const DEV_FALLBACK =
  SECRET || require('crypto').randomBytes(32).toString('hex');

const signToken = (payload, opts = {}) =>
  jwt.sign(payload, DEV_FALLBACK, { expiresIn: opts.expiresIn || EXPIRES_IN });

const verifyToken = (token) => jwt.verify(token, DEV_FALLBACK);

module.exports = { signToken, verifyToken };
