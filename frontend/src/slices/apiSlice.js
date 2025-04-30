import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  endpoints: (builder) => ({


    login: builder.mutation({
      query: (data) => ({
        url: 'api/auth/login',
        method: 'POST',
        body: data,
        credentials: "include",
      }),
    }),



    register: builder.mutation({
      query: (data) => ({
        url: 'api/auth/register',
        method: 'POST',
        body: data,
        credentials: "include",
      }),}),



      changePassword: builder.mutation({
        query: (data) => ({
          url: 'api/auth/changePassword',
          method: 'POST',
          // headers:{
          //   "authorization":`Bearer ${localStorage.getItem("token")}`
          // },
          body: data,
          credentials: "include",
           }),
         }),



         forgotPassword: builder.mutation({
          query: (data) => ({
            url: 'api/auth/forgot-password',
            method: 'POST',
            body: data,
            credentials: 'include',
          }),
        }),


    logout: builder.mutation({
     query: ()=>({
      url: 'api/auth/logout',
      method: 'POST',
      credentials: "include",
     })
    }),


    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: 'api/auth/reset-password',
        method: 'POST',
        body: { token, newPassword },
      }),
    }),


    getProfile: builder.query({
      query: () => ({
        url: 'api/users/profile',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    
    updateAvatar: builder.mutation({
      query: (data) => ({
        url: 'api/users/avatar',
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
    }),


    updateName: builder.mutation({
      query: (data) => ({
        url: 'api/users/profile/updateName',
        method: 'PUT',
        body: { name: data.name },
        credentials: 'include',
      }),
      invalidatesTags: ['User']
    }),


    getAllUsers: builder.query({
      query: () => ({
        url: 'api/admin/users',
        method: 'GET',
        credentials: "include",
      }),
      providesTags: ['Users'],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `api/admin/users/${userId}`,
        method: 'DELETE',
        credentials: "include",
      }),
      invalidatesTags: ['Users'],
    }),


    // New registerPartner mutation
    registerPartner: builder.mutation({
      query: (data) => ({
        url: 'api/manager-requests/createRequest',  // Adjust endpoint as needed
        method: 'POST',
        body: data,
        credentials: "include",
      }),
    }),


    getAllRequests: builder.query({
      query: () => ({
        url: '/api/admin/requests',
        method: 'GET',
        credentials: "include",
      }),
    }),
    
    approveRequest: builder.mutation({
      query: (id) => ({
        url: `api/admin/requests/approve/${id}`,
        method: 'PATCH',
        credentials: "include",
      }),
      invalidatesTags: ['Requests'],
    }),

    deleteRequest: builder.mutation({
      query: (id) => ({
        url: `api/admin/requests/delete/${id}`,
        method: 'DELETE',
        credentials: "include",
      }),
      invalidatesTags: ['Requests'],
    }),


   // Create restaurant
   createRestaurant: builder.mutation({
    query: (formData) => ({
      url: 'api/manager/createRestaurant',
      method: 'POST',
      body: formData,
      
      credentials: "include",
    }),
    invalidatesTags: ['Restaurant'],
  }),

//get restaurants 
getRestaurants: builder.query({
  query: () => ({
    url: 'api/manager/restaurants', // Adjust to your endpoint for fetching restaurants
    method: 'GET',
     // Include cookies if necessary
  }),
  providesTags: ['Restaurants'],
}),

getRestaurantById: builder.query({
  query: (id) => ({
    url: `api/manager/restaurant/${id}`,  // Adjust the endpoint to fetch a specific restaurant by ID
    method: 'GET',
      // Include cookies if necessary
  }),
  providesTags: ['Restaurant'],
}),


deleteRestaurant: builder.mutation({
  query: (id) => ({
    url: `api/manager/restaurant/${id}`,
    method: 'DELETE',
    credentials: "include",
  }),
  invalidatesTags: ['Restaurants'],
}), 

 // Add the update restaurant mutation
 updateRestaurant: builder.mutation({
  query: ({ id, formData }) => ({
    url: `api/manager/restaurant/${id}`,
    method: 'PUT',
    body: formData,
    // Important: This disables the automatic JSON serialization since we're sending FormData
    formData: true,
    credentials: "include",
  }),
  invalidatesTags: ['Restaurant'],
}),



// Add Review mutation
addReview: builder.mutation({
  query: (data) => ({
    url: `api/users/restaurants/${data.restaurantId}/reviews`,
    method: 'POST',
    body: data.reviewData,
    credentials: 'include',
  }),
  // ...
}),


// Get Reviews for a restaurant
getReviews: builder.query({
  query: (restaurantId) => ({
    url: `api/users/${restaurantId}/reviews`,  // Changed from api/restaurants/
    method: 'GET',
    credentials: 'include',
  }),
  providesTags: (result, error, arg) => [
    { type: 'Reviews', id: arg },
    'Reviews'
  ]
}),


// Delete Review mutation
deleteReview: builder.mutation({
  query: ({ restaurantId, reviewId }) => ({
    url: `api/users/${restaurantId}/reviews/${reviewId}`,
    method: 'DELETE',
    credentials: 'include',
  }),
  invalidatesTags: (result, error, arg) => [
    { type: 'Reviews', id: arg.restaurantId },
    'Reviews'
  ]
}),

// Update Review mutation
updateReview: builder.mutation({
  query: ({ restaurantId, reviewId, updatedData }) => ({
    url: `api/users/${restaurantId}/reviews/${reviewId}`, // Fix URL here
    method: 'PUT',
    body: updatedData, // Ensure updatedData includes rating, comment, and userId
    credentials: 'include',
  }),
  invalidatesTags: (result, error, arg) => [
    { type: 'Reviews', id: arg.restaurantId },
    'Reviews'
  ]
}),


 // Create a new booking
 createBooking: builder.mutation({
  query: (bookingData) => ({
    url: `api/users/restaurants/${bookingData.restaurantId}/bookings`,
    method: 'POST',
    body: bookingData,
    credentials: 'include',
  }),
  invalidatesTags: ['Booking'],
}),







  }),
});
  


export const { 
  useLoginMutation, 
  useRegisterMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateAvatarMutation,
  useUpdateNameMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useRegisterPartnerMutation,
  useGetAllRequestsQuery,
  useApproveRequestMutation,
  useDeleteRequestMutation,
  useCreateRestaurantMutation,
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useDeleteRestaurantMutation,
  useUpdateRestaurantMutation,
  useAddReviewMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
  useCreateBookingMutation,
} = apiSlice;