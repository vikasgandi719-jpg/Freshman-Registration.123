const { verifyToken } = require('../config/jwt');

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    // Admin tokens are minted only by adminController.adminLogin, which
    // always sets type:'admin' — checking this (instead of matching
    // specific role strings) means any real admin role from the DB works,
    // not just a hardcoded 'admin'/'Super Admin' pair.
    if (decoded.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = adminAuth;
