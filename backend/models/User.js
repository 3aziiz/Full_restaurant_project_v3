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
  },
  avatar: {
    type: String,
    default: '', 
  },
  
 
  birthday: {
    type: Date,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true; // Allow null/undefined
        return value <= new Date(); // Birthday cannot be in the future
      },
      message: 'Birthday cannot be in the future'
    }
  },
  phoneNumber: {
    type: String,
    default: null,
    unique: true,
    sparse: true, // Allows multiple null values while maintaining uniqueness for non-null values
    validate: {
      validator: function(value) {
        if (!value) return true; // Allow null/undefined
        // Basic phone number validation (7-15 digits, optional + for country code)
        const phoneRegex = /^[\+]?[1-9][\d]{6,14}$/;
        return phoneRegex.test(value);
      },
      message: 'Please provide a valid phone number (7-15 digits, optional + for country code)'
    }
  },
  
  // Rewards system
  rewards: {
    freeBookings: {
      type: Number,
      default: 0,
      min: 0
    },
    unlimitedPreorders: {
      active: {
        type: Boolean,
        default: false
      },
      expiresAt: {
        type: Date,
        default: null
      }
    }
  },
  
  // Track reward usage history
  rewardHistory: [{
    type: {
      type: String,
      enum: ['FREE_BOOKING', 'UNLIMITED_PREORDERS'],
      required: true
    },
    wonAt: {
      type: Date,
      default: Date.now
    },
    usedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'used', 'expired'],
      default: 'active'
    },
    expiresAt: {
      type: Date,
      default: function() {
        // Free bookings expire after 90 days, unlimited preorders after 30 days
        const days = this.type === 'FREE_BOOKING' ? 90 : 30;
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      }
    }
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
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

// Method to add a reward when user wins spin wheel
userSchema.methods.addReward = function(rewardType) {
  if (rewardType === 'FREE_BOOKING') {
    this.rewards.freeBookings += 1;
  } else if (rewardType === 'UNLIMITED_PREORDERS') {
    this.rewards.unlimitedPreorders.active = true;
    this.rewards.unlimitedPreorders.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  // Add to history
  this.rewardHistory.push({
    type: rewardType,
    wonAt: new Date(),
    status: 'active'
  });

  return this.save();
};

// Method to use free booking reward
userSchema.methods.useFreeBooking = function() {
  if (this.rewards.freeBookings > 0) {
    this.rewards.freeBookings -= 1;
    
    // Mark the oldest active free booking as used
    const activeReward = this.rewardHistory.find(r => 
      r.type === 'FREE_BOOKING' && r.status === 'active'
    );
    
    if (activeReward) {
      activeReward.status = 'used';
      activeReward.usedAt = new Date();
    }
    
    return this.save().then(() => true);
  }
  return Promise.resolve(false);
};

// Method to check if unlimited preorders is active
userSchema.methods.hasUnlimitedPreorders = function() {
  return this.rewards.unlimitedPreorders.active && 
         this.rewards.unlimitedPreorders.expiresAt > new Date();
};

// Method to get available rewards summary
userSchema.methods.getAvailableRewards = function() {
  return {
    freeBookings: this.rewards.freeBookings,
    unlimitedPreorders: this.hasUnlimitedPreorders(),
    unlimitedPreordersExpiresAt: this.rewards.unlimitedPreorders.expiresAt
  };
};

// Method to calculate user's age (useful for birthday-related features)
userSchema.methods.getAge = function() {
  if (!this.birthday) return null;
  
  const today = new Date();
  const birthDate = new Date(this.birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Method to check if today is user's birthday
userSchema.methods.isBirthdayToday = function() {
  if (!this.birthday) return false;
  
  const today = new Date();
  const birthDate = new Date(this.birthday);
  
  return today.getMonth() === birthDate.getMonth() && 
         today.getDate() === birthDate.getDate();
};

// Static method to clean up expired rewards
userSchema.statics.cleanupExpiredRewards = async function() {
  const now = new Date();
  
  // Update expired reward history entries
  await this.updateMany(
    { 'rewardHistory.expiresAt': { $lt: now }, 'rewardHistory.status': 'active' },
    { $set: { 'rewardHistory.$.status': 'expired' } }
  );
  
  // Deactivate expired unlimited preorders
  await this.updateMany(
    { 'rewards.unlimitedPreorders.expiresAt': { $lt: now } },
    { 
      $set: { 
        'rewards.unlimitedPreorders.active': false,
        'rewards.unlimitedPreorders.expiresAt': null
      }
    }
  );
  
  return true;
};

// Static method to find users with birthdays today (useful for birthday promotions)
userSchema.statics.findBirthdayUsers = async function() {
  const today = new Date();
  const month = today.getMonth() + 1; // MongoDB months are 1-12
  const day = today.getDate();
  
  return this.find({
    $expr: {
      $and: [
        { $eq: [{ $month: '$birthday' }, month] },
        { $eq: [{ $dayOfMonth: '$birthday' }, day] }
      ]
    }
  });
};

module.exports = mongoose.model('User', userSchema);