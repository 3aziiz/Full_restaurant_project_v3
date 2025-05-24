const express = require('express');
const router = express.Router();
const {
  createBooking,getManagerBookings,updateBookingStatus,getAllBookings,
  
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const requireManager = require('../middleware/requireManager');
// Create a new booking
router.post('/', authMiddleware, createBooking);

// // Get bookings for the logged-in user
router.get('/myBookings', authMiddleware, getManagerBookings);

router.get('/allbookings', authMiddleware, getAllBookings);

// // Update booking status
router.patch('/:id', authMiddleware,requireManager   ,updateBookingStatus);

module.exports = router;