import React from 'react';
import { useParams } from 'react-router-dom';
import RestaurantTemplate from './RestaurantTemplate';
import { useGetRestaurantByIdQuery } from '../../slices/apiSlice';

const RestaurantDetail = () => {
  const { id } = useParams();

  const { data: restaurant, isLoading, error } = useGetRestaurantByIdQuery(id);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading restaurant details...</div>;
  }

  if (error || !restaurant) {
    return <div className="flex justify-center items-center h-screen text-red-600">Error loading restaurant</div>;
  }

  return <RestaurantTemplate restaurant={restaurant} />;
};

export default RestaurantDetail;
