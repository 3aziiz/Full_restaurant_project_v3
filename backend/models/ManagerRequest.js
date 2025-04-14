const mongoose = require('mongoose');

const managerRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  restaurantName: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true }, // New field for location
  phoneNumber: { type: String, required: true }, // New field for phone number
  nbTables: { type: Number, required: true }, // New field for number of tables
  menus: { type: String, required: true }, // New field for menus
  images: [String], // Cloudinary URLs or local paths
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('ManagerRequest', managerRequestSchema);










// const mongoose = require('mongoose');

// const managerRequestSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   restaurantName: { type: String, required: true },
//   description: { type: String },
//   images: [String], // Cloudinary URLs or local paths
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('ManagerRequest', managerRequestSchema);
