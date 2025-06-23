// BookingsComponent.jsx
import React, { useEffect, useState } from 'react';
import { 
  useGetUserBookingsQuery, 
  useCancelBookingMutation,
  useDeleteBookingMutation,
  useGetRestaurantByIdQuery,
  useVerifyPaymentMutation
} from '../../slices/apiSlice';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import CompoUpdate from './CompoUpdate';
import CompoPay from './CompoPay';
import { BookingUIComponents } from './BookingUIComponents';
import { toast } from 'react-toastify';

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type }) => {
  if (!isOpen) return null;

  const getButtonColors = () => {
    switch (type) {
      case 'delete':
        return 'bg-red-600 hover:bg-red-700';
      case 'cancel':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              {cancelText || 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-md transition-colors ${getButtonColors()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main BookingsComponent
const BookingsComponent = () => {
  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: bookings, isLoading, error, refetch } = useGetUserBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const [verifyPayment, { isLoading: isVerifyLoading }] = useVerifyPaymentMutation();
  
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verificationError, setVerificationError] = useState('');
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null,
    booking: null,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: null
  });
  
  const [restaurantId, setRestaurantId] = useState(null);
  
  const { 
    data: restaurant, 
    isLoading: isRestaurantLoading,
    isSuccess: isRestaurantSuccess
  } = useGetRestaurantByIdQuery(restaurantId, {
    skip: !restaurantId,
  });

  useEffect(() => {
    refetch();
    
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');
    const status = queryParams.get('status');
    const bookingId = queryParams.get('bookingId');
    
    const isReturnFromPayment = 
      queryParams.get('payment') === 'return' || 
      (status && (status === 'success' || status === 'fail')) ||
      (success === 'true' || success === 'false') ||
      location.pathname.includes('/booking/success') ||
      location.pathname.includes('/booking/failed');
      
    console.log('Is return from payment gateway:', isReturnFromPayment);
    console.log('URL parameters:', { success, status, bookingId });
    
    if (isReturnFromPayment && bookingId) {
      console.log('Detected return from payment gateway with bookingId:', bookingId);
      
      const booking = bookings?.find(b => b._id === bookingId);
      
      if (booking) {
        console.log('Found matching booking:', booking._id);
        setSelectedBooking(booking);
        
        const paymentId = localStorage.getItem(`payment_id_${bookingId}`) || 
                          localStorage.getItem('last_payment_id');
        
        if (paymentId) {
          console.log('Found payment ID in localStorage:', paymentId);
          setVerificationStatus('verifying');
          handleVerifyPayment(paymentId, booking);
        } else {
          console.error('No payment ID found for verification');
          setVerificationStatus('failed');
          setVerificationError('Payment verification failed: Missing payment ID');
        }
        
        setPayModalOpen(true);
      } else {
        console.error('Could not find booking with ID:', bookingId);
      }
    }
  }, [refetch, location.search, location.pathname, bookings]);

  const handleVerifyPayment = async (paymentId, booking) => {
    console.log('==== VERIFY PAYMENT DEBUG INFO ====');
    console.log('handleVerifyPayment called with paymentId:', paymentId);
    
    if (!paymentId) {
      console.error('No payment ID available for verification');
      setVerificationStatus('failed');
      setVerificationError('Payment verification failed: Missing payment ID');
      return;
    }
    
    try {
      console.log('Calling verifyPayment API with payload:', { paymentId });
      const res = await verifyPayment({ paymentId }).unwrap();
      console.log('Payment verification API response:', res);
      
      if (res.success) {
        console.log('Payment verification successful!');
        setVerificationStatus('success');
        
        toast.success('Payment completed successfully!', {
          position: "top-right"
        });
        
        refetch();
        
        setTimeout(() => {
          setPayModalOpen(false);
          setSelectedBooking(null);
          navigate('/bookings', { replace: true });
        }, 3000);
      } else {
        console.log('Payment verification API returned failure:', res);
        setVerificationStatus('failed');
        setVerificationError(res.message || 'Payment verification failed.');
        toast.error('Payment failed. Please try again.', {
          position: "top-right"
        });
      }
    } catch (err) {
      console.error('Payment verification API error:', err);
      setVerificationStatus('failed');
      const errorMessage = err?.data?.message || 'Payment verification failed. Please try again.';
      setVerificationError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right"
      });
    }
    
    if (booking?._id) {
      localStorage.removeItem(`payment_id_${booking._id}`);
    }
    localStorage.removeItem('last_payment_id');
    console.log('Removed payment IDs from localStorage');
    console.log('==================================');
  };

  const handleUpdate = (booking) => {
    setSelectedBooking(booking);
    
    if (booking && booking.restaurantId) {
      setRestaurantId(booking.restaurantId);
    } else if (booking && booking.restaurant && booking.restaurant._id) {
      setRestaurantId(booking.restaurant._id);
    }
    
    if (!booking.restaurantId && (!booking.restaurant || !booking.restaurant._id)) {
      setUpdateModalOpen(true);
    }
  };

  useEffect(() => {
    if (selectedBooking && restaurant && isRestaurantSuccess) {
      setUpdateModalOpen(true);
    }
  }, [selectedBooking, restaurant, isRestaurantSuccess]);

  const handlePay = (booking) => {
    setSelectedBooking(booking);
    setPayModalOpen(true);
    setVerificationStatus('');
    setVerificationError('');
  };

  // Show confirmation modal for cancel
  const handleCancelConfirmation = (booking) => {
    setConfirmationModal({
      isOpen: true,
      type: 'cancel',
      booking: booking,
      title: 'Cancel Booking',
      message: `Are you sure you want to cancel your booking at ${booking.restaurantName} on ${formatDateTime(booking.date, booking.time)}? This action cannot be undone.`,
      confirmText: 'Cancel Booking',
      onConfirm: () => confirmCancelBooking(booking)
    });
  };

  // Show confirmation modal for delete
  const handleDeleteConfirmation = (booking) => {
    setConfirmationModal({
      isOpen: true,
      type: 'delete',
      booking: booking,
      title: 'Delete Booking',
      message: `Are you sure you want to permanently delete your booking at ${booking.restaurantName}? This action cannot be undone and all booking data will be lost.`,
      confirmText: 'Delete Booking',
      onConfirm: () => confirmDeleteBooking(booking)
    });
  };

  // Actual cancel booking function
  const confirmCancelBooking = async (booking) => {
    try {
      await cancelBooking(booking._id).unwrap();
      toast.success('Booking cancelled successfully!', {
        position: "top-right"
      });
      refetch();
      closeConfirmationModal();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error('Failed to cancel booking. Please try again.', {
        position: "top-right"
      });
      closeConfirmationModal();
    }
  };

  // Actual delete booking function
  const confirmDeleteBooking = async (booking) => {
    try {
      await deleteBooking(booking._id).unwrap();
      toast.success('Booking deleted successfully!', {
        position: "top-right"
      });
      refetch();
      closeConfirmationModal();
    } catch (err) {
      console.error("Error deleting booking:", err);
      toast.error('Failed to delete booking. Please try again.', {
        position: "top-right"
      });
      closeConfirmationModal();
    }
  };

  // Close confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      booking: null,
      title: '',
      message: '',
      confirmText: '',
      onConfirm: null
    });
  };

  const formatDateTime = (date, time) => {
    try {
      const dateObj = new Date(date);
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
    refetch();
  };

  const closePayModal = () => {
    setPayModalOpen(false);
    setSelectedBooking(null);
    setVerificationStatus('');
    setVerificationError('');
    refetch();
    
    if (location.search.includes('success') || location.search.includes('bookingId')) {
      navigate('/bookings', { replace: true });
    }
  };

  const handleRetryVerification = () => {
    if (!selectedBooking) return;
    
    const paymentId = localStorage.getItem(`payment_id_${selectedBooking._id}`) || 
                      localStorage.getItem('last_payment_id');
                      
    if (paymentId) {
      setVerificationStatus('verifying');
      handleVerifyPayment(paymentId, selectedBooking);
    } else {
      setVerificationError('No payment ID found for verification');
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading your bookings...</div>;
  
  if (error) return <div className="text-red-600 text-center py-10">Failed to load bookings: {error.message}</div>;
  
  if (!bookings || bookings.length === 0) {
    return <div className="text-center py-10">You don't have any bookings yet.</div>;
  }

  const { ActionButtons, StatusBadge, PreOrderedItems, PaymentStatusBadge } = BookingUIComponents;

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
                
                {/* Improved payment status indicator */}
                <PaymentStatusBadge paymentStatus={booking.paymentStatus} />
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
                  onCancel={handleCancelConfirmation}  // Changed to confirmation handler
                  onDelete={handleDeleteConfirmation}  // Changed to confirmation handler
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
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        type={confirmationModal.type}
      />
      
      {/* Render Update Modal Component when needed */}
      {updateModalOpen && selectedBooking && (
        <CompoUpdate 
          booking={selectedBooking}
          restaurant={restaurant}
          onClose={closeUpdateModal}
        />
      )}
      
      {/* Render Pay Modal Component when needed */}
      {payModalOpen && selectedBooking && (
        <CompoPay 
          booking={selectedBooking} 
          onClose={closePayModal}
          verificationStatus={verificationStatus}
          verificationError={verificationError}
          onRetryVerification={handleRetryVerification}
          isVerifyLoading={isVerifyLoading}
        />
      )}
    </div>
  );
};

export default BookingsComponent;