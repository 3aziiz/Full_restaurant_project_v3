import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from "@material-tailwind/react";
import { useCreateRestaurantMutation } from '../../slices/apiSlice';

function Sidebar({ setView, currentView }) {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'restaurants', label: 'My Restaurants', icon: '🏢' },
    { id: 'create', label: 'Create Restaurant', icon: '➕' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handlegoback = () => {
    navigate('/');
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-green-800 to-teal-900 text-white p-6 flex flex-col shadow-xl sticky top-0">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-center">Manager Dashboard</h2>
        <div className="mt-2 w-16 h-1 bg-green-400 mx-auto rounded-full"></div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-md font-medium transition duration-200 ${
              currentView === item.id
                ? 'bg-green-700 text-white shadow-lg'
                : 'text-green-100 hover:bg-green-700/50'
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span>{item.label}</span>
            {currentView === item.id && (
              <span className="ml-auto w-2 h-2 bg-green-300 rounded-full"></span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="pt-6 border-t border-green-700/50">
        <div className="flex items-center px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            MG
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Manager User</p>
            <p className="text-xs text-green-300">manager@example.com</p>
          </div>
        </div>
        <button 
          onClick={handlegoback}
          className="mt-4 w-full px-4 py-2 text-sm text-green-200 hover:text-white flex items-center justify-center rounded-lg hover:bg-green-700/50 transition duration-200"
        >
          <span className="mr-2">⬅️</span> Go back
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const bgColorClass = `bg-${color}-100`;
  const textColorClass = `text-${color}-800`;
  const iconBgClass = `bg-${color}-200`;
  const iconTextClass = `text-${color}-600`;
  
  return (
    <div className={`p-6 rounded-xl shadow-md ${bgColorClass} flex items-center`}>
      <div className={`w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center mr-4`}>
        <span className={`text-2xl ${iconTextClass}`}>{icon}</span>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className={`text-2xl font-bold ${textColorClass}`}>{value}</p>
      </div>
    </div>
  );
}

function MyRestaurants() {
  // Mock data - would normally come from an API
  const restaurants = [
    { 
      id: '1', 
      name: 'Bella Italia', 
      location: '123 Main St, Rome', 
      cuisine: 'Italian',
      capacity: 45,
      rating: 4.5,
      image: '/api/placeholder/300/200'
    },
    { 
      id: '2', 
      name: 'Sushi Master', 
      location: '456 Ocean Dr, Tokyo', 
      cuisine: 'Japanese',
      capacity: 30,
      rating: 4.8,
      image: '/api/placeholder/300/200'
    },
  ];

  const handleEdit = (id) => {
    // Navigate to edit page or open modal
    toast.info(`Editing restaurant ${id}`);
  };

  const handleDelete = (id) => {
    // Delete restaurant logic
    toast.success(`Restaurant ${id} deleted`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">My Restaurants</h3>
        <div className="text-sm text-gray-500">{restaurants.length} restaurants total</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{restaurant.name}</h4>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-1">⭐</span>
                <span className="text-sm text-gray-700">{restaurant.rating}</span>
              </div>
              <p className="text-gray-600 mb-4">
                <span className="block">📍 {restaurant.location}</span>
                <span className="block">🍽️ {restaurant.cuisine}</span>
                <span className="block">👥 Capacity: {restaurant.capacity}</span>
              </p>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <Button
                  size="sm"
                  onClick={() => handleEdit(restaurant.id)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Edit
                </Button>
                <button
                  onClick={() => handleDelete(restaurant.id)}
                  className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



function CreateRestaurant() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    cuisine: '',
    description: '',
    capacity: '',
    openingHours: '',
    contact: ''
  });
  
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: '', category: '', description: '', price: '', images: [] }
  ]);
  
  const [restaurantImages, setRestaurantImages] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // RTK Query mutation hook
  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMenuChange = (id, field, value) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const addMenuItem = () => {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    setMenuItems([...menuItems, { id: newId, name: '', category: '', description: '', price: '', images: [] }]);
  };
  
  const removeMenuItem = (id) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    } else {
      toast.info("You need at least one menu item");
    }
  };
  
  const handleImageUpload = (e, menuItemId = null) => {
    // In a real implementation, this would handle file uploads to a server
    // and store image URLs or references
    const files = Array.from(e.target.files);
    
    if (menuItemId === null) {
      // Restaurant images (limit to 5)
      if (restaurantImages.length + files.length > 5) {
        toast.warning("Maximum 5 images allowed for restaurant");
        return;
      }
      
      // Here you would typically upload files to a server and get back URLs
      // For now, we'll create local object URLs for preview
      setRestaurantImages(prev => [
        ...prev, 
        ...files.map(file => ({
          file,
          preview: URL.createObjectURL(file),
          name: file.name
        }))
      ]);
    } else {
      // Menu item images (limit to 3)
      setMenuItems(prevItems => 
        prevItems.map(item => {
          if (item.id === menuItemId) {
            const fileObjects = files.map(file => ({
              file,
              preview: URL.createObjectURL(file),
              name: file.name
            }));
            
            const updatedImages = [...item.images, ...fileObjects];
            if (updatedImages.length > 3) {
              toast.warning(`Maximum 3 images allowed for menu items`);
              return item;
            }
            return { ...item, images: updatedImages };
          }
          return item;
        })
      );
    }
  };
  
  const removeImage = (index, menuItemId = null) => {
    if (menuItemId === null) {
      setRestaurantImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setMenuItems(prevItems => 
        prevItems.map(item => {
          if (item.id === menuItemId) {
            return { ...item, images: item.images.filter((_, i) => i !== index) };
          }
          return item;
        })
      );
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object to handle file uploads
      const formDataToSend = new FormData();
      
      // Add restaurant basic info - make sure all required fields are included
      formDataToSend.append('name', formData.name);
      
      // Format location data properly
      const locationData = {
        address: formData.location,
        // If you have coordinates, include them like this:
        // coordinates: [longitude, latitude]
      };
      
      // Convert location object to JSON string and append
      formDataToSend.append('location', JSON.stringify(locationData));
      
      formDataToSend.append('cuisine', formData.cuisine);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('openingHours', formData.openingHours);
      formDataToSend.append('contact', formData.contact);
      
      // Rest of the code remains the same...
      
      // Add restaurant images
      if (restaurantImages && restaurantImages.length > 0) {
        restaurantImages.forEach((imgObj) => {
          formDataToSend.append('restaurantImages', imgObj.file);
        });
      }
      
      // Process menu items into a JSON string
      const processedMenuItems = menuItems.map(item => {
        // We don't want to include the temporary id in the data sent to server
        const { id, images, ...itemData } = item;
        return itemData;
      });
      
      // Add menu items as JSON
      formDataToSend.append('menuItems', JSON.stringify(processedMenuItems));
      
      // Add menu item images with clear naming convention for server identification
      menuItems.forEach((item, itemIndex) => {
        if (item.images && item.images.length > 0) {
          item.images.forEach((imgObj, imgIndex) => {
            // Use a naming convention the server can parse to match images with menu items
            formDataToSend.append(
              'menuItemImages', 
              imgObj.file, 
              `menuItem-${itemIndex}-image-${imgIndex}-${imgObj.name}`
            );
          });
        }
      });
      
      // Debug what's being sent
      console.log("Form data to be sent:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'menuItems' ? JSON.parse(pair[1]) : pair[1]));
      }
      
      // If using RTK Query
      const response = await createRestaurant(formDataToSend).unwrap();
      
      // Alternative if using fetch directly
      /*
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        body: formDataToSend,
        // Note: Do NOT set Content-Type header for FormData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create restaurant');
      }
      */
      
      toast.success('Restaurant created successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        location: '',
        cuisine: '',
        description: '',
        capacity: '',
        openingHours: '',
        contact: ''
      });
      
      setMenuItems([{ 
        id: 1, 
        name: '', 
        category: '', 
        description: '', 
        price: '', 
        images: [] 
      }]);
      
      setRestaurantImages([]);
      setShowPreview(false);
      
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      
      // Log additional details for debugging
      console.log("Restaurant Data:", formData);
      
      // Display user-friendly error message
      toast.error(error.data?.message || error.message || 'Failed to create restaurant. Please try again.');
    }
  };


  const menuCategories = [
    "Appetizers", "Main Courses", "Desserts", "Drinks", 
    "Sides", "Specials", "Breakfast", "Lunch", "Dinner"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">Create New Restaurant</h3>
        <button
          onClick={togglePreview}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {showPreview ? "Edit Restaurant" : "Preview Restaurant"}
        </button>
      </div>
      
      {showPreview ? (
        // Restaurant Preview
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-64">
            {restaurantImages.length > 0 ? (
              <img 
                src={restaurantImages[0].preview} 
                alt={formData.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xl">No Image Added</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h2 className="text-3xl font-bold text-white">{formData.name || "Restaurant Name"}</h2>
              <p className="text-white/80">{formData.cuisine || "Cuisine Type"}</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {formData.cuisine || "Cuisine"}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Capacity: {formData.capacity || "0"}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {formData.openingHours || "Opening Hours"}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">{formData.description || "Restaurant description will appear here."}</p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Location & Contact</h3>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">📍</span> {formData.location || "Address"}
              </p>
              <p className="flex items-center text-gray-600">
                <span className="mr-2">📞</span> {formData.contact || "Contact number"}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Menu</h3>
              {menuItems.length > 0 ? (
                <div className="space-y-6">
                  {menuItems.map(item => (
                    <div key={item.id} className="border-b pb-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">{item.name || "Item Name"}</h4>
                          <p className="text-sm text-gray-500">{item.category || "Category"}</p>
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          {item.price ? `$${item.price}` : "$0.00"}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">{item.description || "Item description"}</p>
                      
                      {item.images.length > 0 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                          {item.images.map((img, index) => (
                            <img 
                              key={index} 
                              src={img.preview} 
                              alt={`${item.name} ${index+1}`}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No menu items added yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Restaurant Creation Form
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <form onSubmit={handleCreateRestaurant} className="p-6 space-y-6">
            {/* Restaurant Basic Info */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">Restaurant Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name*</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type*</label>
                  <select 
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Indian">Indian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Chinese">Chinese</option>
                    <option value="French">French</option>
                    <option value="American">American</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity*</label>
                  <input 
                    type="number" 
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours*</label>
                  <input 
                    type="text" 
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleChange}
                    placeholder="e.g. Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number*</label>
                  <input 
                    type="text" 
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Restaurant Images */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-800">Restaurant Images (Max 5)</h4>
                <span className="text-sm text-gray-500">{restaurantImages.length}/5 uploaded</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {restaurantImages.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img src={img.preview} alt={`Restaurant ${index+1}`} className="w-full h-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {restaurantImages.length < 5 && (
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple={restaurantImages.length < 4}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-800">Menu Items</h4>
                <button
                  type="button"
                  onClick={addMenuItem}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Menu Item
                </button>
              </div>
              
              {menuItems.map((item, index) => (
                <div key={item.id} className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-md font-medium text-gray-700">Menu Item #{index + 1}</h5>
                    {menuItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMenuItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => handleMenuChange(item.id, 'name', e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                      <select 
                        value={item.category}
                        onChange={(e) => handleMenuChange(item.id, 'category', e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select Category</option>
                        {menuCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      value={item.description}
                      onChange={(e) => handleMenuChange(item.id, 'description', e.target.value)}
                      rows="2"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input 
                        type="number" 
                        value={item.price}
                        onChange={(e) => handleMenuChange(item.id, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                        required
                        className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Item Images (Max 3)</label>
                      <span className="text-xs text-gray-500">{item.images.length}/3 uploaded</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {item.images.map((img, imgIndex) => (
                        <div key={imgIndex} className="relative w-16 h-16">
                          <img src={img.preview} alt={`Item ${imgIndex+1}`} className="w-full h-full object-cover rounded-md" />
                          <button
                            type="button"
                            onClick={() => removeImage(imgIndex, item.id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      
                      {item.images.length < 3 && (
                        <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, item.id)}
                            multiple={item.images.length < 2}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating...' : 'Create Restaurant'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}



function Bookings() {
  const [filter, setFilter] = useState('all');
  
  // Mock data - would normally come from an API
  const bookings = [
    {
      id: '1',
      restaurant: 'Bella Italia',
      customerName: 'John Smith',
      date: '2025-04-25',
      time: '19:00',
      guests: 4,
      status: 'confirmed',
      contact: 'john@example.com'
    },
    {
      id: '2',
      restaurant: 'Bella Italia',
      customerName: 'Emma Johnson',
      date: '2025-04-26',
      time: '20:30',
      guests: 2,
      status: 'pending',
      contact: 'emma@example.com'
    },
    {
      id: '3',
      restaurant: 'Sushi Master',
      customerName: 'Robert Lee',
      date: '2025-04-24',
      time: '18:30',
      guests: 6,
      status: 'confirmed',
      contact: 'robert@example.com'
    },
    {
      id: '4',
      restaurant: 'Sushi Master',
      customerName: 'Sarah Wilson',
      date: '2025-04-25',
      time: '13:00',
      guests: 3,
      status: 'cancelled',
      contact: 'sarah@example.com'
    }
  ];

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfirm = (id) => {
    toast.success(`Booking #${id} confirmed`);
  };

  const handleCancel = (id) => {
    toast.info(`Booking #${id} cancelled`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">Manage Bookings</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1 text-sm rounded-md ${filter === 'confirmed' ? 'bg-green-700 text-white' : 'bg-green-100 text-green-700'}`}
          >
            Confirmed
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-sm rounded-md ${filter === 'pending' ? 'bg-yellow-700 text-white' : 'bg-yellow-100 text-yellow-700'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1 text-sm rounded-md ${filter === 'cancelled' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Total Bookings" value={bookings.length} icon="📊" color="green" />
        <StatCard title="Today's Bookings" value="2" icon="📅" color="blue" />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">{booking.contact}</div>
                    <div className="text-sm text-gray-500">Guests: {booking.guests}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.restaurant}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{new Date(booking.date).toLocaleDateString()}</div>
                    <div>{booking.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {booking.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleConfirm(booking.id)}
                        className="bg-green-500 hover:bg-green-600 text-white mr-2"
                      >
                        Confirm
                      </Button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">Account Settings</h3>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Profile Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  defaultValue="Manager User"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  defaultValue="manager@example.com"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">New Bookings</div>
                  <div className="text-xs text-gray-500">Get notified when a new booking is made</div>
                </div>
                <div className="flex items-center">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="toggle-1" defaultChecked className="sr-only" />
                    <div className="bg-gray-200 block w-10 h-6 rounded-full"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-0"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Booking Cancellations</div>
                  <div className="text-xs text-gray-500">Get notified when a booking is cancelled</div>
                </div>
                <div className="flex items-center">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="toggle-2" defaultChecked className="sr-only" />
                    <div className="bg-gray-200 block w-10 h-6 rounded-full"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-0"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Marketing Updates</div>
                  <div className="text-xs text-gray-500">Get notified about platform updates and features</div>
                </div>
                <div className="flex items-center">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="toggle-3" className="sr-only" />
                    <div className="bg-gray-200 block w-10 h-6 rounded-full"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  const [view, setView] = useState('restaurants');

  let Content;
  if (view === 'restaurants') Content = <MyRestaurants />;
  else if (view === 'create') Content = <CreateRestaurant />;
  else if (view === 'bookings') Content = <Bookings />;
  else if (view === 'settings') Content = <Settings />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setView={setView} currentView={view} />
      <div className="flex-1 p-8">
        {Content}
      </div>
    </div>
  );
}