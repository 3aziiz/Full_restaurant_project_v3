import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Appbar from './components/Navbar/Appbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Login from './components/Loginc/LoginPage';
import Partner from './components/Partner/Partner';
import RestaurantTemplate from './components/Restaurant/Explore_restaurant_page/RestaurantTemplate';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import ManagerLayout from './components/Dashboards/ManagerDashboard';
import { ThemeProvider } from '@material-tailwind/react';
import { materialTheme } from './configs/theme';
import { ToastContainer } from 'react-toastify';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import TableBooking from './components/Restaurant/BookingTable/TableBooking';
import ChangePassword from './components/ForgetPassword/ChangePassword';
import RestaurantMenu from './components/Restaurant/RestaurantMenu/RestaurantMenu';
import OrderDetails from './components/ViewOrder/OrderDetails';
import Profile from './components/Profile/Profile';
import TableBookingDetails from './components/Restaurant/BookingTable/TableBookingDetails';
import Payment from './components/Payment/Payment';
import ResetPassword from './components/ResetPassword/ResetPassword';
import { useSelector } from 'react-redux';

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
  
  // Check if current path is admin or manager dashboard
  const isFullScreenRoute = () => {
    const path = location.pathname;
    return path.startsWith('/admin') || path.startsWith('/manager');
  };

  return (
    <ThemeProvider value={materialTheme}>
      <ToastContainer />
      {(openLogin || showLogin) && <Login setShowLogin={setShowLogin} />}
      
      {isFullScreenRoute() ? (
        // Full screen routes without Appbar and Footer
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/manager/*" element={<ManagerLayout />} />
        </Routes>
      ) : (
        // Regular routes with Appbar and Footer
        <MainLayout setShowLogin={setShowLogin}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} exact />
            <Route path="/partner" element={<Partner />} />
            <Route path="/restaurant/:id/view" element={<RestaurantTemplate />} />
            <Route path="/reset-password" element={<ForgetPassword />} />
            <Route path="/vieworders" element={<OrderDetails />} />
            <Route path="/table/details" element={<TableBookingDetails />} />
            
            {/* User Routes */}
            <Route path="/reset-password/new" element={<ResetPassword />} />
            <Route path="/user/change-password" element={<ChangePassword />} />
            <Route path="/user/me" element={<Profile />} />
            
            {/* Private routes */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/:id/book-table" element={<TableBooking />} />
              <Route path="/order" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<Payment />} />
              <Route path="/restaurant/:id/menu" element={<RestaurantMenu />} />
            </Route>
          </Routes>
        </MainLayout>
      )}
    </ThemeProvider>
  );
};

export default App;