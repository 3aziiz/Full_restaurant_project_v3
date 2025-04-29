const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
// Import script
const createAdminUser = require('./utils/createAdmin');

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/auth');
const managerRequestRoutes = require('./routes/managerRequestRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes=require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));

// In your app.js or server.js
app.use(fileUpload({
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
}));

app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend Vite port
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware
app.use(express.json());

//admin routes
app.use('/api/admin', adminRoutes);


// Register Routes
app.use('/api/auth', authRoutes);


app.use('/api/manager-requests', managerRequestRoutes);


app.use('/api/restaurant', restaurantRoutes);


app.use('/api/users',userRoutes);

// manager routes
app.use('/api/manager',managerRoutes);

// // After all routes are defined
// console.log('All registered routes:');
// app._router.stack.forEach(r => {
//   if (r.route && r.route.path) {
//     console.log(`${Object.keys(r.route.methods).join(',')} ${r.route.path}`);
//   } else if (r.name === 'router') {
//     r.handle.stack.forEach(layer => {
//       if (layer.route) {
//         const methods = Object.keys(layer.route.methods).join(',');
//         console.log(`${methods} ${r.regexp} ${layer.route.path}`);
//       }
//     });
//   }
// });


// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    // Run admin creation function
    await createAdminUser(); 
    
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });
