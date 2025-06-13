// CompoPay.jsx
import React, { useState } from 'react';
import { usePayBookingMutation } from '../../slices/apiSlice';
import { toast } from 'react-toastify';

const CompoPay = ({ 
  booking, 
  onClose, 
  verificationStatus, 
  verificationError, 
  onRetryVerification,
  isVerifyLoading 
}) => {
  const [payBooking, { isLoading: isPayLoading }] = usePayBookingMutation();
  const [error, setError] = useState('');

  // Calculate the total payment amount
  const calculateTotal = () => {
    let total = 0;
    try {
      if (booking.preOrders?.length > 0) {
        total += booking.preOrders.reduce((sum, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 1;
          return sum + (price * quantity);
        }, 0);
      }
      if (booking.bookingFee) {
        total += parseFloat(booking.bookingFee) || 0;
      }
      // Fallback to booking.price if no items or fee are present
      if (total === 0 && booking.price) {
        total = parseFloat(booking.price) || 0;
      }
      // Final fallback to totalPrice
      if (total === 0 && booking.totalPrice) {
        total = parseFloat(booking.totalPrice) || 0;
      }
      return total.toFixed(2);
    } catch (err) {
      console.error('Error calculating total:', err);
      return '0.00';
    }
  };

  // Handle initiating payment (remains in CompoPay)
  const handlePay = async () => {
    console.log('==== HANDLE PAY DEBUG INFO ====');
    setError('');
    try {
      console.log('Initiating payment for booking:', booking._id);
      const res = await payBooking({ bookingId: booking._id }).unwrap();
      console.log('Payment initiation API response:', res);

      if (res.success && res.paymentUrl) {
        // Store the payment ID in localStorage to use when returning
        if (res.paymentId) {
          console.log('Storing payment ID in localStorage:', res.paymentId);
          // Store with booking ID as key
          localStorage.setItem(`payment_id_${booking._id}`, res.paymentId);
          // Also store with a generic key as fallback
          localStorage.setItem('last_payment_id', res.paymentId);
          console.log('Payment ID stored for verification');
        } else {
          console.error('WARNING: No paymentId returned from API!');
        }
        
        toast.info('Redirecting to Flouci...', {
          position: "top-right",
          autoClose: 2000,
        });
        
        // Redirect to Flouci payment page
        console.log('Redirecting to payment URL:', res.paymentUrl);
        window.location.href = res.paymentUrl;
      } else {
        console.error('Payment initiation failed - API returned success=false or no paymentUrl');
        setError('Payment initiation failed.');
        toast.error('Payment initiation failed. Please try again.', {
          position: "top-right"
        });
      }
    } catch (err) {
      console.error('Payment initiation API error:', err);
      const errorMessage = err?.data?.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right"
      });
    }
    console.log('==================================');
  };

  // Check if booking is already paid
  const isAlreadyPaid = () => {
    const status = (booking.paymentStatus || '').toLowerCase();
    return ['paid', 'success', 'completed'].includes(status);
  };

  // Render payment status message when verifying or completed
  const renderPaymentStatus = () => {
    if (verificationStatus === 'verifying') {
      return (
        <div className="bg-blue-100 text-blue-600 p-3 rounded mb-4 flex items-center">
          <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Verifying your payment...
        </div>
      );
    } else if (verificationStatus === 'success' || isAlreadyPaid()) {
      return (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Payment completed successfully! This window will close automatically.
        </div>
      );
    } else if (verificationStatus === 'failed') {
      return (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          Payment verification failed. Please try again or contact support.
          {verificationError && <div className="mt-2 text-sm">{verificationError}</div>}
        </div>
      );
    }
    return null;
  };

  const isLoading = isPayLoading || isVerifyLoading || verificationStatus === 'verifying';
  const isCompleted = verificationStatus === 'success' || isAlreadyPaid();

  // Retry verification button
  const renderManualVerificationButton = () => {
    if (verificationStatus === 'failed') {
      return (
        <button
          onClick={onRetryVerification}
          className="mt-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition-colors"
          disabled={isVerifyLoading}
        >
          Retry Verification
        </button>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isCompleted ? 'Payment Complete' : 'Confirm Payment'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700" 
            aria-label="Close"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {renderPaymentStatus()}

        <div className="mb-6">
          <h3 className="font-medium text-gray-700">Payment Summary</h3>
          <div className="mt-2 bg-gray-50 p-3 rounded">
            <div className="flex justify-between text-sm mb-1">
              <span>Restaurant:</span>
              <span className="font-medium">{booking.restaurantName}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Date & Time:</span>
              <span className="font-medium">
                {new Date(booking.date).toLocaleDateString()} {booking.time}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Guests:</span>
              <span className="font-medium">{booking.guests}</span>
            </div>
            {booking.preOrders?.length > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span>Pre-ordered Items:</span>
                <span className="font-medium">{booking.preOrders.length} items</span>
              </div>
            )}
            <div className="border-t mt-2 pt-2 flex justify-between font-medium">
              <span>Total Amount:</span>
              <span className="text-green-700">DT{calculateTotal()}</span>
            </div>
            {isCompleted && (
              <div className="mt-2 pt-2 text-green-600 font-medium text-center">
                Payment Status: Paid
                {booking.paymentType && (
                  <span className="ml-2 text-gray-600 text-sm">
                    ({booking.paymentType === 'card' ? 'Credit Card' : 'Flouci Wallet'})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {error && !renderPaymentStatus() && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {renderManualVerificationButton()}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800 transition-colors"
            disabled={isLoading}
          >
            {isCompleted ? 'Close' : 'Cancel'}
          </button>
          
          {!isCompleted && verificationStatus !== 'verifying' && verificationStatus !== 'failed' && (
            <button
              onClick={handlePay}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Redirecting...
                </>
              ) : 'Pay with Flouci'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompoPay;

