export const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const roles = req.user.roles || [];
  if (roles.includes(role) || req.user.activeRole === role) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Insufficient role" });
};

export const requireAnyRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const roles = req.user.roles || [];
  const match = allowedRoles.some((r) => roles.includes(r) || req.user.activeRole === r);
  if (match) return next();
  return res.status(403).json({ message: "Forbidden: Insufficient role" });
};
