const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const createAdminUser = require('./utils/createAdmin'); // Import script
const managerRequestRoutes = require('./routes/managerRequestRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend Vite port
  credentials: true,allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware
app.use(express.json());

// Register Routes
app.use('/api/auth', authRoutes);



app.use('/api/manager-requests', managerRequestRoutes);


const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurant', restaurantRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    // Run admin creation function
    await createAdminUser(); 

const managerRequestRoutes = require('./routes/managerRequestRoutes');
app.use('/api/manager-requests', managerRequestRoutes);
    

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });
