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


// DELETE /api/restaurants/:id
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user owns the restaurant
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await restaurant.deleteOne();
    res.status(200).json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



// Update a restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    console.log("Update request body:", req.body);
    console.log("Update request files:", req.files);
    
    const restaurantId = req.params.id;
    
    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }
    
    // Check if user owns the restaurant or is admin
    if (req.body.userRole !== 'admin' && restaurant.owner.toString() !== req.body.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this restaurant',
      });
    }
    
    // Extract data from request
    const {
      name,
      location,
      cuisine,
      description,
      capacity,
      openingHours,
      contact,
      menuItems: menuItemsJson,
      existingImages: existingImagesJson,
      deletedMenuItems: deletedMenuItemsJson
    } = req.body;
    
    // Validate required fields
    if (!name) throw new Error('Restaurant name is required');
    if (!location) throw new Error('Location is required');
    if (!cuisine) throw new Error('Cuisine type is required');
    if (!capacity) throw new Error('Capacity is required');
    
    // Parse location if it's a string
    let parsedLocation;
    try {
      parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    } catch (err) {
      // If parsing fails, create a default location object
      parsedLocation = { address: location };
    }
    
    // Parse capacity
    const parsedCapacity = parseInt(capacity);
    if (isNaN(parsedCapacity) || parsedCapacity < 1) {
      throw new Error('Capacity must be at least 1');
    }
    
    // Handle restaurant images
    // Get existing images from JSON or use the current ones
    let existingImages = [];
    if (existingImagesJson) {
      try {
        existingImages = JSON.parse(existingImagesJson);
      } catch (err) {
        console.error("Error parsing existing images:", err);
        // Fallback to current images in case of parsing error
        existingImages = restaurant.images;
      }
    } else {
      // If no existingImagesJson was provided, this means the user removed all images
      existingImages = [];
    }
    
    // Process new restaurant images
    let newImages = [];
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      
      newImages = await processImages(imageFiles, 'restaurants');
    }
    
    // Combine existing and new images
    const updatedImages = [...existingImages, ...newImages];
    
    // Process menu items
    let updatedMenuItems = [];
    
    if (menuItemsJson) {
      try {
        const menuItemsData = JSON.parse(menuItemsJson);
        
        // Process menu item images
        const menuItemImageFiles = req.files && req.files.menuItemImages
          ? Array.isArray(req.files.menuItemImages)
            ? req.files.menuItemImages
            : [req.files.menuItemImages]
          : [];
        
        updatedMenuItems = await Promise.all(menuItemsData.map(async (item, index) => {
          // Check if this is an existing menu item
          const isExisting = item._id ? true : false;
          
          // Extract images for this specific menu item based on filename pattern
          const itemImages = menuItemImageFiles.filter(file => {
            const fileName = file.name;
            return fileName && fileName.includes(`menuItem-${index}-image-`);
          });
          
          // Upload new images for this menu item
          const newImageUrls = await processImages(itemImages, 'menu-items');
          
          // Get existing images for this item that haven't been removed
          const existingItemImages = item.existingImages || [];
          
          // Combine existing and new images for this menu item
          const combinedImages = [...existingItemImages, ...newImageUrls];
          
          // Create updated menu item object
          const updatedItem = {
            name: item.name || "Unnamed Item",
            category: item.category || "Uncategorized",
            description: item.description || "",
            price: parseFloat(item.price) || 0,
            images: combinedImages
          };
          
          // If it's an existing item, preserve the ID
          if (isExisting) {
            updatedItem._id = item._id;
          }
          
          return updatedItem;
        }));
      } catch (err) {
        console.error("Error processing menu items:", err);
        throw new Error('Error processing menu items');
      }
    } else {
      // If no menu items data was provided, keep the existing items
      updatedMenuItems = restaurant.menuItems;
    }
    
    // Handle deleted menu items
    if (deletedMenuItemsJson) {
      try {
        const deletedMenuItemIds = JSON.parse(deletedMenuItemsJson);
        
        // Filter out the menu items that are marked for deletion
        const existingMenuItems = restaurant.menuItems.filter(item => 
          !deletedMenuItemIds.includes(item._id.toString())
        );
        
        // Get IDs of items in the updated list that already have IDs
        const updatedItemIds = updatedMenuItems
          .filter(item => item._id)
          .map(item => item._id.toString());
        
        // Find items that haven't been touched in this update
        const untouchedMenuItems = existingMenuItems.filter(item => 
          !updatedItemIds.includes(item._id.toString())
        );
        
        // Add untouched items to the updated list
        const finalMenuItems = [
          ...updatedMenuItems,
          ...untouchedMenuItems
        ];
        
        updatedMenuItems = finalMenuItems;
      } catch (err) {
        console.error("Error processing deleted menu items:", err);
      }
    }
    
    // Update the restaurant object
    restaurant.name = name;
    restaurant.location = parsedLocation;
    restaurant.cuisine = cuisine;
    restaurant.description = description || '';
    restaurant.capacity = parsedCapacity;
    restaurant.openingHours = openingHours || restaurant.openingHours;
    restaurant.contact = contact || restaurant.contact;
    restaurant.images = updatedImages;
    restaurant.menuItems = updatedMenuItems;
    
    console.log("Restaurant to update:", restaurant);
    
    // Save the updated restaurant
    await restaurant.save();
    
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update restaurant'
    });
  }
};