// controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

exports.uploadImages = async (req, res) => {
  try {
    const managerId = req.user.id;
    const updates = req.body;

    if (req.files && req.files.length > 0) {
      const uploadedImageUrls = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        const result = await cloudinary.uploader.upload(file.path);
        uploadedImageUrls.push(result.secure_url);

        fs.unlinkSync(file.path);
      }

      updates.restaurantImages = uploadedImageUrls;
    }

    const updated = await Restaurant.findOneAndUpdate(
      { manager: managerId },
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant updated successfully', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
