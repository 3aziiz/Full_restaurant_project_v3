import { useState } from 'react';
import { Clock, Calendar, Users, Phone, FileText, ShoppingBag, Edit, Trash2, CreditCard, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
// Import your RTK Query hooks
import { 
    useGetUserBookingsQuery, 
    useUpdateBookingMutation, 
    useCancelBookingMutation,
    useProcessPaymentMutation
  } from '../../slices/apiSlice';
  
// User Bookings Component with RTK Query
export default function UserBookings() {
  // RTK Query hooks for fetching and managing bookings
  const { data: bookings, isLoading, refetch } = useGetUserBookingsQuery();
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useCancelBookingMutation();
  const [processPayment, { isLoading: isProcessingPayment }] = useProcessPaymentMutation();

  // State for tracking which booking to update or process payment for
  const [currentBookingId, setCurrentBookingId] = useState(null);
  
  // These state variables will control the visibility of the modals
  // that will be implemented as separate components later
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Handle opening update modal
  const handleUpdateClick = (bookingId) => {
    setCurrentBookingId(bookingId);
    setShowUpdateModal(true);
    // The actual UpdateBookingForm component will be rendered elsewhere
  };

  // Handle opening payment modal
  const handlePaymentClick = (bookingId) => {
    setCurrentBookingId(bookingId);
    setShowPaymentModal(true);
    // The actual PaymentForm component will be rendered elsewhere
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await deleteBooking(bookingId).unwrap();
        refetch(); // Refresh the booking list
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  // Calculate total price of pre-orders
  const calculateTotal = (preOrders) => {
    return preOrders.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      
      {bookings?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings?.map((booking) => (
            <div 
              key={booking._id} 
              className="border rounded-lg overflow-hidden shadow-md bg-white"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">{booking.restaurantName}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{booking.time}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{booking.phoneNumber}</span>
                  </div>
                  
                  {booking.specialRequests && (
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 mr-2 mt-0.5 text-gray-500" />
                      <span>{booking.specialRequests}</span>
                    </div>
                  )}
                </div>
                
                {booking.preOrders && booking.preOrders.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <ShoppingBag className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="font-medium">Pre-ordered Items</span>
                    </div>
                    
                    <div className="pl-7 space-y-1">
                      {booking.preOrders.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-1 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${calculateTotal(booking.preOrders)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateClick(booking._id)}
                        className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        disabled={isUpdating}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update
                      </button>
                      
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'approved' && (
                    <button
                      onClick={() => handlePaymentClick(booking._id)}
                      className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      disabled={isProcessingPayment}
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 
        The UpdateBookingForm and PaymentForm components will be implemented separately
        We're just managing their visibility state here
      */}
      {showUpdateModal && currentBookingId && (
        <UpdateBookingForm 
          bookingId={currentBookingId}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={() => {
            setShowUpdateModal(false);
            refetch();
          }}
        />
      )}
      
      {showPaymentModal && currentBookingId && (
        <PaymentForm
          bookingId={currentBookingId}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}