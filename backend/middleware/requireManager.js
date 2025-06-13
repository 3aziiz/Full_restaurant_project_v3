// const requireManager = (req, res, next) => {
//     // Check if the role is in req.user (from JWT token)
//     if (req.user && req.user.role === 'manager' ||req.user.role === 'admin' ) {
//       next();
//       return;
//     }
    
//     // Or check if it's in the request body (from FormData)
//     if (req.body && req.body.userRole === 'manager') {
//       // Optionally set req.user for downstream use
//       req.user = {
//         id: req.body.userId,
//         role: req.body.userRole
//       };
//       next();
//       return;
//     }
    
//     // If we get here, the user doesn't have manager role
//     return res.status(403).json({ 
//       message: 'Access denied: Manager only'
//     });
//   };
  
// module.exports = requireManager;


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