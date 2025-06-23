const requireManager = (req, res, next) => {
    const allowedRoles = ['manager', 'admin'];
    
    // Check if the role is in req.user (from JWT token)
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
      return;
    }
    
    // Or check if it's in the request body (from FormData)
    if (req.body && allowedRoles.includes(req.body.userRole)) {
      req.user = {
        id: req.body.userId,
        role: req.body.userRole
      };
      next();
      return;
    }
    
    return res.status(403).json({ 
      message: 'Access denied: Manager or Admin access required'
    });
};

module.exports = requireManager;