// const jwt = require('jsonwebtoken'); // Make sure to install jwt

// // Middleware to check if user is admin
// const isAdmin = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'No token provided, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key here
//     if (decoded.role !== 'admin') {  // Ensure the user is an admin
//       return res.status(403).json({ message: 'Access denied: Admins only' });
//     }
//     req.user = decoded; // You can add decoded user information here if needed
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// module.exports = isAdmin;

const jwt = require('jsonwebtoken'); // Make sure to install jwt

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key here
    if (decoded.role !== 'admin') {  // Ensure the user is an admin
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.user = decoded; // You can add decoded user information here if needed
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = isAdmin;