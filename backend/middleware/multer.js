const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

// 🟢 Storage for restaurant images
const restaurantStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurants',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

// 🟣 Storage for avatar images
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }], // square avatar
  },
});

// 🧾 Exports
const uploadRestaurant = multer({ storage: restaurantStorage });
const uploadAvatar = multer({ storage: avatarStorage });

module.exports = {
  uploadRestaurant,
  uploadAvatar,
};
