const express = require('express');
const router = express.Router();
const {
  getUserBookings,
  updateBooking,
  deleteBooking,
  processPayment,
  cancelBooking,
} = require('../controllers/userBookingController');
const authMiddleware = require('../middleware/authMiddleware');


// Get bookings for the logged-in user
router.get('/:id', authMiddleware, getUserBookings);

// Update booking
router.put('/:id', authMiddleware, updateBooking);

// Delete/cancel booking
router.delete('/:id', authMiddleware, deleteBooking);


// cancel booking
router.patch('/:id', authMiddleware, cancelBooking);


// Process payment for booking
router.post('/:id/pay', authMiddleware, processPayment);

module.exports = router;