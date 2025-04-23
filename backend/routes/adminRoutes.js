const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser,getAllRequests,approveRequest,rejectRequest } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/users', authMiddleware, requireAdmin, getAllUsers);
router.delete('/users/:id', authMiddleware, requireAdmin, deleteUser);
router.get('/requests', authMiddleware, requireAdmin, getAllRequests);
router.patch('/requests/approve/:id', authMiddleware, requireAdmin, approveRequest);
router.delete('/requests/delete/:id', authMiddleware, requireAdmin, rejectRequest);


module.exports = router;
