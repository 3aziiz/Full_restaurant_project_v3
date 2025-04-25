// import React from 'react';
// import { useParams } from 'react-router-dom';
// import RestaurantTemplate from './RestaurantTemplate';
// import { useGetRestaurantByIdQuery } from '../../slices/apiSlice';

// const RestaurantDetail = () => {
//   const { id } = useParams();

//   const { data: restaurant, isLoading, error } = useGetRestaurantByIdQuery(id);

//   if (isLoading) {
//     return <div className="flex justify-center items-center h-screen">Loading restaurant details...</div>;
//   }
// console.log(restaurant);
//   if (error || !restaurant) {
//     return <div className="flex justify-center items-center h-screen text-red-600">Error loading restaurant</div>;
//   }

//   return <RestaurantTemplate restaurant={restaurant} />;
// };

// export default RestaurantDetail;


// src/components/Restaurants/RestaurantDetail.jsx
import { useParams } from 'react-router-dom';
import RestaurantTemplate from './RestaurantTemplate';
import { useGetRestaurantByIdQuery } from '../../slices/apiSlice';

const RestaurantDetail = () => {
  const { id } = useParams();

  // Get restaurant data from RTK Query
  const { data, isLoading, error ,refetch } = useGetRestaurantByIdQuery(id);

  // Check loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading restaurant details...</div>;
  }

  // Log data for debugging
  console.log("Restaurant data from API:", data);

  // Check for errors or missing data
  if (error || !data) {
    return <div className="flex justify-center items-center h-screen text-red-600">Error loading restaurant</div>;
  }

  // The issue might be that your API returns data in a nested structure
  // Extract the actual restaurant object from the response
  // It could be data.data, data.restaurant, or just data depending on your API
  const restaurant = data.data || data.restaurant || data;

  // Make sure restaurant has at least empty arrays for menuItems and images
  // to prevent the errors in RestaurantTemplate
  const preparedRestaurant = {
    ...restaurant,
    menuItems: restaurant.menuItems || [],
    images: restaurant.images || []
  };

  // Now pass the properly prepared data to the template
  return <RestaurantTemplate restaurant={preparedRestaurant} />;;
};

export default RestaurantDetail;