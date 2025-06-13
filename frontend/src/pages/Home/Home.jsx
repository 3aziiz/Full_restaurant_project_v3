import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import RestaurantCard from '../../components/Restaurants/RestaurantCard';
import { useLocation } from 'react-router-dom';
import RestaurantTestimonials from '../../components/Testimonials/Testimonials';
import SpinWheelDemo from '../../components/GameComponent/Game';
const Home = () => {
  const [category, setCategory] = useState("All");
  const location = useLocation();

  // Extract the keyword from the query string
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      <Header />
      <RestaurantCard />
      <RestaurantTestimonials />
     <SpinWheelDemo />
    </div>
  );
};

export default Home;

