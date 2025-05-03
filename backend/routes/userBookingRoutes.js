const express = require('express');
const router = express.Router();
const {
  getUserBookings,
  updateBooking,
  deleteBooking,
  processPayment
} = require('../controllers/userBookingController');
const authMiddleware = require('../middleware/authMiddleware');


// Get bookings for the logged-in user
router.get('/:id', authMiddleware, getUserBookings);


// Update booking
router.put('/:id', authMiddleware, updateBooking);

// Delete/cancel booking
router.delete('/:id', authMiddleware, deleteBooking);

// Process payment for booking
router.post('/:id/pay', authMiddleware, processPayment);

module.exports = router;