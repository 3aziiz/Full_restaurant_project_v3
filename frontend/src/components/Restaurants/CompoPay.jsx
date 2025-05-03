import React, { useState } from 'react';
import { usePayBookingMutation } from '../../slices/apiSlice';

const CompoPay = ({ booking, onClose }) => {
  const [payBooking, { isLoading }] = usePayBookingMutation();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Calculate total amount to pay
  const calculateTotal = () => {
    let total = 0;
    
    // Add pre-order items if they exist
    if (booking.preOrders && booking.preOrders.length > 0) {
      total += booking.preOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    // Add booking fee if applicable
    if (booking.bookingFee) {
      total += booking.bookingFee;
    }
    
    return total.toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    // Format card number to 4-digit groups
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value;
    
    // Remove non-digits
    value = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Basic validation
    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      setFormError('Please enter a valid card number');
      return;
    }

    if (formData.expiryDate.length < 5) {
      setFormError('Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (formData.cvv.length < 3) {
      setFormError('Please enter a valid CVV');
      return;
    }

    if (formData.nameOnCard.trim().length < 3) {
      setFormError('Please enter the name as it appears on your card');
      return;
    }

    try {
      // Call API to process payment
      await payBooking({
        bookingId: booking._id,
        paymentDetails: {
          // Don't send sensitive card info in a real app!
          // This is for demonstration only
          cardLast4: formData.cardNumber.slice(-4),
          nameOnCard: formData.nameOnCard,
          amount: calculateTotal()
        }
      }).unwrap();

      // Show success message
      setFormSuccess('Payment processed successfully!');
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Payment failed:', err);
      setFormError(err.data?.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
            {booking.preOrders && booking.preOrders.length > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span>Pre-ordered Items:</span>
                <span className="font-medium">{booking.preOrders.length} items</span>
              </div>
            )}
            <div className="border-t mt-2 pt-2 flex justify-between font-medium">
              <span>Total Amount:</span>
              <span className="text-green-700">${calculateTotal()}</span>
            </div>
          </div>
        </div>
        
        {formError && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {formError}
          </div>
        )}
        
        {formSuccess && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {formSuccess}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="cardNumber">
              Card Number*
            </label>
            <input 
              type="text" 
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="expiryDate">
                Expiry Date*
              </label>
              <input 
                type="text" 
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength="5"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="cvv">
                CVV/CVC*
              </label>
              <input 
                type="password" 
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength="4"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="nameOnCard">
              Name on Card*
            </label>
            <input 
              type="text" 
              id="nameOnCard"
              name="nameOnCard"
              value={formData.nameOnCard}
              onChange={handleChange}
              placeholder="John Smith"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white transition-colors flex items-center"
              disabled={isLoading || formSuccess}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </>
              ) : 'Pay Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompoPay;