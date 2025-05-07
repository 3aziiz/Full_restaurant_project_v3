const Booking = require('../models/bookingModel');
const Restaurant = require('../models/Restaurant');

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });
    
    if (!bookings || bookings.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error: Failed to fetch bookings' });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Check if booking can be updated (only pending bookings can be updated)
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be updated' });
    }

    const {
      date,
      time,
      guests,
      phoneNumber,
      specialRequests,
      preOrders
    } = req.body;

    // Update booking fields
    booking.date = date || booking.date;
    booking.time = time || booking.time;
    booking.guests = guests || booking.guests;
    booking.phoneNumber = phoneNumber || booking.phoneNumber;
    booking.specialRequests = specialRequests || booking.specialRequests;
    booking.preOrders = preOrders || booking.preOrders;

    const updatedBooking = await booking.save();
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Failed to update booking' });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    // // Check if booking can be deleted (only pending bookings can be deleted)
    // if (booking.status !== 'pending') {
    //   return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
    // }

    await Booking.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: Failed to cancel booking' });
  }
};

// @desc    Process payment for a booking
// @route   POST /api/bookings/:id/pay
// @access  Private
const processPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to process payment for this booking' });
    }

    // Check if booking can be paid for (only approved bookings can be paid for)
    if (booking.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved bookings can be paid for' });
    }

    // Process payment (implementation would depend on your payment processor)
    const { paymentMethod, paymentDetails } = req.body;

    // Example payment processing logic
    booking.isPaid = true;
    booking.paidAt = Date.now();
    booking.paymentMethod = paymentMethod;
    booking.paymentResult = {
      id: paymentDetails.id,
      status: 'completed',
      update_time: Date.now(),
      email_address: paymentDetails.email
    };

    const updatedBooking = await booking.save();
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Failed to process payment' });
  }
};

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    // Only pending or confirmed bookings that haven't been paid can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ 
        message: 'Only pending or confirmed bookings can be cancelled' 
      });
    }

    // Check if booking has been paid
    if (booking.isPaid) {
      return res.status(400).json({ 
        message: 'Paid bookings cannot be cancelled. Please contact customer support.' 
      });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    booking.cancelledAt = Date.now();
    
    // Optionally, you can store cancellation reason if provided in the request
    if (req.body.cancellationReason) {
      booking.cancellationReason = req.body.cancellationReason;
    }

    const updatedBooking = await booking.save();
    
    // You might want to add notification logic here
    // e.g., notify restaurant about cancellation

    res.status(200).json({ 
      message: 'Booking cancelled successfully', 
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error: Failed to cancel booking' });
  }
};


module.exports = {
  getUserBookings,
  cancelBooking,
  updateBooking,
  deleteBooking,
  processPayment
};