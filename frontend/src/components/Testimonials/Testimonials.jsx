import React, { useState, useEffect } from 'react';
import { useGetRestaurantsQuery } from '../../slices/apiSlice';
import { ChevronLeft, ChevronRight, Star, Quote, Heart } from 'lucide-react';

const RestaurantTestimonials = () => {
  const { data, isLoading, error } = useGetRestaurantsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Ensure the data is an array of restaurants
  const restaurants = Array.isArray(data?.data) ? data.data : [];
  
  // Collect all reviews from all restaurants
  const allReviews = [];
  restaurants.forEach(restaurant => {
    if (restaurant.reviews && Array.isArray(restaurant.reviews)) {
      restaurant.reviews.forEach(review => {
        allReviews.push({
          ...review,
          restaurantName: restaurant.name,
          restaurantId: restaurant._id,
          restaurantImage: restaurant.images?.[0] || null
        });
      });
    }
  });

  // Auto-advance testimonials
  useEffect(() => {
    if (allReviews.length > 1) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [allReviews.length, currentIndex]);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === allReviews.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? allReviews.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToTestimonial = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const renderStars = (rating) => {
    const stars = [];
    const maxStars = 5;
    
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Star
          key={i}
          size={24}
          className={`transition-all duration-300 ${
            i <= rating 
              ? 'text-amber-400 fill-amber-400 drop-shadow-sm' 
              : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 py-20">
        <div className="flex justify-center items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 text-lg font-medium">Unable to load testimonials</p>
          <p className="text-red-400 text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (allReviews.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Quote className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No reviews available yet</p>
          <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  const currentReview = allReviews[currentIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 2px, transparent 2px), radial-gradient(circle at 75% 75%, #059669 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mb-4 shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Discover why food lovers trust us for their dining experiences
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Testimonial Card */}
          <div className={`relative transition-all duration-500 transform ${
            isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
          }`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-300/10 to-emerald-300/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                {/* Restaurant Image */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl ring-3 ring-white/50 mx-auto">
                      <img
                        src={currentReview.restaurantImage || "https://via.placeholder.com/64x64"}
                        alt={currentReview.restaurantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Quote size={12} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Stars Rating */}
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1 p-2 bg-white/60 rounded-full shadow-lg backdrop-blur-sm">
                    {renderStars(currentReview.rating)}
                  </div>
                </div>

                {/* Review Comment */}
                <div className="text-center mb-8">
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium italic max-w-3xl mx-auto">
                    "{currentReview.comment}"
                  </blockquote>
                </div>

                {/* Customer Info */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-3">
                    {currentReview.userAvatar ? (
                      <img
                        src={currentReview.userAvatar}
                        alt={currentReview.userName}
                        className="w-10 h-10 rounded-full object-cover mr-3 ring-2 ring-white shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mr-3 shadow-md ring-2 ring-white">
                        <span className="text-white font-bold text-sm">
                          {currentReview.userName ? currentReview.userName.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-bold text-gray-800 text-base">
                        {currentReview.userName || 'Anonymous Customer'}
                      </p>
                      <p className="text-green-600 font-semibold text-sm">
                        {currentReview.restaurantName}
                      </p>
                    </div>
                  </div>
                  {currentReview.date && (
                    <p className="text-gray-500 text-xs bg-white/60 px-3 py-1 rounded-full">
                      {new Date(currentReview.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {allReviews.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                disabled={isAnimating}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} className="text-gray-600 group-hover:text-green-500 transition-colors" />
              </button>

              <button
                onClick={nextTestimonial}
                disabled={isAnimating}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} className="text-gray-600 group-hover:text-green-500 transition-colors" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {allReviews.length > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            {allReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? 'w-8 h-3 bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
                    : 'w-3 h-3 bg-white/60 hover:bg-white shadow-md hover:scale-110'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="text-center group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold text-white">{allReviews.length}</span>
              </div>
              <p className="text-gray-600 font-semibold text-base">Happy Customers</p>
              <p className="text-gray-500 text-sm mt-1">Satisfied diners</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 font-semibold text-base">Trusted Reviews</p>
              <p className="text-gray-500 text-sm mt-1">Authentic experiences</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantTestimonials;