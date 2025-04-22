// src/components/Layout/MainLayout.jsx
import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh]"> {/* to push footer to bottom */}
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
