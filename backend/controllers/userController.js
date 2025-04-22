// // userController.js without express-async-handler
// const User = require('../models/User'); // Adjust path as needed

// // @desc    Get user profile
// // @route   GET /api/users/profile
// // @access  Private
// const getProfile = async (req, res) => {
//   try {
//     // req.user should be available from your auth middleware
//     const user = await User.findById(req.user.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       avatar: user.avatar,
//       // Add any other fields
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// };

// const updateAvatar = async (req, res) => {
//     try {
//       const user = await User.findById(req.user.id);
  
//       if (!user) return res.status(404).json({ message: 'User not found' });
  
//       user.avatar = req.body.avatar; // Cloudinary image URL
//       await user.save();
  
//       res.status(200).json({ avatar: user.avatar });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error: ' + error.message });
//     }
//   };


// module.exports = {
//   getProfile,
//   updateAvatar,
// };

// userController.js
const User = require('../models/User'); // Adjust path as needed

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // req.user should be available from your auth middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
      // Add any other fields
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
  
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    user.avatar = req.body.avatar; // Cloudinary image URL or base64
    await user.save();
  
    res.status(200).json({ avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update user profile (name)
// @route   PUT /api/users/profile
// @access  Private
const updateName = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update only the fields that are provided in the request  
    if (req.body.name) {
      // Validate name
      if (req.body.name.trim().length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters long' });
      }
      user.name = req.body.name;
    }
    
    // Save the updated user
    await user.save();
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = {
  getProfile,
  updateAvatar,
  updateName,
};