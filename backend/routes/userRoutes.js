// userRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile ,updateAvatar,updateName} = require('../controllers/userController'); // Adjust path as needed
const authMiddleware  = require('../middleware/authMiddleware'); // Adjust path as needed
const { uploadAvatar } = require('../middleware/multer');
// Protected route - requires authentication
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/updateName',authMiddleware ,updateName);
router.put('/avatar', authMiddleware, uploadAvatar.single('avatar'), updateAvatar); 
module.exports = router;