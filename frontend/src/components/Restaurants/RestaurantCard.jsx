import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetRestaurantsQuery } from '../../slices/apiSlice';
import { ChevronLeft, ChevronRight, Star, MapPin, Clock, Phone, X } from 'lucide-react';

const RestaurantCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, error, refetch } = useGetRestaurantsQuery();
  
  // Extract the keyword from the query string
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  
  // Ensure the data is an array of restaurants
  const restaurants = Array.isArray(data?.data) ? data.data : [];
  
  // Filter restaurants based on search keyword
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (!keyword) return true; // Show all restaurants if no keyword
    
    // Search by restaurant name (case insensitive)
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase());
  });

  const handleViewDetails = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const handleClearSearch = () => {
    navigate('/');
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10">Error loading restaurants...</div>;
  }

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      {/* Search indicator with clear button */}
      {keyword && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-blue-800">
                Search Results for "{keyword}"
              </h2>
              <p className="text-blue-600 mt-1">
                Found {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleClearSearch}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <X size={16} />
              Clear Search
            </button>
          </div>
        </div>
      )}
      
      {!keyword && (
        <h2 className="text-3xl font-semibold mb-8 text-center">Top Restaurants</h2>
      )}

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {keyword ? 'No restaurants found' : 'No restaurants available'}
            </h3>
            <p className="text-gray-500 mb-6">
              {keyword 
                ? `We couldn't find any restaurants matching "${keyword}". Try a different search term.`
                : 'No restaurants are currently available.'
              }
            </p>
            {keyword && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                View All Restaurants
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[420px] w-full transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* Restaurant Image */}
              <div className="relative w-full h-60">
                <img
                  src={restaurant.images?.[0] || "https://via.placeholder.com/400x250"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                {keyword && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Search Result
                  </div>
                )}
              </div>
                            
              {/* Restaurant Info */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">
                    {keyword ? (
                      // Highlight the search term in the restaurant name
                      restaurant.name.split(new RegExp(`(${keyword})`, 'gi')).map((part, index) =>
                        part.toLowerCase() === keyword.toLowerCase() ? (
                          <span key={index} className="bg-yellow-200 font-semibold px-1 rounded">{part}</span>
                        ) : (
                          part
                        )
                      )
                    ) : (
                      restaurant.name
                    )}
                  </h3>
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
                                
                {/* Single Button */}
                <div className="flex justify-center">
                  <button
                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    onClick={() => handleViewDetails(restaurant._id)}
                  >
                    View Details
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