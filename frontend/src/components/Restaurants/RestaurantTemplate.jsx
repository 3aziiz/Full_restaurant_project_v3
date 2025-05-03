  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import CustomerReviews from './CustomerReviews';
  import MenuComponent from './MenuComponent';
  import BookingComponent from './BookingComponent'; // Import the new BookingComponent

  export default function RestaurantTemplate({ restaurant, refetchRestaurant }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();
    
    // Handle case where restaurant might be undefined during initial render
    if (!restaurant) {
      return <div>Loading...</div>;
    }

    // Handle case where images might not exist - make sure this is properly defined
    const images = restaurant.images || [];

    // Image gallery navigation
    const nextImage = () => {
      if (images.length > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
    };
    
    const prevImage = () => {
      if (images.length > 0) {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    return (
      <div className="bg-white min-h-screen">
        {/* Hero Section with Main Image */}
        <div className="relative h-[500px] w-full z-0">        <div className="absolute inset-0 bg-black/40 z-10"></div>
          
          <img 
            src={images[currentImageIndex] || "/api/placeholder/1200/500"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          
          {/* Image Controls */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full z-20 transition-all"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full z-20 transition-all"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-8 z-20">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center mb-2">
                <p className="text-orange-400 font-medium mr-4">{restaurant.cuisine}</p>
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill={i < Math.floor(restaurant.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm">{restaurant.rating} ({restaurant.reviews?.length || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-28 left-0 right-0 px-8 z-30">
              <div className="max-w-6xl mx-auto">
                <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
                  {images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-orange-500 scale-110' : 'border-transparent opacity-80'
                      }`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 ml-8 mt-10">
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors font-semibold"
          >
            Go Back
          </button>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Info & Description */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">About {restaurant.name}</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">{restaurant.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{restaurant.location?.address || 'Address not available'}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{restaurant.openingHours || 'Hours not available'}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{restaurant.contact || 'Contact not available'}</span>
                  </div>
                </div>
              </div>
              
              {/* Menu Section - Use the extracted MenuComponent */}
              {restaurant.menuItems && restaurant.menuItems.length > 0 && (
                <MenuComponent menuItems={restaurant.menuItems} />
              )}
              
              {/* Customer Reviews Section */}
              <CustomerReviews restaurant={restaurant} refetchRestaurant={refetchRestaurant} />
            </div>
            
            {/* Right Column - Action Block - Use the extracted BookingComponent */}
            <div className="lg:col-span-1">
              <BookingComponent restaurant={restaurant} />
            </div>
          </div>
        </div>
      </div>
    );
  }