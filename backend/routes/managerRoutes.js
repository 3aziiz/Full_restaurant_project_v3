const express = require('express');
const router = express.Router();
const { createRestaurant,getAllRestaurants,getRestaurantById} = require('../controllers/managerController');
const authMiddleware = require('../middleware/authMiddleware');
const requireManager = require('../middleware/requireManager');

router.post('/createRestaurant', requireManager,authMiddleware,createRestaurant);
// Get all restaurants for users 
router.get('/restaurants', getAllRestaurants);

// Get a restaurant by its ID for users
router.get('/restaurant/:id', getRestaurantById);



module.exports = router;