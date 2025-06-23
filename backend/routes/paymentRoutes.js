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