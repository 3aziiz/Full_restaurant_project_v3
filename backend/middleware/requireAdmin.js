const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // user is admin, allow through
    } else {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
  };
  
  module.exports = requireAdmin;
  