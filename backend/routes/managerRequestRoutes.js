const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const controller = require('../controllers/managerRequestController');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary'); // This should be your configured cloudinary instance

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurant_requests',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  },
});

const upload = multer({ storage });

// ✅ Submit a manager request with image upload
router.post(
  '/createRequest',
  upload.array('images', 5), // Accept up to 5 images
  controller.createRequest
);

// 🔒 Admin routes
router.get('/', isAdmin, controller.getAllRequests);
router.patch('/:id/approve', isAdmin, controller.approveRequest);
router.patch('/:id/reject', isAdmin, controller.rejectRequest);

module.exports = router;













// // routes/managerRequestRoutes.js
// const express = require('express');
// const router = express.Router();
// const isAdmin = require('../middleware/isAdmin');
// const controller = require('../controllers/managerRequestController');

// // Submit a manager request (public)
// router.post('/createRequest', controller.createRequest);

// // Get all manager requests (admin only)
// router.get('/', isAdmin, controller.getAllRequests);

// // Approve
// router.patch('/:id/approve', isAdmin, controller.approveRequest);

// // Reject
// router.patch('/:id/reject', isAdmin, controller.rejectRequest);

// module.exports = router;
