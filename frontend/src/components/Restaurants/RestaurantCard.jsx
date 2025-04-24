import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetRestaurantsQuery } from '../../slices/apiSlice';
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Phone } from 'lucide-react';

const RestaurantCard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetRestaurantsQuery();

  // Ensure the data is an array of restaurants
  const restaurants = Array.isArray(data?.data) ? data.data : [];

  const handleViewDetails = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const handleBookTable = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}/booking`);
    // Alternatively, you could open a booking modal or handle this differently
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10">Error loading restaurants...</div>;
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-8 text-center">Top Restaurants</h2>

      {restaurants.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No restaurants found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Restaurant Image */}
              <div className="relative w-full h-44">
                <img 
                  src={restaurant.images?.[0] || "https://via.placeholder.com/400x250"} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Restaurant Info */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">{restaurant.name}</h3>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    <span className="text-sm text-gray-600">Open</span>
                  </div>
                </div>
                
                {/* Hours */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock size={16} className="mr-1" />
                  <span>Hours: {restaurant.openingHours || "Not specified"}</span>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {restaurant.description || "No description available"}
                </p>
                
                {/* Buttons */}
                <div className="flex gap-4">
                  <button 
                    className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => handleViewDetails(restaurant._id)}
                  >
                    View Details
                  </button>
                  <button 
                    className="flex-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    onClick={() => handleBookTable(restaurant._id)}
                  >
                    Book Table
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RestaurantCard;