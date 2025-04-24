// src/components/Restaurants/RestaurantTemplate.jsx
import { useState } from 'react';

export default function RestaurantTemplate({ restaurant }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Get unique categories
  const categories = ['All', ...new Set(restaurant.menuItems.map(item => item.category))];
  
  // Filter menu items by category
  const filteredMenuItems = activeCategory === 'All' 
    ? restaurant.menuItems 
    : restaurant.menuItems.filter(item => item.category === activeCategory);

  // Image gallery navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % restaurant.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + restaurant.images.length) % restaurant.images.length);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Restaurant Header */}
      <div className="bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg text-orange-400 mb-4">{restaurant.cuisine}</p>
          <p className="mb-6 max-w-2xl">{restaurant.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{restaurant.location.address}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{restaurant.openingHours}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{restaurant.contact}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant Images Gallery */}
      <div className="max-w-6xl mx-auto my-8 px-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Gallery</h2>
        <div className="relative">
          <div className="overflow-hidden rounded-lg h-96">
            <img 
              src={restaurant.images[currentImageIndex]} 
              alt={`${restaurant.name} view ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {restaurant.images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="flex justify-center mt-4 gap-2">
                {restaurant.images.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-orange-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="max-w-6xl mx-auto my-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Menu</h2>
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 mr-2 rounded-md whitespace-nowrap transition-colors ${
                activeCategory === category 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map(item => (
            <MenuItem key={item._id} item={item} />
          ))}
        </div>
      </div>
      
      {/* Customer Feedback Section */}
      <div className="max-w-6xl mx-auto my-8 px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold">Rajesh Kumar</p>
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <span className="text-gray-500 text-sm">2 days ago</span>
          </div>
          <p className="text-gray-700">Amazing food and great service! The burger was juicy and the fries were perfectly crispy. Will definitely come back again.</p>
        </div>
      </div>
    </div>
  );
}

// Menu Item Component (used within RestaurantTemplate)
function MenuItem({ item }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Item Images */}
      <div className="relative h-48">
        {item.images && item.images.length > 0 ? (
          <>
            <img 
              src={item.images[currentImageIndex]} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
            
            {item.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        <div className="absolute bottom-0 right-0 bg-orange-600 text-white px-3 py-1 font-bold">
          ₹{item.price}
        </div>
      </div>
      
      {/* Item Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
        <p className="text-gray-700 text-sm">{item.description}</p>
      </div>
    </div>
  );
}