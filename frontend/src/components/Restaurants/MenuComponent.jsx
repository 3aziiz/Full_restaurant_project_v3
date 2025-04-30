import { useState } from 'react';

export default function MenuComponent({ menuItems }) {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Handle case where menuItems might not exist
  const menu = menuItems || [];
  
  // Get unique categories
  const categories = ['All', ...new Set(menu.map(item => item.category))];
  
  // Filter menu items by category
  const filteredMenuItems = activeCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Our Menu</h2>
        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${
                activeCategory === category 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMenuItems.map(item => (
          <MenuItem key={item._id || Math.random().toString()} item={item} />
        ))}
      </div>
    </div>
  );
}

// Menu Item Component
function MenuItem({ item }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = item.images || [];
  
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
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition group">
      {/* Item Images */}
      <div className="relative h-48">
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                  {images.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </> 
            )}
            
            {item.popular && (
              <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                Popular
              </div>
            )}
            
            <div className="absolute bottom-2 right-2 bg-orange-600 text-white font-bold px-3 py-1 rounded-full">
              ${item.price?.toFixed(2) || 'N/A'}
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      {/* Item Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name || 'Unnamed Item'}</h3>
        <p className="text-sm text-orange-600 mb-2">{item.category || 'Uncategorized'}</p>
        <p className="text-gray-600 text-sm line-clamp-2">{item.description || 'No description available'}</p>
      </div>
    </div>
  );
}