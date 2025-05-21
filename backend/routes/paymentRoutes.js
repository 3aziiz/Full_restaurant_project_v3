// const express = require('express');
// const router = express.Router();
// const authMiddleware  = require('../middleware/authMiddleware');
// const {
//   payBooking,
//   paymentWebhook,
//   checkPaymentStatus,
//   verifyPayment,
// } = require('../controllers/paymentController');

// // Protected routes - requires authentication
// router.post('/booking', authMiddleware, payBooking);
// router.get('/status/:bookingId', authMiddleware, checkPaymentStatus);

// // Public routes - for Flouci webhook
// router.post('/webhook', paymentWebhook);
// router.post('/verify', verifyPayment);
// module.exports = router;




// In your paymentRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { payBooking, verifyPayment } = require('../controllers/paymentController');

// Payment routes
router.post('/booking', authMiddleware, payBooking);

// For payment verification - main route that expects paymentId in request body
router.post('/verify', (req, res) => {
  console.log('POST /verify route hit with body:', req.body);
  verifyPayment(req, res);
});

// Alternative route that accepts payment ID in URL params
// This can be useful for testing or webhook scenarios
router.get('/verify/:id', (req, res) => {
  console.log('GET /verify/:id route hit with params:', req.params);
  // Map URL param to expected request body format
  req.body = { 
    ...req.body,
    paymentId: req.params.id 
  };
  verifyPayment(req, res);
});

module.exports = router; // Fixed: Export the router object correctly