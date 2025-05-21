// import React, { useState } from 'react';
// import { Trash2 } from 'lucide-react';

// // UI Components for the BookingComponent
// export const BookingUIComponents = {
//   // Action buttons component for different booking statuses
//   ActionButtons: ({ booking, onUpdate, onPay, onCancel, onDelete }) => {
//     // Only show delete button for pending and cancelled statuses
//     const renderDeleteButton = booking.status === 'pending' || booking.status === 'cancelled';
    
//     if (booking.status === 'pending') {
//       return (
//         <div className="flex gap-2 items-center">
//           {renderDeleteButton && (
//             <button
//               onClick={() => onDelete(booking)}
//               className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200 mr-1"
//               title="Delete booking"
//             >
//               <Trash2 size={18} />
//             </button>
//           )}
//           <button
//             onClick={() => onUpdate(booking)}
//             className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
//           >
//             Update
//           </button>
//           <button
//             onClick={() => onCancel(booking)}
//             className="bg-red-400 hover:bg-red-500 text-white py-1 px-4 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       );
//     } else if (booking.status === 'confirmed') {
//       return (
//         <div className="flex gap-2">
//           <button
//             onClick={() => onPay(booking)}
//             className="bg-green-500 hover:bg-green-600 text-white py-1 px-7 rounded"
//           >
//             Pay
//           </button>
//           <button
//             onClick={() => onCancel(booking)}
//             className="bg-red-400 hover:bg-red-500 text-white py-1 px-4 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       );
//     } else if (booking.status === 'cancelled') {
//       return (
//         <div className="flex items-center gap-2">
//           {renderDeleteButton && (
//             <button
//               onClick={() => onDelete(booking)}
//               className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200 mr-1"
//               title="Delete booking"
//             >
//               <Trash2 size={18} />
//             </button>
//           )}
//           <div className="text-red-500 font-medium">
//             Cancelled
//           </div>
//         </div>
//       );
//     }
    
//     // For any other status, return null or a placeholder
//     return null;
//   },

//   // Component to display pre-ordered items with collapsible view
//   PreOrderedItems: ({ items }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     if (!items || items.length === 0) return null;

//     const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//     return (
//       <div className="mt-2">
//         <div className="flex items-center gap-1">
//           <span>{items.length} pre-ordered {items.length === 1 ? 'item' : 'items'}</span>
//           <button 
//             onClick={() => setIsOpen(!isOpen)} 
//             className="text-blue-500 hover:underline text-sm flex items-center"
//           >
//             {isOpen ? 'Hide details' : 'View details'} 
//             <svg 
//               className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>
//         </div>

//         {isOpen && (
//           <div className="mt-2 border rounded-md p-3 bg-white">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left text-gray-600">
//                   <th className="py-1">Item</th>
//                   <th className="py-1 text-center">Qty</th>
//                   <th className="py-1 text-right">Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {items.map((item, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="py-2">{item.name}</td>
//                     <td className="py-2 text-center">{item.quantity}</td>
//                     <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
//                   </tr>
//                 ))}
//                 <tr className="border-t font-medium">
//                   <td colSpan="2" className="py-2">Total</td>
//                   <td className="py-2 text-right">${totalPrice.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     );
//   },

//   // Component to display status with appropriate styling
//   StatusBadge: ({ status }) => {
//     let bgColor = '';
    
//     switch (status) {
//       case 'confirmed':
//         bgColor = 'bg-green-100 text-green-800';
//         break;
//       case 'pending':
//         bgColor = 'bg-yellow-100 text-yellow-800';
//         break;
//       case 'cancelled':
//         bgColor = 'bg-red-100 text-red-800';
//         break;
//       default:
//         bgColor = 'bg-gray-100 text-gray-800';
//     }
    
//     return (
//       <span className={`${bgColor} px-3 py-1 rounded-full text-sm capitalize`}>
//         {status}
//       </span>
//     );
//   }
// };

// export default BookingUIComponents;


import React, { useState } from 'react';
import { Trash2, CheckCircle } from 'lucide-react';

// UI Components for the BookingComponent
export const BookingUIComponents = {
  // Action buttons component for different booking statuses
  ActionButtons: ({ booking, onUpdate, onPay, onCancel, onDelete }) => {
    // Only show delete button for pending and cancelled statuses
    const renderDeleteButton = booking.status === 'pending' || booking.status === 'cancelled';
    
    // Check if booking is already paid
    const isPaid = booking.paymentStatus === 'success';
    
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
          {/* Only show Pay button if not already paid */}
          {!isPaid ? (
            <button
              onClick={() => onPay(booking)}
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-7 rounded"
            >
              Pay
            </button>
          ) : (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle size={18} className="text-green-500" />
              <span className="font-medium">Paid</span>
            </div>
          )}
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
  },

  // Component to display pre-ordered items with collapsible view
  PreOrderedItems: ({ items }) => {
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
  },

  // Component to display status with appropriate styling
  StatusBadge: ({ status }) => {
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
  },
  
  // New component to display payment status badge
  PaymentStatusBadge: ({ paymentStatus }) => {
    if (paymentStatus !== 'success') return null;
    
    return (
      <div className="flex items-center mt-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={14} className="mr-1" />
          Paid
        </span>
      </div>
    );
  }
};

export default BookingUIComponents;