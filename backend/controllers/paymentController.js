// controllers/paymentController.js
const axios = require('axios');
const Booking = require('../models/bookingModel');

const APP_TOKEN = process.env.FLOUCI_APP_TOKEN;
const APP_SECRET = process.env.FLOUCI_APP_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Process booking payment
 * @route POST /api/payments/booking
 * @access Private
 */
exports.payBooking = async (req, res) => {
  console.log('=== PAYMENT PROCESSING START ===');
  
  try {
    // Log the incoming request
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Environment variables check:');
    console.log('- APP_TOKEN exists:', !!APP_TOKEN);
    console.log('- APP_SECRET exists:', !!APP_SECRET);
    console.log('- FRONTEND_URL:', FRONTEND_URL);
    
    const { bookingId } = req.body;
    
    if (!bookingId) {
      console.log('ERROR: Missing bookingId in request body');
      return res.status(400).json({ 
        success: false, 
        message: 'Booking ID is required' 
      });
    }
    
    console.log('Looking for booking with ID:', bookingId);
    
    // Find booking
    let booking;
    try {
      booking = await Booking.findById(bookingId);
      console.log('Booking found?', !!booking);
      
      // Log the complete booking structure keys to aid debugging
      if (booking) {
        console.log('Booking fields available:', Object.keys(booking._doc || booking));
      }
    } catch (dbError) {
      console.log('Database error when finding booking:', dbError.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error when retrieving booking',
        error: dbError.message
      });
    }
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    // Check if booking is already paid
    if (booking.paymentStatus === 'PAID' || booking.paymentStatus === 'paid' || booking.paymentStatus === 'success') {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking already paid' 
      });
    }
    
    // Calculate total price - comprehensive approach
    let total = 0;
    
    // Log all possible price-related fields for debugging
    console.log('Price fields check:', {
      totalPrice: booking.totalPrice,
      price: booking.price,
      bookingFee: booking.bookingFee,
      hasPreOrders: booking.preOrders && booking.preOrders.length > 0
    });
    
    // Method 1: Check for preOrders and calculate their total
    if (booking.preOrders && booking.preOrders.length > 0) {
      const preOrderTotal = booking.preOrders.reduce((sum, item) => {
        // Safely handle possible undefined values
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return sum + (price * quantity);
      }, 0);
      
      console.log('PreOrder total calculated:', preOrderTotal);
      total += preOrderTotal;
    }
    
    // Method 2: Add booking fee if present
    if (booking.bookingFee && !isNaN(parseFloat(booking.bookingFee))) {
      const fee = parseFloat(booking.bookingFee);
      console.log('Adding booking fee:', fee);
      total += fee;
    }
    
    // Method 3: Check for direct totalPrice field
    if (total === 0 && booking.totalPrice && !isNaN(parseFloat(booking.totalPrice))) {
      total = parseFloat(booking.totalPrice);
      console.log('Using totalPrice field:', total);
    }
    
    // Method 4: Check for direct price field
    if (total === 0 && booking.price && !isNaN(parseFloat(booking.price))) {
      total = parseFloat(booking.price);
      console.log('Using price field:', total);
    }
    
    // Method 5: If we still don't have a valid price, check any other possible fields
    if (total === 0) {
      // Check for services array with prices
      if (booking.services && Array.isArray(booking.services) && booking.services.length > 0) {
        const servicesTotal = booking.services.reduce((sum, service) => {
          return sum + (parseFloat(service.price) || 0);
        }, 0);
        
        if (servicesTotal > 0) {
          console.log('Using services total:', servicesTotal);
          total = servicesTotal;
        }
      }
      
      // Check for amount field
      if (total === 0 && booking.amount && !isNaN(parseFloat(booking.amount))) {
        total = parseFloat(booking.amount);
        console.log('Using amount field:', total);
      }
    }
    
    // Safety check for invalid price
    if (total <= 0) {
      console.log('ERROR: Could not determine a valid price for this booking');
      
      // Return detailed error with all the price-related fields we checked
      return res.status(400).json({ 
        success: false, 
        message: 'Could not determine a valid price for this booking', 
        details: {
          bookingId: booking._id,
          priceFields: {
            totalPrice: booking.totalPrice,
            price: booking.price,
            bookingFee: booking.bookingFee,
            preOrders: booking.preOrders,
            services: booking.services,
            amount: booking.amount
          }
        }
      });
    }
    
    // Convert to millimes with additional logging
    const amountInMillimes = Math.round(total * 1000).toString();
    console.log('Final price:', total);
    console.log('Amount in millimes:', amountInMillimes);
    
    // Prepare payment request with redirect links that will first go to frontend
    // The frontend will then call our verification endpoint
    // This makes it easier to integrate with the existing frontend code
    const paymentData = {
      app_token: APP_TOKEN,
      app_secret: APP_SECRET,
      amount: amountInMillimes,
      accept_card: "true",
      session_timeout_secs: 1200,
      success_link: `${FRONTEND_URL}/booking/success?payment=return&status=success&bookingId=${bookingId}`,
      fail_link: `${FRONTEND_URL}/booking/failed?payment=return&status=fail&bookingId=${bookingId}`,
      developer_tracking_id: bookingId.toString()
    };
    
    // Log the request that will be sent to Flouci (with sensitive data redacted)
    console.log('Flouci API request data:', {
      ...paymentData,
      app_token: '[REDACTED]',
      app_secret: '[REDACTED]'
    });
    
    try {
      // Call Flouci API to generate payment
      console.log('Sending request to Flouci API...');
      const response = await axios.post(
        'https://developers.flouci.com/api/generate_payment', 
        paymentData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log('Flouci API response status:', response.status);
      console.log('Flouci API response data:', response.data);
      
      if (response.data && response.data.result) {
        // Check if the API returned a valid payment URL
        if (!response.data.result.link) {
          console.log('ERROR: No payment link in response');
          return res.status(400).json({
            success: false,
            message: 'Invalid response from payment provider'
          });
        }
        
        // Update booking with payment ID and the calculated price
        const paymentId = response.data.result.payment_id;
        console.log('Payment ID:', paymentId);
        
        try {
          booking.paymentId = paymentId;
          
          // Also update the booking with the calculated price if not already set
          if (!booking.totalPrice) {
            booking.totalPrice = total;
          }
          
          await booking.save();
          console.log('Booking updated with payment ID and price');
        } catch (saveError) {
          console.log('Error saving booking:', saveError.message);
          // Continue anyway since we have the payment URL
        }
        
        // Return payment link to client
        console.log('Returning success response to client');
        return res.status(200).json({
          success: true,
          paymentUrl: response.data.result.link,
          paymentId: paymentId
        });
      } else {
        console.log('ERROR: Invalid response structure from Flouci');
        return res.status(400).json({ 
          success: false, 
          message: 'Failed to generate payment link',
          details: 'Invalid response structure from payment provider'
        });
      }
    } catch (apiError) {
      console.log('Flouci API error:', apiError.message);
      
      // Log detailed error response if available
      if (apiError.response) {
        console.log('Error status:', apiError.response.status);
        console.log('Error headers:', apiError.response.headers);
        console.log('Error data:', apiError.response.data);
      }
      
      // Try to extract the most useful error message
      let errorMessage = 'Error connecting to payment provider';
      if (apiError.response && apiError.response.data) {
        if (typeof apiError.response.data === 'string') {
          errorMessage = apiError.response.data;
        } else if (apiError.response.data.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.response.data.error) {
          errorMessage = apiError.response.data.error;
        }
      }
      
      return res.status(400).json({
        success: false,
        message: 'Error generating payment',
        error: errorMessage,
        details: apiError.message
      });
    }
  } catch (error) {
    console.log('Unexpected error in payment controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Unexpected error processing payment',
      error: error.message
    });
  } finally {
    console.log('=== PAYMENT PROCESSING END ===');
  }
};

