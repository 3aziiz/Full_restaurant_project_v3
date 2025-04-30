import { useState, useEffect } from 'react';
import { useAddReviewMutation, useDeleteReviewMutation, useUpdateReviewMutation } from '../../slices/apiSlice';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default function CustomerReviews({ restaurant, refetchRestaurant }) {
  // Get userInfo from Redux state
  const { userInfo } = useSelector((state) => state.auth);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  
  // Added state to force re-render when data changes
  const [reviewsUpdated, setReviewsUpdated] = useState(false);
  
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  
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
      console.log(updateData);
      await updateReview({
        restaurantId: restaurant._id,
        reviewId: currentReviewId,
        updatedData: updateData
      }).unwrap();
      
      // Reset edit state
      setIsEditing(false); 
      setCurrentReviewId(null);
      toast.success("review updated successfully")
      
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="review-form">
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
              <form onSubmit={isEditing ? updateExistingReview : submitReview}>
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
          <p className="text-gray-600">Please Log in to leave a review.</p>
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
  );
}