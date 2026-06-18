const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superAdmin")) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "superAdmin") {
    next();
  } else {
    res.status(403).json({ message: "Super Admin access only" });
  }
};

module.exports = { adminOnly, superAdminOnly };