const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
// Import admin script
const createAdminUser = require('./utils/createAdmin');

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/auth');
const managerRequestRoutes = require('./routes/managerRequestRoutes');

const userRoutes=require('./routes/userRoutes');
const managerRoutes = require('./routes/managerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userBookingRoutes = require ('./routes/userBookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));


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

// create manager-requests
app.use('/api/manager-requests', managerRequestRoutes);

//user routes
app.use('/api/users',userRoutes);

// manager routes
app.use('/api/manager',managerRoutes);

//bookingRoutes
app.use('/api/bookings', bookingRoutes);


//userBookingRoutes
app.use('/api/userBooking',userBookingRoutes);

// payment routes
app.use('/api/payments', paymentRoutes);




// Connection to MongoDB 
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
