const { verifyToken } = require("../utils/jwt.util");
const prisma = require("../lib/prisma.client");

// Requires a valid Bearer token; attaches req.user = { id, role, email, name }
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Please log in to continue." });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "Your session is no longer valid." });
    }

    req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
}

// Optional Auth: Attaches req.user if token is present and valid, but does not block if missing.
async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (user) {
        req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
      }
    }
  } catch (err) {}
  next();
}

// Must be used after requireAuth
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "This action is limited to staff accounts." });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, optionalAuth };
