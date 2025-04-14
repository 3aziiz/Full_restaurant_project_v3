// controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');
const cloudinary = require('../utils/cloudinary'); // Make sure this is set up
const fs = require('fs'); // Optional: to delete local files after upload

exports.updateRestaurant = async (req, res) => {
  try {
    const managerId = req.user.id;
    const updates = req.body;

    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      const uploadedImageUrls = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImageUrls.push(result.secure_url);

        // Optional: delete local file
        fs.unlinkSync(file.path);
      }

      // Replace existing images (you can also merge instead if desired)
      updates.restaurantImages = uploadedImageUrls;
    }

    // Find and update the restaurant
    const updated = await Restaurant.findOneAndUpdate(
      { manager: managerId },
      updates,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Restaurant not found' });

    res.status(200).json({ message: 'Restaurant updated successfully', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
