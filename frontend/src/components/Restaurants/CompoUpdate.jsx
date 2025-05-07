import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { useUpdateBookingMutation } from '../../slices/apiSlice';

export default function CompoUpdate({ booking, restaurant, onClose }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  
  // Use passed restaurant prop or fallback to booking's restaurant
  const restaurantData = restaurant || booking?.restaurant || {};
  
  // State for booking data
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 1,
    phoneNumber: '',
    specialRequests: '',
  });

  // State for selected menu items
  const [selectedMenuItems, setSelectedMenuItems] = useState({});

  // Get menu items from restaurant data
  const getMenuItems = () => {
    if (!restaurantData) return [];
    
    // Check for different possible menu paths
    if (Array.isArray(restaurantData.menuItems)) {
      return restaurantData.menuItems;
    } else if (Array.isArray(restaurantData.menu)) {
      return restaurantData.menu;
    } else if (Array.isArray(restaurantData.data?.menuItems)) {
      return restaurantData.data.menuItems;
    } else if (Array.isArray(restaurantData.data?.menu)) {
      return restaurantData.data.menu;
    } else if (restaurantData.menuItems && typeof restaurantData.menuItems === 'object') {
      return Object.values(restaurantData.menuItems);
    } else if (restaurantData.menu && typeof restaurantData.menu === 'object') {
      return Object.values(restaurantData.menu);
    }
    
    return [];
  };
  
  const menuItems = getMenuItems();

  // Populate form with existing booking data when loaded
  useEffect(() => {
    if (booking) {
      // Format date to YYYY-MM-DD for input
      const bookingDate = booking.date ? new Date(booking.date) : null;
      const formattedDate = bookingDate ? bookingDate.toISOString().split('T')[0] : '';
      
      // Set form data
      setFormData({
        date: formattedDate,
        time: booking.time || '',
        guests: booking.guests || 1,
        phoneNumber: booking.phoneNumber || '',
        specialRequests: booking.specialRequests || '',
      });
      
      // Set selected menu items based on existing pre-orders
      const menuSelections = {};
      if (booking.preOrders && booking.preOrders.length > 0) {
        booking.preOrders.forEach(item => {
          menuSelections[item.menuItemId] = item.quantity;
        });
      }
      setSelectedMenuItems(menuSelections);
    }
  }, [booking]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle menu item quantity changes
  const handleMenuItemChange = (menuItemId, quantity) => {
    const validQuantity = Math.max(0, parseInt(quantity) || 0);
    
    setSelectedMenuItems(prev => ({
      ...prev,
      [menuItemId]: validQuantity
    }));
  };

  // Increment menu item quantity
  const incrementQuantity = (menuItemId) => {
    setSelectedMenuItems(prev => ({
      ...prev,
      [menuItemId]: (prev[menuItemId] || 0) + 1
    }));
  };

  // Decrement menu item quantity
  const decrementQuantity = (menuItemId) => {
    if ((selectedMenuItems[menuItemId] || 0) > 0) {
      setSelectedMenuItems(prev => ({
        ...prev,
        [menuItemId]: prev[menuItemId] - 1
      }));
    }
  };
  
  // Helper functions for menu items
  const getItemId = (item) => item?._id || item?.id;
  const getItemName = (item) => item?.name || item?.title;
  const getItemPrice = (item) => item?.price || item?.cost || item?.value || 0;
  
  // Check if menuItem has required properties
  const isValidMenuItem = (item) => {
    if (!item) return false;
    const idField = getItemId(item);
    const nameField = getItemName(item);
    const priceField = getItemPrice(item);
    return !!(idField && nameField && priceField !== undefined);
  };
  
  // Calculate total price for all selected items
  const calculateTotal = () => {
    return Object.entries(selectedMenuItems)
      .filter(([_, quantity]) => quantity > 0)
      .reduce((total, [menuItemId, quantity]) => {
        const menuItem = menuItems.find(item => getItemId(item) === menuItemId);
        return total + (getItemPrice(menuItem) || 0) * quantity;
      }, 0)
      .toFixed(2);
  };
  
  // Filter menu items by category
  const getMenuCategories = () => {
    const categories = new Set();
    menuItems.forEach(item => {
      if (item.category) categories.add(item.category);
    });
    return Array.from(categories);
  };

  const menuCategories = getMenuCategories();
  const hasCategories = menuCategories.length > 0;
  
  // Submit booking update
  const handleSubmitUpdate = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // Convert selected menu items to pre-orders array format
      const preOrders = Object.entries(selectedMenuItems)
        .filter(([_, quantity]) => quantity > 0)
        .map(([menuItemId, quantity]) => {
          const menuItem = menuItems.find(item => getItemId(item) === menuItemId);
          return {
            menuItemId,
            name: getItemName(menuItem) || 'Unknown item',
            price: getItemPrice(menuItem) || 0,
            quantity
          };
        });
      
      // Create booking data payload
      const bookingData = {
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests),
        phoneNumber: formData.phoneNumber,
        specialRequests: formData.specialRequests,
        preOrders: preOrders,
        restaurantId: restaurantData._id,
        status: 'pending'
      };
      
      // Match the API slice requirements with id and bookingData structure
      await updateBooking({
        id: booking._id,
        bookingData: bookingData
      }).unwrap();
      
      onClose();
      toast.success("Booking update submitted! Please wait for the restaurant's confirmation.");
      
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update booking. Please try again.");
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    try {
      // Match the API slice structure with id and bookingData
      await updateBooking({
        id: booking._id,
        bookingData: {
          status: 'canceled'
        }
      }).unwrap();
      
      onClose();
      toast.success("Booking has been canceled successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to cancel booking. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-center items-start pt-4 pb-20 px-4 sm:px-6">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal panel */}
      <div className="bg-white rounded-lg shadow-xl transform transition-all w-full max-w-4xl h-auto max-h-[90vh] flex flex-col relative z-50">
        {/* Header */}
        <div className="bg-white px-4 py-5 sm:px-6 border-b border-gray-200 rounded-t-lg sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Update Reservation at {restaurantData?.name}
            </h3>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal content - scrollable */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1">
          {/* Reservation Details Section */}
          <div className="space-y-6 mb-8">
            <h4 className="text-lg font-bold">Reservation Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="time">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="guests">
                  Number of Guests
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="For confirmation calls"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="specialRequests">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Any special requests or dietary requirements?"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
          
          {/* Pre-order Menu Items Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-bold mb-4">Pre-order Menu Items (Optional)</h4>
            
            {menuItems && menuItems.length > 0 ? (
              <>
                {/* Category filters if available */}
                {hasCategories && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Menu Categories</h5>
                    <div className="flex flex-wrap gap-2">
                      {menuCategories.map(category => (
                        <div key={category} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              
                {/* Display menu items */}
                {hasCategories ? (
                  // Display by category
                  menuCategories.map(category => (
                    <div key={category} className="mb-8">
                      <h5 className="font-medium text-gray-800 mb-3">{category}</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {menuItems
                          .filter(item => item.category === category && isValidMenuItem(item))
                          .map((menuItem) => (
                            <div key={getItemId(menuItem)} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                              <div className="flex justify-between mb-2">
                                <div>
                                  <h5 className="font-medium">{getItemName(menuItem)}</h5>
                                  <p className="text-orange-600 font-medium">${getItemPrice(menuItem).toFixed(2)}</p>
                                  {(menuItem.description || menuItem.desc) && (
                                    <p className="text-xs text-gray-500 mt-1">{menuItem.description || menuItem.desc}</p>
                                  )}
                                </div>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                  <button
                                    type="button"
                                    onClick={() => decrementQuantity(getItemId(menuItem))}
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-l-md"
                                    disabled={(selectedMenuItems[getItemId(menuItem)] || 0) <= 0}
                                  >
                                    −
                                  </button>
                                  <span className="px-3 py-1 text-gray-700">
                                    {selectedMenuItems[getItemId(menuItem)] || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => incrementQuantity(getItemId(menuItem))}
                                    className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-r-md"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              
                              {(selectedMenuItems[getItemId(menuItem)] || 0) > 0 && (
                                <p className="text-xs text-orange-600 font-medium text-right">
                                  Total: ${(getItemPrice(menuItem) * (selectedMenuItems[getItemId(menuItem)] || 0)).toFixed(2)}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Display all items without categories
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems
                      .filter(item => isValidMenuItem(item))
                      .map((menuItem) => (
                        <div key={getItemId(menuItem)} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h5 className="font-medium">{getItemName(menuItem)}</h5>
                              <p className="text-orange-600 font-medium">${getItemPrice(menuItem).toFixed(2)}</p>
                              {(menuItem.description || menuItem.desc) && (
                                <p className="text-xs text-gray-500 mt-1">{menuItem.description || menuItem.desc}</p>
                              )}
                            </div>
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                type="button"
                                onClick={() => decrementQuantity(getItemId(menuItem))}
                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-l-md"
                                disabled={(selectedMenuItems[getItemId(menuItem)] || 0) <= 0}
                              >
                                −
                              </button>
                              <span className="px-3 py-1 text-gray-700">
                                {selectedMenuItems[getItemId(menuItem)] || 0}
                              </span>
                              <button
                                type="button"
                                onClick={() => incrementQuantity(getItemId(menuItem))}
                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-r-md"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {(selectedMenuItems[getItemId(menuItem)] || 0) > 0 && (
                            <p className="text-xs text-orange-600 font-medium text-right">
                              Total: ${(getItemPrice(menuItem) * (selectedMenuItems[getItemId(menuItem)] || 0)).toFixed(2)}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-center py-4">
                <p>No menu items available for this restaurant.</p>
              </div>
            )}
            
            {/* Order summary */}
            {Object.values(selectedMenuItems).some(quantity => quantity > 0) && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-md">
                <div className="sm:flex sm:justify-between sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <span className="font-medium text-gray-700">Selected Items:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(selectedMenuItems)
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([menuItemId, quantity]) => {
                          const menuItem = menuItems.find(item => getItemId(item) === menuItemId);
                          return (
                            <div key={menuItemId} className="bg-white px-2 py-1 rounded-full border border-gray-200 text-xs">
                              {getItemName(menuItem) || 'Unknown item'} × {quantity}
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm text-gray-600">Pre-order Total:</span>
                    <span className="text-orange-600 font-bold text-lg">
                      ${calculateTotal()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 rounded-b-lg flex flex-col sm:flex-row-reverse sm:justify-between sm:items-center gap-4">
          <div className="flex space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSubmitUpdate}
              disabled={isUpdating}
              className="flex-1 sm:flex-initial inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 sm:text-sm"
            >
              {isUpdating ? 'Updating...' : 'Update Reservation'}
            </button>
            
          </div>
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Your updated booking will be pending until confirmed by the restaurant.
          </p>
        </div>
      </div>
    </div>
  );
}