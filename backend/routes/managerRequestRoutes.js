const express = require('express');
const router = express.Router();
const controller = require('../controllers/managerRequestController');




// ✅ Submit a manager request with image upload
router.post('/createRequest',controller.createRequest);


module.exports = router;












