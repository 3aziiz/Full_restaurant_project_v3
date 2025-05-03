import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { useCreateBookingMutation } from '../../slices/apiSlice'; // Adjust path as needed

export default function BookingComponent({ restaurant }) {
    // Get userInfo from Redux state
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    console.log(restaurant.images);
    // RTK Query mutation hook
    const [createBooking, { isLoading }] = useCreateBookingMutation();
    
    // State for modal
    const [showModal, setShowModal] = useState(false);
    const [bookingData, setBookingData] = useState({
      date: '',
      time: '',
      guests: 1,
      phoneNumber: '',
      specialRequests: '',
      preOrders: [] // Array to store pre-ordered menu items
    });

    // Add state for selected menu items
    const [selectedMenuItems, setSelectedMenuItems] = useState({});

    // Get menu items from restaurant (check both menuItems and menu properties)
    const menuItems = restaurant.menuItems || restaurant.menu || [];
  
    // Book a table
    const bookTable = () => {
      if (!userInfo) {
        toast.warning("Please login to book a table");
        return;
      }
      
      // Show booking modal
      setShowModal(true);
    };
    
    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    };
    
    // Handle menu item quantity changes
    const handleMenuItemChange = (menuItemId, quantity) => {
      // Ensure quantity is a non-negative integer
      const validQuantity = Math.max(0, parseInt(quantity) || 0);
      
      setSelectedMenuItems(prev => ({
        ...prev,
        [menuItemId]: validQuantity
      }));
    };
    
    // Submit booking
    const handleSubmitBooking = async (e) => {
      if (e) e.preventDefault();
      
      try {
        // Convert selected menu items to pre-orders array format
        const preOrders = Object.entries(selectedMenuItems)
          .filter(([_, quantity]) => quantity > 0)
          .map(([menuItemId, quantity]) => {
            const menuItem = menuItems.find(item => item._id === menuItemId);
            return {
              menuItemId,
              name: menuItem?.name || 'Unknown item',
              price: menuItem?.price || 0,
              quantity
            };
          });
        
        // Create booking payload with all required info
        const bookingPayload = {
          // User information
          userId: userInfo._id,
          userName: userInfo.name,
          userAvatar: userInfo.avatar,
          
          // Restaurant information
          restaurantId: restaurant._id,
          restaurantName: restaurant.name,
          restaurantImage:restaurant.images?.[0],
          // Booking details
          date: bookingData.date,
          time: bookingData.time,
          guests: Number(bookingData.guests),
          phoneNumber: bookingData.phoneNumber,
          specialRequests: bookingData.specialRequests,
          preOrders: preOrders, // Add pre-ordered items
          status: 'pending' // Default status
        };
        console.log(bookingPayload);
        // Call the RTK Query mutation
        await createBooking(bookingPayload).unwrap();
        
        // Close modal and show success message
        setShowModal(false);
        toast.success("Booking request submitted! Please wait for the restaurant's confirmation.");
        
        // Reset form
        setBookingData({
          date: '',
          time: '',
          guests: 1,
          phoneNumber: '',
          specialRequests: '',
          preOrders: []
        });
        
        // Reset selected menu items
        setSelectedMenuItems({});
        
      } catch (error) {
        toast.error(error?.data?.message || "Failed to create booking. Please try again.");
      }
    };
  
    return (
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Make a Reservation</h3>
        <p className="text-gray-600 mb-6">Reserve your table now for an unforgettable dining experience.</p>
        
        <button
          onClick={bookTable}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition mb-4"
        >
          Book a Table
        </button>
        
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">or call us directly at</p>
          <a href={`tel:${restaurant.contact}`} className="text-orange-600 font-semibold text-lg hover:underline">
            {restaurant.contact || 'Contact not available'}
          </a>
        </div>
        
        <hr className="my-6 border-gray-200" />
        
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Opening Hours</h4>
          <p className="text-gray-700">{restaurant.openingHours || 'Hours not available'}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
          <p className="text-gray-700">{restaurant.location?.address || 'Address not available'}</p>
          
          {/* Map placeholder - would connect to actual map service */}
          <div className="mt-4 rounded-lg overflow-hidden h-48 bg-gray-200">
            <img
              src="/api/placeholder/400/200"
              alt="Restaurant location map"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
  
        {/* Complete modal redesign */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-center items-start pt-4 pb-20 px-4 sm:px-6">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>
            
            {/* Modal panel */}
            <div className="bg-white rounded-lg shadow-xl transform transition-all w-full max-w-4xl h-auto max-h-[90vh] flex flex-col relative z-50">
              {/* Header */}
              <div className="bg-white px-4 py-5 sm:px-6 border-b border-gray-200 rounded-t-lg sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Book a Table at {restaurant.name}
                  </h3>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowModal(false)}
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
                        value={bookingData.date}
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
                        value={bookingData.time}
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
                        value={bookingData.guests}
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
                        value={bookingData.phoneNumber}
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
                      value={bookingData.specialRequests}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {menuItems.map((menuItem) => (
                        <div key={menuItem._id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h5 className="font-medium">{menuItem.name}</h5>
                              <p className="text-orange-600 font-medium">${menuItem.price?.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                type="button"
                                onClick={() => handleMenuItemChange(menuItem._id, (selectedMenuItems[menuItem._id] || 0) - 1)}
                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-l-md"
                                disabled={(selectedMenuItems[menuItem._id] || 0) <= 0}
                              >
                                −
                              </button>
                              <span className="px-3 py-1 text-gray-700">
                                {selectedMenuItems[menuItem._id] || 0}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleMenuItemChange(menuItem._id, (selectedMenuItems[menuItem._id] || 0) + 1)}
                                className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-r-md"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {(selectedMenuItems[menuItem._id] || 0) > 0 && (
                            <p className="text-xs text-orange-600 font-medium text-right">
                              Total: ${((menuItem?.price || 0) * (selectedMenuItems[menuItem._id] || 0)).toFixed(2)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No menu items available for this restaurant.</p>
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
                                const menuItem = menuItems.find(item => item._id === menuItemId);
                                return (
                                  <div key={menuItemId} className="bg-white px-2 py-1 rounded-full border border-gray-200 text-xs">
                                    {menuItem?.name} × {quantity}
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-sm text-gray-600">Pre-order Total:</span>
                          <span className="text-orange-600 font-bold text-lg">
                            ${
                              Object.entries(selectedMenuItems)
                                .filter(([_, quantity]) => quantity > 0)
                                .reduce((total, [menuItemId, quantity]) => {
                                  const menuItem = menuItems.find(item => item._id === menuItemId);
                                  return total + (menuItem?.price || 0) * quantity;
                                }, 0)
                                .toFixed(2)
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer with action buttons */}
              <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 rounded-b-lg flex flex-col sm:flex-row-reverse sm:justify-between sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 sm:text-sm"
                >
                  {isLoading ? 'Submitting...' : 'Confirm Booking'}
                </button>
                <p className="text-sm text-gray-500 text-center sm:text-left">
                  Your booking will be pending until confirmed by the restaurant.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}