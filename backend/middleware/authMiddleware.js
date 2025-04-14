// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// // Middleware to verify JWT
// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Extract token

//   if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user to request object
//     next();
//   } catch (error) {
//     console.error('JWT Verification Error:', error);
//     res.status(401).json({ message: 'Unauthorized - Invalid token' });
//   }
// };

// module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User'); // Add this import
dotenv.config();

// Middleware to verify JWT and attach user to request
const authMiddleware = async (req, res, next) => {
  console.log(req.headers.authorization);
  // const token = req.headers.authorization?.split(' ')[1]; // Extract token
  const token = req.cookies.token;
  console.log("token",token);
  if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the complete user object from database
    const user = await User.findById(decoded.id || decoded._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.user = user; // Attach complete user to request object
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;