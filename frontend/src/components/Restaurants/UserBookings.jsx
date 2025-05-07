import React, { useEffect, useState } from 'react';
import { 
  useGetUserBookingsQuery, 
  useCancelBookingMutation,
  useDeleteBookingMutation,
  useGetRestaurantByIdQuery
} from '../../slices/apiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CompoUpdate from './CompoUpdate';
import CompoPay from './CompoPay';
import { Trash2 } from 'lucide-react';

// Action buttons component remains the same
const ActionButtons = ({ booking, onUpdate, onPay, onCancel, onDelete }) => {
  // Only show delete button for pending and cancelled statuses
  const renderDeleteButton = booking.status === 'pending' || booking.status === 'cancelled';
  
  if (booking.status === 'pending') {
    return (
      <div className="flex gap-2 items-center">
        {renderDeleteButton && (
          <button
            onClick={() => onDelete(booking)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200 mr-1"
            title="Delete booking"
          >
            <Trash2 size={18} />
          </button>
        )}
        <button
          onClick={() => onUpdate(booking)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
        >
          Update
        </button>
        <button
          onClick={() => onCancel(booking)}
          className="bg-red-400 hover:bg-red-500 text-white py-1 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    );
  } else if (booking.status === 'confirmed') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => onPay(booking)}
          className="bg-green-500 hover:bg-green-600 text-white py-1 px-7 rounded"
        >
          Pay
        </button>
        <button
          onClick={() => onCancel(booking)}
          className="bg-red-400 hover:bg-red-500 text-white py-1 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    );
  } else if (booking.status === 'cancelled') {
    return (
      <div className="flex items-center gap-2">
        {renderDeleteButton && (
          <button
            onClick={() => onDelete(booking)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200 mr-1"
            title="Delete booking"
          >
            <Trash2 size={18} />
          </button>
        )}
        <div className="text-red-500 font-medium">
          Cancelled
        </div>
      </div>
    );
  }
  
  // For any other status, return null or a placeholder
  return null;
};

// PreOrderedItems component remains the same
const PreOrderedItems = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!items || items.length === 0) return null;

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-1">
        <span>{items.length} pre-ordered {items.length === 1 ? 'item' : 'items'}</span>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-blue-500 hover:underline text-sm flex items-center"
        >
          {isOpen ? 'Hide details' : 'View details'} 
          <svg 
            className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 border rounded-md p-3 bg-white">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-1">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t font-medium">
                <td colSpan="2" className="py-2">Total</td>
                <td className="py-2 text-right">${totalPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// StatusBadge component remains the same
const StatusBadge = ({ status }) => {
  let bgColor = '';
  
  switch (status) {
    case 'confirmed':
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'pending':
      bgColor = 'bg-yellow-100 text-yellow-800';
      break;
    case 'cancelled':
      bgColor = 'bg-red-100 text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`${bgColor} px-3 py-1 rounded-full text-sm capitalize`}>
      {status}
    </span>
  );
};

// Main BookingsComponent
const BookingsComponent = () => {
  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { data: bookings, isLoading, error, refetch } = useGetUserBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // New approach: Keep track of both the restaurant ID and restaurant data
  const [restaurantId, setRestaurantId] = useState(null);
  
  // Use the query hook with the restaurantId
  const { 
    data: restaurant, 
    isLoading: isRestaurantLoading,
    isSuccess: isRestaurantSuccess
  } = useGetRestaurantByIdQuery(restaurantId, {
    skip: !restaurantId, // Skip this query until we have a restaurantId
  });

  useEffect(() => {
    // Refetch bookings when component mounts
    refetch();
  }, [refetch]);

  const handleUpdate = (booking) => {
    setSelectedBooking(booking);
    
    // Set the restaurant ID to trigger fetching restaurant data
    if (booking && booking.restaurantId) {
      setRestaurantId(booking.restaurantId);
    } else if (booking && booking.restaurant && booking.restaurant._id) {
      // Alternative: if restaurantId is nested inside a restaurant object
      setRestaurantId(booking.restaurant._id);
    }
    
    // Don't open the modal yet - we'll do it when we have the restaurant data
    // Only open the modal if we already have the data or if we couldn't determine a restaurant ID
    if (!booking.restaurantId && (!booking.restaurant || !booking.restaurant._id)) {
      setUpdateModalOpen(true);
    }
  };

  // Effect to open modal once restaurant data is loaded
  useEffect(() => {
    if (selectedBooking && restaurant && isRestaurantSuccess) {
      // console.log("Restaurant data loaded successfully:", restaurant);
      setUpdateModalOpen(true);
    }
  }, [selectedBooking, restaurant, isRestaurantSuccess]);

  const handlePay = (booking) => {
    setSelectedBooking(booking);
    setPayModalOpen(true);
  };

  const handleCancel = async (booking) => {
    try {
      // Call the cancel booking mutation
      await cancelBooking(booking._id).unwrap();
      // After successful cancellation, refetch the bookings
      refetch();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      // You could set an error state here to display to the user
    }
  };

  const handleDelete = async (booking) => {
   
      try {
        // Call the delete booking mutation
        await deleteBooking(booking._id).unwrap();
        // After successful deletion, refetch the bookings
        refetch();
      } catch (err) {
        console.error("Error deleting booking:", err);
        // You could set an error state here to display to the user
      
    }
  };

  const formatDateTime = (date, time) => {
    try {
      const dateObj = new Date(date);
      // Format date manually without date-fns
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${month}/${day}/${year} ${time}`;
    } catch (error) {
      return `${date} ${time}`;
    }
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setSelectedBooking(null);
    setRestaurantId(null);
    // Refetch bookings after update
    refetch();
  };

  const closePayModal = () => {
    setPayModalOpen(false);
    setSelectedBooking(null);
    // Refetch bookings after payment
    refetch();
  };

  if (isLoading) return <div className="text-center py-10">Loading your bookings...</div>;
  
  if (error) return <div className="text-red-600 text-center py-10">Failed to load bookings: {error.message}</div>;
  
  if (!bookings || bookings.length === 0) {
    return <div className="text-center py-10">You don't have any bookings yet.</div>;
  }

  return (
    <div className="w-full px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-6 bg-gray-100 p-4 text-gray-600 font-medium">
          <div className="col-span-1">Customer</div>
          <div className="col-span-1">Restaurant</div>
          <div className="col-span-1">Date & Time</div>
          <div className="col-span-1">Details</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        {/* Booking Rows */}
        {bookings.map((booking) => (
          <div key={booking._id} className="border-t border-gray-200">
            <div className="grid grid-cols-6 p-4 items-center">
              {/* Customer */}
              <div className="col-span-1 flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                  {booking.userAvatar && (
                    <img 
                      src={booking.userAvatar} 
                      alt={booking.userName} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium">{booking.userName}</div>
                </div>
              </div>
              
              {/* Restaurant */}
              <div className="col-span-1 flex items-center">
                <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden mr-3">
                  {booking.restaurantImage && (
                    <img 
                      src={booking.restaurantImage} 
                      alt={booking.restaurantName} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="font-medium">{booking.restaurantName}</div>
              </div>
              
              {/* Date & Time */}
              <div className="col-span-1">
                <div>{formatDateTime(booking.date, booking.time)}</div>
              </div>
              
              {/* Details */}
              <div className="col-span-1">
                <div>Guests: {booking.guests}</div>
                <PreOrderedItems items={booking.preOrders} />
              </div>
              
              {/* Status */}
              <div className="col-span-1">
                <StatusBadge status={booking.status} />
              </div>
              
              {/* Actions */}
              <div className="col-span-1">
                <ActionButtons 
                  booking={booking}
                  onUpdate={handleUpdate}
                  onPay={handlePay}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Loading indicator while fetching restaurant data */}
      {isRestaurantLoading && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-700">Loading restaurant menu data...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Render Update Modal Component when needed */}
      {updateModalOpen && selectedBooking && (
        <CompoUpdate 
          booking={selectedBooking}
          restaurant={restaurant} // Pass the fetched restaurant data
          onClose={closeUpdateModal}
        />
      )}
      
      {/* Render Pay Modal Component when needed */}
      {payModalOpen && selectedBooking && (
        <CompoPay 
          booking={selectedBooking} 
          onClose={closePayModal}
        />
      )}
    </div>
  );
};

export default BookingsComponent;