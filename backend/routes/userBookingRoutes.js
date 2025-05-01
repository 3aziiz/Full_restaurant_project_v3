const express = require('express');
const router = express.Router();
const {
  getUserBookings,
  
  getBookingById,
  updateBooking,
  deleteBooking,
  processPayment
} = require('../controllers/userBookingController');
const authMiddleware = require('../middleware/authMiddleware');

// // Create a new booking
// router.post('/', authMiddleware, createBooking);

// Get bookings for the logged-in user
router.get('/myBookings', authMiddleware, getUserBookings);

// Get specific booking by ID
router.get('/:id', authMiddleware, getBookingById);

// Update booking
router.put('/:id', authMiddleware, updateBooking);

// Delete/cancel booking
router.delete('/:id', authMiddleware, deleteBooking);

// Process payment for booking
router.post('/:id/pay', authMiddleware, processPayment);

module.exports = router;