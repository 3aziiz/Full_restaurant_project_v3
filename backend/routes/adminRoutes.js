const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/users', authMiddleware, requireAdmin, getAllUsers);
router.delete('/users/:id', authMiddleware, requireAdmin, deleteUser);

module.exports = router;
