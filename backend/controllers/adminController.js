const User = require('../models/User');
const ManagerRequest = require('../models/ManagerRequest');
const sendEmail = require('../utils/sendEmail');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};


// Get all manager-requests (admin)
const  getAllRequests = async (req, res) => {
  try {
    const requests = await ManagerRequest.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// approve mangers
const approveRequest = async (req, res) => {
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
    await newUser.save();

    request.status = 'approved';
    await request.save();

    const subject = 'Your Manager Request Has Been Approved';
    const html = `
      <h2>Congratulations ${request.fullName}!</h2>
      <p>Your manager request has been <strong>approved</strong>.</p>
      <p>You can now <a href="http://localhost:5173">log in</a> and manage your restaurant.</p>
    `;

    // ✅ Call like in forgotPassword
    await sendEmail(request.email, subject, html);

    res.status(200).json({ message: 'Manager approved, account created, and email sent' });
  } catch (err) {
    console.error("🔥 Email sending failed:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// reject request (delete from DB)
const rejectRequest = async (req, res) => {
  try {
    const request = await ManagerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await ManagerRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Request rejected and deleted from database' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



module.exports = {
  getAllUsers,
  deleteUser,
  getAllRequests,
  approveRequest,
  rejectRequest,
};
