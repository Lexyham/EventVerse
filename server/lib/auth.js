const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'eventverse_jwt_secret_2026';
function signToken(payload) { return jwt.sign(payload, SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }); }
function verifyToken(token) { return jwt.verify(token, SECRET); }
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
  try { req.user = verifyToken(auth.slice(7)); next(); } catch { return res.status(401).json({ error: 'Invalid token' }); }
}
function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) { try { req.user = verifyToken(auth.slice(7)); } catch {} }
  next();
}
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (key === (process.env.ADMIN_SECRET || 'eventverse_admin_secret_2026')) return next();
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try { const p = verifyToken(auth.slice(7)); if (p.role === 'admin') return next(); } catch {}
  }
  return res.status(403).json({ error: 'Admin access required' });
}
module.exports = { signToken, verifyToken, requireAuth, optionalAuth, requireAdmin };
