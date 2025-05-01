const Booking = require('../models/bookingModel');
const Restaurant = require('../models/Restaurant');

// @desc    Get logged in user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Failed to fetch bookings' });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      restaurantId,
      restaurantName,
      date,
      time,
      guests,
      phoneNumber,
      specialRequests,
      preOrders
    } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      restaurantId,
      restaurantName,
      date,
      time,
      guests,
      phoneNumber,
      specialRequests,
      preOrders,
      status: 'pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Failed to create booking' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged in user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this booking' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Failed to fetch booking' });
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

    // Check if booking can be deleted (only pending bookings can be deleted)
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
    }

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

module.exports = {
  getUserBookings,
  
  getBookingById,
  updateBooking,
  deleteBooking,
  processPayment
};