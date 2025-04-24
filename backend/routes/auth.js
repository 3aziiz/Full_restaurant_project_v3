const express = require('express');
const router = express.Router();
const { register, login, changePassword ,logout,forgotPassword,resetPassword} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');



// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/changePassword', authMiddleware, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post('/logout', logout);
module.exports = router;