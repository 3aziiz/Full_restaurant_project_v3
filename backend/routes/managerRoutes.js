const express = require('express');
const router = express.Router();
const { createRestaurant} = require('../controllers/managerController');


router.post('/createRestaurant', createRestaurant);

module.exports = router;