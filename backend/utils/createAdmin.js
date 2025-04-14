
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
      console.log(' Admin already exists');
      return;
    }

   
    // Create admin user
    const admin = new User({
      name: 'AdminUser',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    await admin.save();
    console.log(' Admin user created successfully');

  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

module.exports = createAdmin;
