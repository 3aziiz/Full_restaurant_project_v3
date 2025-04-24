const express = require('express');
const router = express.Router();
const { createRestaurant,getAllRestaurants,getRestaurantById} = require('../controllers/managerController');


router.post('/createRestaurant', createRestaurant);
// Get all restaurants
router.get('/restaurants', getAllRestaurants);

// Get a restaurant by its ID
router.get('/restaurant/:id', getRestaurantById);

module.exports = router;