/**
 * Verify payment status
 * @route POST /api/payments/verify
 * @access Public
 */
exports.verifyPayment = async (req, res) => {
  // Log immediately before any potential errors
  console.log('=== PAYMENT VERIFICATION START ===');
  console.log('Request path:', req.path);
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    // Extract paymentId from request body
    const { paymentId } = req.body;
    
    if (!paymentId) {
      console.log('ERROR: Missing paymentId in request');
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }
    
    console.log('Verifying payment with ID:', paymentId);
    console.log('Verification endpoint:', `https://developers.flouci.com/api/verify_payment/${paymentId}`);
    
    try {
      // Verify payment with Flouci
      const response = await axios.get(
        `https://developers.flouci.com/api/verify_payment/${paymentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'apppublic': APP_TOKEN,
            'appsecret': APP_SECRET
          }
        }
      );
      
      console.log('Verification API response status:', response.status);
      console.log('Verification API response data:', JSON.stringify(response.data, null, 2));
      
      if (!response.data || !response.data.success) {
        console.log('ERROR: Payment verification failed - API returned failure');
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed',
          details: response.data
        });
      }
      
      const paymentStatus = response.data.result.status;
      const bookingId = response.data.result.developer_tracking_id;
      
      console.log('Payment status from Flouci:', paymentStatus);
      console.log('Booking ID from tracking ID:', bookingId);
      
      // Find booking
      let booking;
      try {
        booking = await Booking.findById(bookingId);
        console.log('Booking found?', !!booking);
      } catch (dbError) {
        console.log('Database error when finding booking:', dbError.message);
        return res.status(500).json({
          success: false,
          message: 'Database error when retrieving booking',
          error: dbError.message
        });
      }
      
      if (!booking) {
        console.log('ERROR: Booking not found with ID:', bookingId);
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      
      // Make a copy of the original booking status for comparison
      const originalPaymentStatus = booking.paymentStatus;
      
      // Map Flouci status to our schema status
      let mappedStatus;
      if (paymentStatus === 'SUCCESS' || paymentStatus === 'success') {
        mappedStatus = 'success';
      } else {
        mappedStatus = 'failed';
      }
      
      console.log('Mapped payment status:', mappedStatus);
      
      try {
        booking.paymentStatus = mappedStatus;
        booking.paymentType = response.data.result.type || 'unknown';
        
        // Update booking status if payment is successful
        if (mappedStatus === 'success' && booking.status === 'pending') {
          booking.status = 'confirmed';
          console.log('Updated booking status to confirmed');
        }
        
        await booking.save();
        console.log('Booking payment status updated successfully');
        console.log('Original payment status:', originalPaymentStatus);
        console.log('New payment status:', booking.paymentStatus);
      } catch (saveError) {
        console.log('Error saving booking:', saveError.message);
        return res.status(500).json({
          success: false,
          message: 'Error updating booking payment status',
          error: saveError.message
        });
      }
      
      console.log('=== PAYMENT VERIFICATION SUCCESS ===');
      return res.status(200).json({
        success: true,
        paymentStatus: booking.paymentStatus,
        paymentType: booking.paymentType,
        booking: booking
      });
    } catch (apiError) {
      console.log('Flouci verification API error:', apiError.message);
      
      // Log detailed error response if available
      if (apiError.response) {
        console.log('Error status:', apiError.response.status);
        console.log('Error headers:', JSON.stringify(apiError.response.headers));
        console.log('Error data:', JSON.stringify(apiError.response.data));
      }
      
      return res.status(400).json({
        success: false,
        message: 'Error verifying payment',
        error: apiError.message,
        details: apiError.response?.data || 'No detailed error information available'
      });
    }
  } catch (error) {
    console.log('Unexpected error in verification controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Unexpected error verifying payment',
      error: error.message
    });
  } finally {
    console.log('=== PAYMENT VERIFICATION END ===');
  }
};