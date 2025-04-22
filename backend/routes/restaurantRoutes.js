// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const isManager = require('../middleware/isManager');
const { uploadImages } = require('../controllers/restaurantController');
const { uploadRestaurant } = require('../middleware/multer');

router.post(
  '/restaurant/images',
  isManager,
  uploadRestaurant.array('images'),
  uploadImages
);

module.exports = router;
