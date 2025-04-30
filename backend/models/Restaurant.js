const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Review Schema embedded within Restaurant
const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String,
    default: '' // Default avatar URL or empty string
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Simplified Menu Item schema that matches form data
const MenuItemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String // URL to the image
  }]
});

// Restaurant Schema
const RestaurantSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Restaurant owner is required']
  },
  // Define location as an object with address
  location: {
    address: {
      type: String,
      required: true
    }
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  openingHours: {
    type: String,
    required: [true, 'Opening hours are required'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  images: [{
    type: String // URL to the image
  }],
  menuItems: [MenuItemSchema],
  reviews: [ReviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, { timestamps: true });

// Index for text-based search
RestaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text' });

module.exports = mongoose.model('Restaurant', RestaurantSchema);