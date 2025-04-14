const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId ,role}, process.env.JWT_SECRET, { expiresIn: '1h' });
};


// @desc Register a new user
// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create new user with role 'user' by default
    const newUser = await User.create({
      name,
      email,
      password,
      role: 'user', // Set default role as 'user'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token: generateToken(newUser._id,newUser.role), // Provide token for authentication
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials1' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials2' });
    const token =generateToken(user._id ,user.role);
    res.cookie("token",token ,{
      httpOnly:true,
      secure:true,
      maxAge:2*60*60*1000
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        
      },
      // token: generateToken(user._id ,user.role),
    });
  } catch (error) {
    console.error(' Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Change user password
// @route POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Find the authenticated user (from authMiddleware)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    // Update to new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(' Error in changePassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.logout = async (req, res) => {
  try {
    
    res.cookie("token","",{
      httpOnly:true,
      secure:true,
      
    });
    
    res.status(200).json({
      message: 'Logout successful',
      
    });
  } catch (error) {
    console.error(' Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      user.resetToken = token;
      user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();

      const resetLink = `http://localhost:5173/reset-password/new?token=${token}`;
      await sendEmail(user.email, "Reset Your Password", resetLink);

      res.status(200).json({ message: "Reset link sent to your email" });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong", error: err });
    }
  };


  exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || user.resetToken !== token || Date.now() > user.resetTokenExpire) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      user.password = newPassword; // make sure to hash this in your model
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      res.status(400).json({ message: "Invalid token", error: err });
    }
  };
