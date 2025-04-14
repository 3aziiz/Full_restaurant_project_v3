const express = require('express');
const router = express.Router();
const isManager = require('../middleware/isManager');
const restaurantController = require('../controllers/restaurantController');
const upload = require('../middleware/multer'); // Make sure this is set up for Cloudinary

// PATCH route to update restaurant details with images
router.patch('/update', isManager, upload.array('restaurantImages'), restaurantController.updateRestaurant);

module.exports = router;
