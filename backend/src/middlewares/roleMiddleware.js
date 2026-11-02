export const roleMiddleware = (requiredRole = 'admin') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication required.'
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires ${requiredRole} privileges.`
      });
    }

    next();
  };
};

export const requireAdmin = roleMiddleware('admin');
