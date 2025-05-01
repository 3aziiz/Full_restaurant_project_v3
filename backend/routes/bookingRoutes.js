const express = require('express');
const router = express.Router();
const {
  createBooking,getManagerBookings,updateBookingStatus,
  
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new booking
router.post('/', authMiddleware, createBooking);

// // Get bookings for the logged-in user
router.get('/myBookings', authMiddleware, getManagerBookings);



// // Update booking status
router.patch('/:id', authMiddleware, updateBookingStatus);

module.exports = router;