const express = require('express');
const router = express.Router();
const { createRestaurant,getAllRestaurants,getRestaurantById,deleteRestaurant } = require('../controllers/managerController');
const authMiddleware = require('../middleware/authMiddleware');
const requireManager = require('../middleware/requireManager');

router.post('/createRestaurant', requireManager,authMiddleware,createRestaurant);
// Get all restaurants for users 
router.get('/restaurants', getAllRestaurants);
router.get('/restaurant/:id', getRestaurantById);
// Get a restaurant by its ID for users
router.delete('/restaurant/:id', authMiddleware,requireManager, deleteRestaurant);



module.exports = router;