import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from "@material-tailwind/react";
import { useCreateRestaurantMutation ,
  useGetRestaurantsQuery ,
  useDeleteRestaurantMutation ,
  useUpdateRestaurantMutation,
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../../slices/apiSlice';
import { useSelector } from "react-redux";
import { Clock } from 'lucide-react';
import React from 'react';

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

function StatCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800'
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
      <div className={`${colorClasses[color]} p-3 rounded-full text-xl`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}
function MyRestaurants() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading, error, refetch } = useGetRestaurantsQuery();
  const [deleteRestaurant] = useDeleteRestaurantMutation();
  const [updateRestaurant, { isLoading: isUpdating }] = useUpdateRestaurantMutation();
  
  // State for edit popup
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    location: '',
    cuisine: '',
    description: '',
    capacity: '',
    openingHours: '',
    contact: ''
  });
  
  // Image management state
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  
  // Menu items state
  const [menuItems, setMenuItems] = useState([]);
  const [deletedMenuItems, setDeletedMenuItems] = useState([]);
  
  // Menu categories
  const menuCategories = [
    "Appetizers", "Main Courses", "Desserts", "Drinks", 
    "Sides", "Specials", "Breakfast", "Lunch", "Dinner"
  ];
  
  // Get valid data
  const allRestaurants = Array.isArray(data?.data) ? data.data : [];

  // Filter restaurants by the logged-in manager's ID
  const myRestaurants = allRestaurants.filter(
    (restaurant) => restaurant.owner === userInfo?._id
  );

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditFormData({
      name: restaurant.name || '',
      location: restaurant.location?.address || '',
      cuisine: restaurant.cuisine || '',
      description: restaurant.description || '',
      capacity: restaurant.capacity || '',
      openingHours: restaurant.openingHours || '',
      contact: restaurant.contact || ''
    });
    
    // Set current images
    setCurrentImages(restaurant.images || []);
    setNewImages([]);
    setImagesPreview([]);
    
    // Set menu items with unique IDs for UI
    let menuItemsWithIds = [];
    if (restaurant.menuItems && restaurant.menuItems.length > 0) {
      menuItemsWithIds = restaurant.menuItems.map((item, index) => ({
        ...item,
        id: index + 1,
        // Store existing images in images array with preview URLs
        images: (item.images || []).map(img => ({
          existingUrl: img,
          preview: img,
          isExisting: true
        }))
      }));
    } else {
      // Initialize with one empty menu item if none exist
      menuItemsWithIds = [{ 
        id: 1, 
        name: '', 
        category: '', 
        description: '', 
        price: '', 
        images: [] 
      }];
    }
    
    setMenuItems(menuItemsWithIds);
    setDeletedMenuItems([]);
    
    setShowEditPopup(true);
  };

  const handleDelete = async (id) => {
     {
      try {
        await deleteRestaurant(id).unwrap();
        toast.success('Restaurant deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete restaurant');
      }
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle removing current image
  const handleRemoveCurrentImage = (indexToRemove) => {
    setCurrentImages(currentImages.filter((_, index) => index !== indexToRemove));
  };
  
  // Handle new image uploads for restaurant
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to max 5 images total (current + new)
    if (currentImages.length + newImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    // Process each file
    files.forEach(file => {
      // Create preview for UI
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview(old => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
      
      // Add to newImages state for form submission
      setNewImages(prev => [...prev, file]);
    });
  };
  
  // Remove a new image (from preview)
  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages(newImages.filter((_, index) => index !== indexToRemove));
    setImagesPreview(imagesPreview.filter((_, index) => index !== indexToRemove));
  };
  
  // Menu item handlers
  const handleMenuChange = (id, field, value) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const addMenuItem = () => {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    setMenuItems([...menuItems, { 
      id: newId, 
      name: '', 
      category: '', 
      description: '', 
      price: '', 
      images: [] 
    }]);
  };
  
  const removeMenuItem = (id) => {
    // Get the menu item being removed
    const menuItemToRemove = menuItems.find(item => item.id === id);
    
    // If it has an _id (meaning it exists in the database), add to deletedMenuItems
    if (menuItemToRemove && menuItemToRemove._id) {
      setDeletedMenuItems([...deletedMenuItems, menuItemToRemove._id]);
    }
    
    // Remove from current list
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    } else {
      toast.info("You need at least one menu item");
    }
  };
  
  // Handle menu item image upload
  const handleMenuItemImageUpload = (e, menuItemId) => {
    const files = Array.from(e.target.files);
    
    setMenuItems(prevItems => 
      prevItems.map(item => {
        if (item.id === menuItemId) {
          // Count existing images (excluding those marked for removal)
          const existingImageCount = item.images.filter(img => !img.isRemoved).length;
          
          if (existingImageCount + files.length > 3) {
            toast.warning("Maximum 3 images allowed per menu item");
            return item;
          }
          
          // Process new images
          const newImages = [];
          
          files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
              // This code runs asynchronously after file is read
              // We can't directly update state from here in a safe way
            };
            reader.readAsDataURL(file);
            
            // Create a preview immediately using URL.createObjectURL
            newImages.push({
              file,
              preview: URL.createObjectURL(file),
              name: file.name,
              isNew: true
            });
          });
          
          return { ...item, images: [...item.images, ...newImages] };
        }
        return item;
      })
    );
  };
  
  // Remove menu item image
  const handleRemoveMenuItemImage = (menuItemId, imageIndex) => {
    setMenuItems(prevItems => 
      prevItems.map(item => {
        if (item.id === menuItemId) {
          const newImages = [...item.images];
          
          // If it's an existing image, mark it for removal rather than actually removing
          if (newImages[imageIndex].isExisting) {
            newImages[imageIndex] = { 
              ...newImages[imageIndex], 
              isRemoved: true 
            };
            return { ...item, images: newImages };
          } else {
            // For new uploads, remove completely
            return { 
              ...item, 
              images: item.images.filter((_, idx) => idx !== imageIndex) 
            };
          }
        }
        return item;
      })
    );
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create form data
      const formDataToSend = new FormData();
      
      // Add basic info
      formDataToSend.append('name', editFormData.name);
      
      // Format location
      const locationData = {
        address: editFormData.location
      };
      formDataToSend.append('location', JSON.stringify(locationData));
      
      formDataToSend.append('cuisine', editFormData.cuisine);
      formDataToSend.append('description', editFormData.description || '');
      formDataToSend.append('capacity', editFormData.capacity);
      formDataToSend.append('openingHours', editFormData.openingHours);
      formDataToSend.append('contact', editFormData.contact);
      formDataToSend.append('userId', userInfo._id);
      formDataToSend.append('userRole', userInfo.role);
      
      // Add existing restaurant images we want to keep
      if (currentImages.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(currentImages));
      }
      
      // Add new restaurant images if any
      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });
      
      // Process menu items
      const processedMenuItems = menuItems.map(item => {
        // Create a clean object without the UI-specific fields
        const { id, images, ...itemData } = item;
        
        // Keep track of which existing images to retain
        const existingImages = images
          .filter(img => img.isExisting && !img.isRemoved)
          .map(img => img.existingUrl);
        
        return {
          ...itemData,
          existingImages
        };
      });
      
      // Add processed menu items data
      formDataToSend.append('menuItems', JSON.stringify(processedMenuItems));
      
      // If there are menu items to delete, add those IDs
      if (deletedMenuItems.length > 0) {
        formDataToSend.append('deletedMenuItems', JSON.stringify(deletedMenuItems));
      }
      
      // Add menu item NEW images with naming convention
      menuItems.forEach((item, itemIndex) => {
        if (item.images && item.images.length > 0) {
          // Only process new images (not existing ones)
          const newImages = item.images.filter(img => img.isNew && !img.isRemoved);
          
          newImages.forEach((imgObj, imgIndex) => {
            formDataToSend.append(
              'menuItemImages', 
              imgObj.file, 
              `menuItem-${itemIndex}-image-${imgIndex}-${imgObj.name}`
            );
          });
        }
      });
      
      // Update restaurant
      await updateRestaurant({ 
        id: selectedRestaurant._id, 
        formData: formDataToSend 
      }).unwrap();
      
      toast.success('Restaurant updated successfully');
      setShowEditPopup(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update restaurant');
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10">Error loading restaurants...</div>;

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">My Restaurants</h2>
        <span className="text-gray-500 text-sm">{myRestaurants.length} total</span>
      </div>
      
      {myRestaurants.length === 0 ? (
        <p className="text-center text-gray-500">You don't own any restaurants yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative w-full h-44">
                <img
                  src={restaurant.images?.[0] || "https://via.placeholder.com/400x250"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium mb-1">{restaurant.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock size={16} className="mr-1" />
                  <span>Hours: {restaurant.openingHours || "Not specified"}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {restaurant.description || "No description available"}
                </p>
                
                <div className="flex justify-between gap-2">
                  <Button
                    onClick={() => handleEdit(restaurant)}
                    className="bg-green-500 hover:bg-green-600 text-white flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(restaurant._id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Edit Restaurant Popup Modal */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Restaurant</h2>
                <button 
                  onClick={() => setShowEditPopup(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="p-6">
              {/* Restaurant Basic Info Section */}
              <div className="mb-6 border-b pb-6">
                <h3 className="text-xl font-semibold mb-4">Restaurant Details</h3>
                
                {/* Restaurant Images Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Images (Max 5)
                  </label>
                  
                  <div className="flex flex-wrap gap-4">
                    {/* Current Images */}
                    {currentImages.map((img, index) => (
                      <div key={`current-${index}`} className="relative w-24 h-24 border rounded overflow-hidden">
                        <img 
                          src={img} 
                          alt={`Restaurant ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCurrentImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    
                    {/* New Image Previews */}
                    {imagesPreview.map((img, index) => (
                      <div key={`new-${index}`} className="relative w-24 h-24 border rounded overflow-hidden">
                        <img 
                          src={img} 
                          alt={`New upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    
                    {/* Add Image Button */}
                    {currentImages.length + newImages.length < 5 && (
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-gray-500 mt-1">Add Image</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location/Address*
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleFormChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cuisine Type*
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={editFormData.cuisine}
                      onChange={handleFormChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity*
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={editFormData.capacity}
                      onChange={handleFormChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      name="openingHours"
                      value={editFormData.openingHours}
                      onChange={handleFormChange}
                      placeholder="e.g. Mon-Fri: 9am-10pm, Sat-Sun: 10am-11pm"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={editFormData.contact}
                      onChange={handleFormChange}
                      placeholder="Phone, Email, Website"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              {/* Menu Items Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Menu Items</h3>
                  <button
                    type="button"
                    onClick={addMenuItem}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Item
                  </button>
                </div>
                
                {menuItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Menu Item #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeMenuItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Name*
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleMenuChange(item.id, 'name', e.target.value)}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category*
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => handleMenuChange(item.id, 'category', e.target.value)}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        >
                          <option value="">Select Category</option>
                          {menuCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleMenuChange(item.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price ($)*
                        </label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleMenuChange(item.id, 'price', e.target.value)}
                          required
                          step="0.01"
                          min="0"
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    
                    {/* Menu Item Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Images (Max 3)
                      </label>
                      
                      <div className="flex flex-wrap gap-3">
                        {/* Show existing and new images that aren't marked for removal */}
                        {item.images.filter(img => !img.isRemoved).map((img, imgIndex) => (
                          <div key={`item-${item.id}-img-${imgIndex}`} className="relative w-20 h-20 border rounded overflow-hidden">
                            <img 
                              src={img.preview} 
                              alt={`Menu item ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveMenuItemImage(item.id, item.images.findIndex(i => i.preview === img.preview))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              x
                            </button>
                          </div>
                        ))}
                        
                        {/* Add Image Button - only if less than 3 images */}
                        {item.images.filter(img => !img.isRemoved).length < 3 && (
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleMenuItemImageUpload(e, item.id)}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                    isUpdating ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isUpdating ? 'Updating...' : 'Update Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}


function CreateRestaurant() {
  const { userInfo} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    // Check if user exists and has manager role
    if (!userInfo || userInfo.role !== 'manager') {
      toast.error('You do not have permission to create restaurants');
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);
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
      formDataToSend.append('userId', userInfo._id); // Add user ID
    formDataToSend.append('userRole', userInfo.role);
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
  const [expandedBooking, setExpandedBooking] = useState(null);
  
  // Using RTK Query to fetch bookings based on filter
  const { data: bookings = [], isLoading, isError } = useGetBookingsQuery(filter);
  
  // Using RTK Query mutation to update booking status
  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfirm = async (id) => {
    try {
      await updateBookingStatus({ id, status: 'confirmed' }).unwrap();
      toast.success(`Booking #${id} confirmed`);
    } catch (error) {
      toast.error(`Failed to confirm booking: ${error.message}`);
    }
  };

  const handleCancel = async (id) => {
    try {
      await updateBookingStatus({ id, status: 'cancelled' }).unwrap();
      toast.info(`Booking #${id} cancelled`);
    } catch (error) {
      toast.error(`Failed to cancel booking: ${error.message}`);
    }
  };

  const toggleBookingDetails = (id) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(id);
    }
  };

  // Calculate counts
  const today = new Date().toISOString().split('T')[0];
  const todaysBookingsCount = bookings.filter(booking => booking.date === today).length;
  const pendingCount = bookings.filter(booking => booking.status === 'pending').length;

  // Calculate total pre-orders
  const totalPreOrders = bookings.reduce((total, booking) => {
    return total + (booking.preOrders?.length || 0);
  }, 0);
console.log(bookings);
  if (isLoading) return <div className="text-center py-8">Loading bookings...</div>;
  if (isError) return <div className="text-red-600 text-center py-8">Error loading bookings. Please try again.</div>;

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
            {pendingCount > 0 && (
              <span className="ml-1 bg-yellow-200 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1 text-sm rounded-md ${filter === 'cancelled' ? 'bg-red-700 text-white' : 'bg-red-100 text-red-700'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value={bookings.length} icon="📊" color="green" />
        <StatCard title="Today's Bookings" value={todaysBookingsCount} icon="📅" color="blue" />
        <StatCard title="Pending Approval" value={pendingCount} icon="⏳" color="yellow" />
        <StatCard title="Pre-ordered Items" value={totalPreOrders} icon="🍽️" color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map(booking => (
                <React.Fragment key={booking.id}>
                  <tr className={`hover:bg-gray-50 ${expandedBooking === booking.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {booking.userAvatar ? (
                          <img 
                            src={booking.userAvatar} 
                            alt={booking.customerName} 
                            className="h-10 w-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 font-medium text-sm">
                              {booking.customerName?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                          <div className="text-sm text-gray-500">{booking.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        {booking.restaurant?.image ? (
                          <img 
                            src={booking.restaurant.image} 
                            alt={booking.restaurant.name} 
                            className="h-10 w-10 rounded mr-3 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-500 font-medium text-sm">
                              {booking.restaurant?.name?.charAt(0) || 'R'}
                            </span>
                          </div>
                        )}
                        <div className="font-medium">{booking.restaurant?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
                      <div>{booking.time}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="font-medium">Guests: {booking.guests}</div>
                      
                      {booking.preOrders && booking.preOrders.length > 0 && (
                        <div className="text-xs text-green-600 font-medium">
                          {booking.preOrders.length} pre-ordered items
                        </div>
                      )}
                      <button 
                        onClick={() => toggleBookingDetails(booking.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs mt-1 flex items-center"
                      >
                        {expandedBooking === booking.id ? 'Hide details' : 'View details'}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transform ${expandedBooking === booking.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleConfirm(booking.id)}
                          className="bg-green-500 hover:bg-green-600 text-white mr-2 px-3 py-1 rounded-md"
                        >
                          Confirm
                        </button>
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
                  {expandedBooking === booking.id && (
                    <tr className="bg-blue-50">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Booking Information</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium text-gray-700">Booking ID:</span> {booking.id}</p>
                              <p><span className="font-medium text-gray-700">Date:</span> {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              <p><span className="font-medium text-gray-700">Time:</span> {booking.time}</p>
                              <p><span className="font-medium text-gray-700">Party Size:</span> {booking.guests} guests</p>
                              
                              {booking.tableType && (
                                <p><span className="font-medium text-gray-700">Table Type:</span> {booking.tableType}</p>
                              )}
                              {booking.occasion && (
                                <p><span className="font-medium text-gray-700">Occasion:</span> {booking.occasion}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium text-gray-700">Name:</span> {booking.customerName}</p>
                              <p><span className="font-medium text-gray-700">Email:</span> {booking.contact}</p>
                              
                               <p><span className="font-medium text-gray-700">Phone number :</span> {booking.phoneNumber} </p>
                              
                              {booking.notes && (
                                <div className="mt-2">
                                  <p className="font-medium text-gray-700">Special Requests:</p>
                                  <p className="text-gray-600 mt-1 p-2 bg-gray-100 rounded">{booking.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {booking.preOrders && booking.preOrders.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Pre-ordered Items</h4>
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <table className="min-w-full">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left text-xs font-medium text-gray-500 pb-2">Item</th>
                                      <th className="text-center text-xs font-medium text-gray-500 pb-2">Qty</th>
                                      <th className="text-right text-xs font-medium text-gray-500 pb-2">Price</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {booking.preOrders.map((item, index) => (
                                      <tr key={index} className="text-sm">
                                        <td className="py-2 font-medium text-gray-800">{item.name}</td>
                                        <td className="py-2 text-center text-gray-600">{item.quantity}</td>
                                        <td className="py-2 text-right text-gray-600">
                                          ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="border-t border-gray-200">
                                      <td className="pt-2 font-medium text-gray-800">Total</td>
                                      <td className="pt-2"></td>
                                      <td className="pt-2 text-right font-medium text-gray-800">
                                        ${booking.preOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No bookings found with the selected filter.
                  </td>
                </tr>
              )}
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