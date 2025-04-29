// const User = require('../models/User'); // Adjust path as needed
// const Restaurant = require('../models/Restaurant');
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
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt
//       // Add any other fields
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// };

// // @desc    Update user avatar
// // @route   PUT /api/users/avatar
// // @access  Private
// const updateAvatar = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
  
//     if (!user) return res.status(404).json({ message: 'User not found' });
  
//     user.avatar = req.body.avatar; // Cloudinary image URL or base64
//     await user.save();
  
//     res.status(200).json({ avatar: user.avatar });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// };

// // @desc    Update user profile (name)
// // @route   PUT /api/users/profile
// // @access  Private
// const updateName = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     // Update only the fields that are provided in the request  
//     if (req.body.name) {
//       // Validate name
//       if (req.body.name.trim().length < 2) {
//         return res.status(400).json({ message: 'Name must be at least 2 characters long' });
//       }
//       user.name = req.body.name;
//     }
    
//     // Save the updated user
//     await user.save();
    
//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       avatar: user.avatar,
//       updatedAt: user.updatedAt
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// };

// //reviews
// const addReview = async (req, res) => {
//   try {
//     const { restaurantId } = req.params;
//     const { rating, comment } = req.body;
    
//     // Validate input
//     if (!rating || !comment) {
//       return res.status(400).json({ message: 'Rating and comment are required' });
//     }
    
//     // Check if restaurant exists
//     const restaurant = await Restaurant.findById(restaurantId);
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }
    
//     // Check if user already reviewed this restaurant
//     const existingReviewIndex = restaurant.reviews.findIndex(
//       review => review.user.toString() === req.user._id.toString()
//     );
    
//     if (existingReviewIndex !== -1) {
//       // Update existing review
//       restaurant.reviews[existingReviewIndex].rating = rating;
//       restaurant.reviews[existingReviewIndex].comment = comment;
//       restaurant.reviews[existingReviewIndex].date = new Date();
//     } else {
//       // Create new review
//       restaurant.reviews.push({
//         user: req.user._id,
//         rating,
//         comment,
//         date: new Date()
//       });
//     }
    
//     // Update restaurant rating (average of all reviews)
//     if (restaurant.reviews.length > 0) {
//       const totalRating = restaurant.reviews.reduce((sum, review) => sum + review.rating, 0);
//       restaurant.rating = (totalRating / restaurant.reviews.length).toFixed(1);
//     }
    
//     await restaurant.save();
    
//     // Populate user details for the review we just added
//     await Restaurant.populate(restaurant, {
//       path: 'reviews.user',
//       select: 'name avatar'
//     });
    
//     res.status(200).json({
//       message: existingReviewIndex !== -1 ? 'Review updated successfully' : 'Review added successfully',
//       reviews: restaurant.reviews,
//       rating: restaurant.rating
//     });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// };

// // @desc    Get all reviews for a restaurant
// // @route   GET /api/restaurants/:restaurantId/reviews
// // @access  Public
// const getReviews = async (req, res) => {
//   try {
//     const { restaurantId } = req.params;
    
//     const restaurant = await Restaurant.findById(restaurantId)
//       .select('reviews rating')
//       .populate('reviews.user', 'name avatar');
    
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }
    
//     res.status(200).json({
//       reviews: restaurant.reviews,
//       rating: restaurant.rating
//     });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// };

// // @desc    Delete a review
// // @route   DELETE /api/restaurants/:restaurantId/reviews/:reviewId
// // @access  Private
// const deleteReview = async (req, res) => {
//   try {
//     const { restaurantId, reviewId } = req.params;
    
//     const restaurant = await Restaurant.findById(restaurantId);
    
//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }
    
//     // Find the review by ID
//     const reviewIndex = restaurant.reviews.findIndex(
//       review => review._id.toString() === reviewId
//     );
    
//     if (reviewIndex === -1) {
//       return res.status(404).json({ message: 'Review not found' });
//     }
    
//     // Check if user is the author of the review
//     if (restaurant.reviews[reviewIndex].user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized to delete this review' });
//     }
    
//     // Remove the review
//     restaurant.reviews.splice(reviewIndex, 1);
    
//     // Recalculate rating
//     if (restaurant.reviews.length > 0) {
//       const totalRating = restaurant.reviews.reduce((sum, review) => sum + review.rating, 0);
//       restaurant.rating = (totalRating / restaurant.reviews.length).toFixed(1);
//     } else {
//       restaurant.rating = 0;
//     }
    
//     await restaurant.save();
    
//     res.status(200).json({
//       message: 'Review deleted successfully',
//       reviews: restaurant.reviews,
//       rating: restaurant.rating
//     });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// };

// module.exports = {
//   getProfile,
//   updateAvatar,
//   updateName,
//   addReview,
//   getReviews,
//   deleteReview
// };


