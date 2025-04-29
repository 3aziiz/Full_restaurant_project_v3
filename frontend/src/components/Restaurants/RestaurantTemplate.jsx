import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddReviewMutation, useDeleteReviewMutation, useUpdateReviewMutation } from '../../slices/apiSlice';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
export default function RestaurantTemplate({ restaurant, refetchRestaurant }) {
  // Get userInfo from Redux state
  const { userInfo } = useSelector((state) => state.auth);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  
  // Added state to force re-render when data changes
  const [reviewsUpdated, setReviewsUpdated] = useState(false);
  
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  
  const navigate = useNavigate();
  
  // Effect to refetch restaurant data when review operations complete
  useEffect(() => {
    if (reviewsUpdated) {
      const fetchLatestData = async () => {
        await refetchRestaurant();
        setReviewsUpdated(false);
      };
      
      fetchLatestData();
    }
  }, [reviewsUpdated, refetchRestaurant]);
  
  // Handle case where restaurant might be undefined during initial render
  if (!restaurant) {
    return <div>Loading...</div>;
  }
  
  // Handle case where menuItems might not exist
  const menuItems = restaurant.menuItems || [];
  
  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  // Filter menu items by category
  const filteredMenuItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

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

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleEditReview = (review) => {
    setNewReview({
      rating: review.rating,
      comment: review.comment,
      
    });
  
    setIsEditing(true);
    setCurrentReviewId(review._id);
  
    // Optional: Scroll to the form smoothly
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Cancel editing a review
  const cancelEdit = () => {
    setNewReview({ rating: 5, comment: '' });
    setIsEditing(false);
    setCurrentReviewId(null);
  };

  // Submit a new review
  const submitReview = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!userInfo) {
      alert("Please login to leave a review");
      return;
    }
    
    if (!newReview.comment.trim()) {
      alert("Please write a comment before submitting");
      return;
    }
    
    try {
      // Extract all necessary user information from userInfo
      const reviewData = {
        // User information
        user: userInfo._id,          // MongoDB ObjectId reference
        userId: userInfo._id,        // Duplicate for compatibility
        userName: userInfo.name,     // User's name
        userAvatar: userInfo.avatar || '', // User's avatar or empty string if not available
        
        // Review content
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date()
      };
      
      // Send complete review data to the server for a new review
      await addReview({
        restaurantId: restaurant._id,
        reviewData
      }).unwrap();
      
      // Success message
      toast.success("Review submitted successfully!");
      setIsEditing(false);
      // Reset the form
      setNewReview({ rating: 5, comment: '' });
      
      // Flag that reviews are updated to trigger refetch
      setReviewsUpdated(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.data?.message || "Failed to submit review. Please try again.");
    }
  };

  // Update an existing review
  const updateExistingReview = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!userInfo) {
      alert("Please login to update a review");
      return;
    }
    
    if (!newReview.comment.trim()) {
      toast.warning("This action cannot be undone!");
      return;
    }
    
    try {
      // For update, we'll send exactly what the API expects
      const updateData = {
        rating: newReview.rating,
        comment: newReview.comment,
        userId: userInfo._id  // Make sure this field is included since API requires it
      };
      
      await updateReview({
        restaurantId: restaurant._id,
        reviewId: currentReviewId,
        reviewData: updateData
      }).unwrap();
      
      // Reset edit state
      setIsEditing(false); 
      setCurrentReviewId(null);
      alert("Your review has been updated!");
      
      // Reset the form
      setNewReview({ rating: 5, comment: '' });
      
      // Flag that reviews are updated to trigger refetch
      setReviewsUpdated(true);
      
    } catch (error) {
      console.error("Error updating review:", error);
      alert(error.data?.message || "Failed to update review. Please try again.");
    }
  };
  const handleDeleteReview = async (reviewId) => {
    try {
      // Call the API to delete the review
      await deleteReview({
        restaurantId: restaurant._id,
        reviewId: reviewId
      }).unwrap();
  
      // Show success message
      toast.success("Review deleted successfully");
  
      // If we were editing this review, reset the edit state
      if (currentReviewId === reviewId) {
        setIsEditing(false);
        setCurrentReviewId(null);
        setNewReview({ rating: 5, comment: '' });
      }
  
      // Flag that reviews are updated to trigger refetch
      setReviewsUpdated(true);
  
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(error.data?.message || "Failed to delete review. Please try again.");
      setIsEditing(false);
    }
  };
  

  // Check if the user has already submitted a review
  const hasUserReviewed = () => {
    if (!userInfo || !restaurant.reviews) return false;
    
    return restaurant.reviews.some(review => 
      (review.userId && review.userId.toString() === userInfo._id.toString()) || 
      (review.user && review.user.toString() === userInfo._id.toString())
    );
  };

  // Book a table
  const bookTable = () => {
    if (!userInfo) {
      alert("Please login to book a table");
      return;
    }
    
    // Navigate to booking page
    navigate(`/restaurants/${restaurant._id}/booking`);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Main Image */}
      <div className="relative h-96 lg:h-[500px] w-full">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
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
            
            {/* Menu Section */}
            {menuItems.length > 0 && (
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
            )}
            
                {/* Customer Reviews Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
  {/* Leave a Review Section */}
{userInfo && (
  <div className="mb-8 border-b border-gray-200 pb-8">
    {hasUserReviewed() && !isEditing ? (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-700">
            You've already submitted a review for this restaurant. 
            You can update your review using the edit button <span className="text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span> next to your review below.
          </p>
        </div>
      </div>
    ) : (
      <>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {isEditing ? 'Edit Your Review' : 'Leave a Review'}
        </h3>
        <form onSubmit={submitReview}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  type="button"
                  key={star}
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className="text-2xl focus:outline-none"
                >
                  <span className={star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700 mb-2">Your Review</label>
            <textarea
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleReviewChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="4"
              placeholder="Share your experience..."
            ></textarea>
          </div>
          <div className="flex gap-3">
            <button 
              type="submit"
              disabled={isSubmitting || isUpdating}
              className={`bg-orange-600 text-white px-6 py-2 rounded-lg transition ${(isSubmitting || isUpdating) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-700'}`}
            >
              {isSubmitting || isUpdating ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
            </button>
            
            {isEditing && (
              <button 
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </>
    )}
  </div>
)}

{!userInfo && (
  <div className="mb-8 border-b border-gray-200 pb-8">
    <p className="text-gray-600">Please 
      Log in  to leave a review.</p>
  </div>
)}

{/* Reviews List */}
{restaurant.reviews && restaurant.reviews.length > 0 ? (
  <div className="space-y-6">
    {restaurant.reviews.map(review => (
      <div key={review._id || Math.random().toString()} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <img 
              src={review.userAvatar || "/api/placeholder/48/48"} 
              alt={review.userName || "User"} 
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{review.userName || "Anonymous"}</p>
              <div className="flex text-yellow-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    {i < review.rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 text-sm mr-3">
              {review.date ? new Date(review.date).toLocaleDateString() : "Date unavailable"}
            </span>
            
            {/* Show edit/delete buttons only if the review belongs to the current user */}
            {userInfo && (review.userId === userInfo._id || review.user === userInfo._id) && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditReview(review)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  aria-label="Edit review"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-800 transition"
                  aria-label="Delete review"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-700">{review.comment}</p>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 italic">No reviews yet. Be the first to leave a review!</p>
)}
</div>
</div>
          
          {/* Right Column - Action Block */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Make a Reservation</h3>
              <p className="text-gray-600 mb-6">Reserve your table now for an unforgettable dining experience.</p>
              
              <button 
                onClick={bookTable}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition mb-4"
              >
                Book a Table
              </button>
              
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">or call us directly at</p>
                <a href={`tel:${restaurant.contact}`} className="text-orange-600 font-semibold text-lg hover:underline">
                  {restaurant.contact || 'Contact not available'}
                </a>
              </div>
              
              <hr className="my-6 border-gray-200" />
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Opening Hours</h4>
                <p className="text-gray-700">{restaurant.openingHours || 'Hours not available'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
                <p className="text-gray-700">{restaurant.location?.address || 'Address not available'}</p>
                
                {/* Map placeholder - would connect to actual map service */}
                <div className="mt-4 rounded-lg overflow-hidden h-48 bg-gray-200">
                  <img 
                    src="/api/placeholder/400/200" 
                    alt="Restaurant location map" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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