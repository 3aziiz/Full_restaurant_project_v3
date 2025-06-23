import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';
import { materialTheme } from './configs/theme';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import Appbar from './components/Navbar/Appbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './components/Loginc/LoginPage';
import Partner from './components/Partner/Partner';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import ManagerDashboard from './components/Dashboards/ManagerDashboard';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import ChangePassword from './components/ForgetPassword/ChangePassword';
import Profile from './components/Profile/Profile';
import UserBookings from './components/Restaurants/UserBookings';
import ResetPassword from './components/ResetPassword/ResetPassword';
import RestaurantDetail  from './components/Restaurants/RestaurantDetail';




// Layout component that wraps routes with Appbar and Footer
const MainLayout = ({ children, setShowLogin }) => {
  return (
    <>
      <div className="app">
        <Appbar setShowLogin={setShowLogin} />
        {children}
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { openLogin } = useSelector((state) => state.auth);
  const location = useLocation();
  
  const isFullScreenRoute = () => {
    const path = location.pathname;
    // Match /restaurants/{id} format
    const isRestaurantView = /^\/restaurants\/[^\/]+$/.test(path);
    return path.startsWith('/admin') || path.startsWith('/manager') || isRestaurantView;
  };

  return (
    <ThemeProvider value={materialTheme}>
      <ToastContainer />
      {(openLogin || showLogin) && <Login setShowLogin={setShowLogin} />}
      
      {isFullScreenRoute() ? (
        // Full screen routes without Appbar and Footer
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/manager/*" element={<ManagerDashboard />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        </Routes>
      ) : (
        // Regular routes with Appbar and Footer
        <MainLayout setShowLogin={setShowLogin}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} exact />
            <Route path="/partner" element={<Partner />} />
           

            <Route path="/reset-password" element={<ForgetPassword />} />
         
            <Route path="/table/details" element={<UserBookings />} />
            
            {/* Payment return routes - Add these new routes */}
            <Route path="/booking/success" element={<UserBookings />} />
            <Route path="/booking/failed" element={<UserBookings />} />
            
            {/* User Routes */}
            <Route path="/reset-password/new" element={<ResetPassword />} />
            <Route path="/user/change-password" element={<ChangePassword />} />
            <Route path="/user/me" element={<Profile />} />
            
            {/* Private routes */}
            
            <Route path="" element={<PrivateRoute />}>
              
              <Route path="/:id/book-table" element={<UserBookings />} />
              <Route path="/bookings" element={<UserBookings />} />
              
              {/* <Route path="/order/:id" element={<Payment />} /> */}
            </Route>
          </Routes>
        </MainLayout>
      )}
    </ThemeProvider>
  );
};

export default App;