const User = require('../models/User'); // Adjust path as needed
const Restaurant = require('../models/Restaurant');

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
// @desc    Add review to restaurant
// @route   POST /api/users/restaurants/:restaurantId/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    
    // Extract complete review data from request body
    const reviewData = req.body.reviewData || req.body;
    const { 
      user, 
      userId, 
      userName, 
      userAvatar, 
      rating, 
      comment 
    } = reviewData;
    
    console.log("Extracted review data:", reviewData);
    
    // Validate required fields
    if (!rating || !comment || !userName || !userId) {
      return res.status(400).json({ 
        message: 'Rating, comment, userId, and userName are required' 
      });
    }
    
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.log("Restaurant not found for ID:", restaurantId);
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    console.log("Found restaurant:", restaurant.name);
    
    // Use the review data directly from the request
    const newReview = {
      user: user || userId,     // Use user ID reference
      userId: userId,           // User ID for compatibility
      userName: userName,       // User name
      userAvatar: userAvatar || '', // Avatar or empty string
      rating: Number(rating),   // Ensure rating is a number
      comment: comment,         // Comment text
      date: new Date()          // Current date
    };
    
    console.log("Created review object:", newReview);
    
    // Check if user already reviewed
    const existingReviewIndex = restaurant.reviews.findIndex(
      review => review.userId && review.userId.toString() === userId.toString()
    );
    
    if (existingReviewIndex !== -1) {
      console.log("Updating existing review at index:", existingReviewIndex);
      // Update existing review with new data
      restaurant.reviews[existingReviewIndex] = {
        ...restaurant.reviews[existingReviewIndex],
        ...newReview
      };
    } else {
      console.log("Adding new review");
      // Add new review
      restaurant.reviews.push(newReview);
    }
    
    // Calculate average rating
    if (restaurant.reviews.length > 0) {
      const totalRating = restaurant.reviews.reduce((sum, review) => sum + Number(review.rating), 0);
      restaurant.rating = (totalRating / restaurant.reviews.length).toFixed(1);
    }
    
    // Save restaurant with the new/updated review
    console.log("Saving restaurant...");
    await restaurant.save();
    console.log("Restaurant saved successfully");
    
    res.status(200).json({
      message: existingReviewIndex !== -1 ? 'Review updated successfully' : 'Review added successfully',
      reviews: restaurant.reviews,
      rating: restaurant.rating
    });
    
  } catch (error) {
    console.error('Error in addReview:', error);
    console.error('Error message:', error.message);
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
      for (let field in error.errors) {
        console.error(`Field ${field}:`, error.errors[field].message);
      }
    }
    
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all reviews for a restaurant
// @route   GET /api/users/:restaurantId/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    const restaurant = await Restaurant.findById(restaurantId)
      .select('reviews rating')
      .populate({
        path: 'reviews.user',
        select: 'name avatar'
      });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Sort reviews by date (newest first)
    const sortedReviews = [...restaurant.reviews].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    res.status(200).json({
      reviews: sortedReviews,
      rating: restaurant.rating
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Update the deleteReview function to properly check user ID
const deleteReview = async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;
    
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Find the review by ID
    const reviewIndex = restaurant.reviews.findIndex(
      review => review._id.toString() === reviewId
    );
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is the author of the review
    if (restaurant.reviews[reviewIndex].userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    // Remove the review
    restaurant.reviews.splice(reviewIndex, 1);
    
    // Recalculate rating
    if (restaurant.reviews.length > 0) {
      const totalRating = restaurant.reviews.reduce((sum, review) => sum + review.rating, 0);
      restaurant.rating = (totalRating / restaurant.reviews.length).toFixed(1);
    } else {
      restaurant.rating = 0;
    }
    
    await restaurant.save();
    
    // Return the updated reviews
    res.status(200).json({
      message: 'Review deleted successfully',
      reviews: restaurant.reviews,
      rating: restaurant.rating
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};


// @desc    Update a review for a restaurant
// @route   PUT /api/users/:restaurantId/reviews/:reviewId
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;
    console.log("Params:", req.params);
    console.log("Body:", req.body);

    const { rating, comment, userId } = req.body;

    if (!rating || !comment || !userId) {
      return res.status(400).json({ 
        message: 'Rating, comment, and userId are required for updating a review' 
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.log("Restaurant not found");
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const reviewIndex = restaurant.reviews.findIndex(
      r => r._id.toString() === reviewId && r.userId.toString() === userId
    );

    if (reviewIndex === -1) {
      console.log("Review not found or not authorized");
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }

    // Update the fields
    restaurant.reviews[reviewIndex].rating = Number(rating);
    restaurant.reviews[reviewIndex].comment = comment;
    restaurant.reviews[reviewIndex].date = new Date();

    // Recalculate average rating
    const totalRating = restaurant.reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    restaurant.rating = (totalRating / restaurant.reviews.length).toFixed(1);

    // Save changes
    console.log("Saving updated review...");
    await restaurant.save();
    console.log("Review updated successfully");

    res.status(200).json({
      message: 'Review updated successfully',
      reviews: restaurant.reviews,
      rating: restaurant.rating
    });

  } catch (error) {
    console.error('Error in updateReview:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};



module.exports = {
  getProfile,
  updateAvatar,
  updateName,
  addReview,
  getReviews,
  deleteReview,
  updateReview,
};