const ManagerRequest = require('../models/ManagerRequest');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const cloudinary = require('../utils/cloudinary'); // Cloudinary configuration
const Restaurant = require('../models/Restaurant'); 

exports.createRequest = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      restaurantName, 
      description, 
      location, 
      phoneNumber, 
      nbTables, 
      menus
    } = req.body;

    // Check if the request already exists
    const existing = await ManagerRequest.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Request already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle the uploaded images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      // Loop through each file and upload to Cloudinary
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        // Upload the file to Cloudinary and retrieve the URL
        const uploadResult = await cloudinary.uploader.upload(file.path);
        imageUrls.push(uploadResult.secure_url); // Store the Cloudinary URL
      }
    }

    // Create the manager request
    const request = await ManagerRequest.create({
      fullName,
      email,
      password: hashedPassword,
      restaurantName,
      description,
      location,
      phoneNumber,
      nbTables,
      menus,
      images: imageUrls, // Save Cloudinary image URLs
    });

    res.status(201).json({ message: 'Request submitted successfully', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all requests (admin)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ManagerRequest.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Approve request (admin)
exports.approveRequest = async (req, res) => {
  try {
    const request = await ManagerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const existingUser = await User.findOne({ email: request.email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({
      name: request.fullName,
      email: request.email,
      password: request.password,
      role: 'manager',
    });
    await newUser.save(); // ✅ Triggers the hash middleware


     // Create a new Restaurant linked to this manager
     const newRestaurant = await Restaurant.create({
      restaurantName: request.restaurantName,
      description:request.description,
      location: request.location,
      phoneNumber: request.phoneNumber,
      nbTables: request.nbTables,
      menus: request.menus,
      manager: newUser._id, // Link the manager to the restaurant
      restaurantImages: request.images, // Use the image URLs provided
    });
    
    // Mark as approved
    request.status = 'approved';
    await request.save();
    await newRestaurant.save();

    res.status(200).json({ message: 'Manager approved , account and Restaurant  created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reject request (admin)
exports.rejectRequest = async (req, res) => {
  try {
    const request = await ManagerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};