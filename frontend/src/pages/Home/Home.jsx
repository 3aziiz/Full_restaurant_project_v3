// import React, { useState } from 'react';
// import './Home.css';
// import Header from '../../components/Header/Header';
// import RestaurantCard from '../../components/Restaurants/RestaurantCard';
// import { useLocation } from 'react-router-dom';
// import RestaurantTestimonials from '../../components/Testimonials/Testimonials';
// import SpinWheelDemo from '../../components/GameComponent/Game';
// const Home = () => {
//   const [category, setCategory] = useState("All");
//   const location = useLocation();

//   // Extract the keyword from the query string
//   const searchParams = new URLSearchParams(location.search);
//   const keyword = searchParams.get('keyword') || '';

//   return (
//     <div className="max-w-[1400px] mx-auto px-4">
//       <Header />
//       <RestaurantCard />
//       <RestaurantTestimonials />
//      <SpinWheelDemo />
//     </div>
//   );
// };

// export default Home;



import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import RestaurantCard from '../../components/Restaurants/RestaurantCard';
import { useLocation } from 'react-router-dom';
import RestaurantTestimonials from '../../components/Testimonials/Testimonials';
import SpinWheelDemo from '../../components/GameComponent/Game';

const Home = () => {
  const [category, setCategory] = useState("All");
  const location = useLocation();
  const restaurantsRef = useRef(null);
  
  // Extract the keyword from the query string
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  
  // Auto-scroll to restaurants section when search is performed
  useEffect(() => {
    if (keyword && restaurantsRef.current) {
      // Small delay to ensure the component has rendered
      setTimeout(() => {
        restaurantsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [keyword]);
  
  return (
    <div className="max-w-[1400px] mx-auto px-4">
      {/* Show header only when not searching, or make it smaller */}
      {!keyword && <Header />}
      
      {/* Add ref to the restaurants section */}
      <div ref={restaurantsRef}>
        <RestaurantCard />
      </div>
      
      {/* Only show other sections when not searching */}
      {!keyword && (
        <>
          <RestaurantTestimonials />
          <SpinWheelDemo />
        </>
      )}
    </div>
  );
};

export default Home;