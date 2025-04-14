const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user',
  },
  resetToken: {
    type: String,
  },
  resetTokenExpire: {
    type: Date,
  }
});

// Check if password is already hashed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const password = this.password;
  const isAlreadyHashed = /^\$2[aby]\$/.test(password); // Bcrypt hash starts with $2a$ / $2b$ / $2y$

  if (isAlreadyHashed) {
    return next(); // Don't hash again
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);