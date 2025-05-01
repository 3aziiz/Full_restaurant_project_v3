const Booking = require('../models/bookingModel');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

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

    // Check if user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Validate required fields
    if (!date || !time || !guests || !phoneNumber) {
      return res.status(400).json({ message: 'Please provide all required booking information' });
    }

    // Create booking
    const booking = await Booking.create({
      // User information
      userId: req.user._id,
      userName: user.name,
      userAvatar: user.avatar || '',
      
      // Restaurant information
      restaurantId,
      restaurantName,
      
      // Booking details
      date,
      time,
      guests: Number(guests),
      phoneNumber,
      specialRequests: specialRequests || '',  
      
      // Pre-ordered items
      preOrders: preOrders || [],
      
      status: 'pending'
    });

    if (booking) {
      res.status(201).json(booking);
    } else {
      res.status(400).json({ message: 'Invalid booking data' });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get bookings for a manager
// GET /api/bookings
const getManagerBookings = async (req, res) => {
    try {
      // Get manager ID from request (from auth middleware)
      const managerId = req.user._id;
      
      // Get status filter if provided
      const { status } = req.query;
      
      // First, find all restaurants owned by this manager
      const restaurants = await Restaurant.find({ owner: managerId });
      
      if (!restaurants || restaurants.length === 0) {
        return res.status(200).json([]);
      }
      
      // Get all restaurant IDs owned by this manager
      const restaurantIds = restaurants.map(restaurant => restaurant._id);
      
      // Build query for bookings
      let query = { restaurantId: { $in: restaurantIds } };
      
      // Add status filter if provided
      if (status && status !== 'all') {
        query.status = status;
      }
      
      // Find bookings for these restaurants
      const bookings = await Booking.find(query)
        .sort({ date: -1, time: -1 }) // Sort by date and time, newest first
        .populate('restaurantId', 'name images') // Get restaurant info
        .populate('userId', 'name email profileImage'); // Get user info
      
      // Format the response to match the frontend expectations
      const formattedBookings = bookings.map(booking => {
        return {
          id: booking._id,
          customerName: booking.userId.name,
          contact: booking.userId.email,
          userAvatar: booking.userAvatar,
          restaurant: {
            id: booking.restaurantId._id,
            name: booking.restaurantId.name,
            image: booking.restaurantId.images[0] // First image as main restaurant image
          },
          date: booking.date,
          time: booking.time,
          guests: booking.guests,
          status: booking.status,
          notes: booking.specialRequests || '',
          preOrders :booking.preOrders,
          phoneNumber :booking.phoneNumber,
        };
      });
      
      res.status(200).json(formattedBookings);
    } catch (error) {
      console.error('Error fetching manager bookings:', error);
      res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
  };

 const  updateBookingStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const managerId = req.user._id;
      
      // Verify this booking belongs to one of the manager's restaurants
      const booking = await Booking.findById(id).populate('restaurantId');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Check if the restaurant belongs to this manager
      const restaurant = await Restaurant.findById(booking.restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      
      if (restaurant.owner.toString() !== managerId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
      
      // Update booking status
      booking.status = status;
      await booking.save();
      
      // If status is confirmed or cancelled, you might want to send an email notification
      // to the customer here
      
      res.status(200).json({ 
        message: `Booking status updated to ${status}`,
        booking: {
          id: booking._id,
          status: booking.status
        }
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ message: 'Failed to update booking status', error: error.message });
    }
  };



module.exports = {
  createBooking,
  getManagerBookings,
  updateBookingStatus,
};