const { uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const Restaurant = require('../models/Restaurant');

// Helper function to process and upload images 
const processImages = async (files, folder) => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map(file => {
    return uploadToCloudinary(file.tempFilePath, folder);
  });
  
  try {
    const results = await Promise.all(uploadPromises);
    
    // Clean up temp files after upload
    files.forEach(file => {
      if (file.tempFilePath) {
        fs.unlink(file.tempFilePath, err => {
          if (err) console.error('Error deleting temp file:', err);
        });
      }
    });
    
    return results.map(result => result.secure_url);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error('Image upload failed');
  }
};

// Create a new restaurant
// In your controller
exports.createRestaurant = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    
    // Extract data from request
    const {
      name,
      location,
      cuisine,
      description,
      capacity,
      openingHours,
      contact,
      menuItems: menuItemsJson
    } = req.body;
    
    // Validate required fields
    if (!name) throw new Error('Restaurant name is required');
    if (!location) throw new Error('Location is required');
    if (!cuisine) throw new Error('Cuisine type is required');
    if (!openingHours) throw new Error('Opening hours are required');
    if (!contact) throw new Error('Contact information is required');
    
    // Parse location if it's a string
    let parsedLocation;
    try {
      parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    } catch (err) {
      // If parsing fails, create a default location object
      parsedLocation = { address: location };
    }
    
    // Ensure capacity is valid
    const parsedCapacity = parseInt(capacity);
    if (isNaN(parsedCapacity) || parsedCapacity < 1) {
      throw new Error('Capacity must be at least 1');
    }
    
    // Get user ID - for testing, use a placeholder if needed
    const ownerId = req.user?.id || "6437f85d29ee2b5a2b7f9f4d"; // Replace with valid ID
    
    // Create new restaurant
    const restaurant = new Restaurant({
      name,
      location: parsedLocation, // Use the parsed location
      cuisine,
      description: description || '',
      capacity: parsedCapacity,
      openingHours,
      contact,
      owner: ownerId,
      images: [],
      menuItems: []
    });
    
    // Rest of the code remains the same...
    
    // Rest of the code remains the same...
    
    // Process restaurant images
    if (req.files && req.files.restaurantImages) {
      const restaurantImageFiles = Array.isArray(req.files.restaurantImages)
        ? req.files.restaurantImages
        : [req.files.restaurantImages];
      
      const restaurantImages = await processImages(restaurantImageFiles, 'restaurants');
      restaurant.images = restaurantImages;
    }
    
    // Process menu items
    if (menuItemsJson) {
      try {
        const menuItemsData = JSON.parse(menuItemsJson);
        
        // Process menu item images
        const menuItemImageFiles = req.files && req.files.menuItemImages
          ? Array.isArray(req.files.menuItemImages)
            ? req.files.menuItemImages
            : [req.files.menuItemImages]
          : [];
        
        const menuItems = await Promise.all(menuItemsData.map(async (item, index) => {
          // Extract images for this specific menu item
          const itemImages = menuItemImageFiles.filter(file => {
            const fileName = file.name;
            return fileName && fileName.includes(`menuItem-${index}-image-`);
          });
          
          const imageUrls = await processImages(itemImages, 'menu-items');
          
          return {
            name: item.name || "Unnamed Item",
            category: item.category || "Uncategorized",
            description: item.description || "",
            price: parseFloat(item.price) || 0,
            images: imageUrls
          };
        }));
        
        restaurant.menuItems = menuItems;
      } catch (err) {
        console.error("Error processing menu items:", err);
      }
    }
    
    console.log("Restaurant to save:", restaurant);
    
    await restaurant.save();
    
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create restaurant'
    });
  }
};




// get restaurant byID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    // Find restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant',
    });
  }
};




// Controller to get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    // Fetch all restaurants from the database
    const restaurants = await Restaurant.find();

    if (restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No restaurants found',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error('Error fetching all restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
    });
  }
};
