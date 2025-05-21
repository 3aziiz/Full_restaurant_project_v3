import React, { useEffect, useState } from "react";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Input,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import FastfoodTwoToneIcon from '@mui/icons-material/FastfoodTwoTone';

import { assets } from "../../assets/assets";

import "boxicons";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation, useGetProfileQuery } from "../../slices/apiSlice";
import { useNavigate, Link } from "react-router-dom";
import { logout, showLogin, updateUserInfo } from "../../slices/authSlice";
import { Html5QrcodeScanner } from "html5-qrcode";

import { persistor } from "../../store";

// NavList component for public navigation links
function NavList() {
  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        {/* <Link to="/" className="flex items-center hover:text-[#ff6347] transition-colors">
          Home
        </Link> */}
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        {/* <Link to="/about" className="flex items-center hover:text-[#ff6347] transition-colors">
          About Us
        </Link> */}
      </Typography>
      {/* <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <Link to="/restaurants" className="flex items-center hover:text-[#ff6347] transition-colors">
          Restaurants
        </Link>
      </Typography> */}
      {/* <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <Link to="/how-it-works" className="flex items-center hover:text-[#ff6347] transition-colors">
          How It Works
        </Link>
      </Typography> */}
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        {/* <Link to="/contact" className="flex items-center hover:text-[#ff6347] transition-colors">
          Contact
        </Link> */}
      </Typography>
    </ul>
  );
}

function ProfileMenu({setShowLogin}) {
  const dispatch=useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const navigate = useNavigate();
  const [logoutApiCall, { isLoading }] = useLogoutMutation();
  const { data: userData, refetch, error } = useGetProfileQuery();
  const handleLogout = async () => {
    const res = await logoutApiCall();
    console.log(res);
    dispatch(logout());
    dispatch(showLogin()); // Optional if you want to show the login modal
    persistor.purge();
    navigate("/");
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-1 pr-3 pl-1"
        >
        <Avatar
          variant="circular"
          size="sm"
          alt="Profile"
          className="border border-gray-900 p-0.5"
          src={userData && userData.avatar ? userData.avatar : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80"}
        />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {/* Admin Dashboard Link - Only visible for admin users */}
        {userData && userData.role === "admin" && (
          <Link to='/admin/dashboard'>
            <MenuItem className="flex items-center gap-2 rounded">
              <UserCircleIcon className="h-4 w-4" />
              <Typography as="span" variant="small" className="font-normal">
                Admin Dashboard
              </Typography>
            </MenuItem>
          </Link>
        )}
        
        {/* Manager Dashboard Link - Only visible for manager users */}
        {userData && userData.role === "manager" && (
          <Link to='/manager/dashboard'>
            <MenuItem className="flex items-center gap-2 rounded">
              <UserCircleIcon className="h-4 w-4" />
              <Typography as="span" variant="small" className="font-normal">
                Manager Dashboard
              </Typography>
            </MenuItem>
          </Link>
        )}
        
        {/* Regular menu items for all users */}
        <Link to='/user/me'>
        <MenuItem className="flex items-center gap-2 rounded">
          <UserCircleIcon className="h-4 w-4" />
          <Typography as="span" variant="small" className="font-normal">
            My Profile
          </Typography>
        </MenuItem>
        </Link>
        <MenuItem className="flex items-center gap-2 rounded">
          <Cog6ToothIcon className="h-4 w-4" />
          <Link to='/user/change-password'>
            <Typography as="span" variant="small" className="font-normal">
              Change password
            </Typography>
          </Link>
        </MenuItem>
        <Link to='/table/details'>
        <MenuItem className="flex items-center gap-2 rounded">
          <InboxArrowDownIcon className="h-4 w-4" />
          <Typography as="span" variant="small" className="font-normal">
            Inbox
          </Typography>
        </MenuItem>
        </Link>
        {/* <Link to='/vieworders'>
          <MenuItem className="flex items-center gap-2 rounded">
            <FastfoodTwoToneIcon sx={{fontSize:18}} />
            <Typography as="span" variant="small" className="font-normal">
              Orders
            </Typography>
          </MenuItem>
        </Link> */}
        <hr className="my-2 border-blue-gray-50" />
        <MenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 rounded hover:bg-red-500/10"
        >
          <PowerIcon className="h-4 w-4 text-red-500" />
          <Typography
            as="span"
            variant="small"
            className="font-normal "
            color="red"
          >
            Sign Out
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function Appbar({ setShowLogin }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo} = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: userData, refetch, error } = useGetProfileQuery();
  
  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Navigate to the home page with the search keyword as a parameter
    navigate(`/?keyword=${value}`);
  };

  useEffect(() => {
    let scanner;

    if (isScannerActive) {
      scanner = new Html5QrcodeScanner("qr-reader", {
        qrbox: { width: 250, height: 250 },
        fps: 5,
      });

      scanner.render(onScanSuccess, onScanError);
    }

    function onScanSuccess(result) {
      scanner.clear();
      setIsScannerActive(false); // Close the modal after a successful scan
      navigate(result); // Redirect to the scanned URL
    }

    function onScanError(error) {
      console.warn("QR Scan Error:", error);
    }

    return () => {
      if (scanner) {
        scanner
          .clear()
          .catch((error) => console.warn("Clear scanner error:", error));
      }
    };
  }, [isScannerActive, navigate]);
  
  useEffect(() => {
    if (userData) {
      dispatch(updateUserInfo(userData));
    }
  }, [userData, dispatch]);
  
  console.log(userInfo);
  
  return (
    <div className="w-full">
      <Navbar className="w-full p-1 rounded-none shadow-none max-w-none">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/">
            <Typography as="div" variant="h5">
              <img src={assets.firstlogo} alt="Scan&Dine" className="h-15 md:h-[190px] hover:scale-110" />
            </Typography>
          </Link>

          {/* Navigation menu - desktop */}
          <div className="hidden lg:block">
            <NavList />
          </div>

          {/* Search bar (desktop view) */}
          <div className="hidden md:flex flex-grow justify-center mx-8 max-w-2xl">
            <div className="relative w-full">
              <Input
                type="search"
                color="red"
                value={searchTerm}
                onChange={handleSearch}
                label="Search for a restaurant..."
                className="pr-20"
                containerProps={{
                  className: "min-w-[288px]",
                }}
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>

          {/* Icons for both mobile and desktop views */}
          <div className="flex items-center gap-6">
            {!userInfo ? (
              <Button
                size="sm"
                onClick={() => setShowLogin(true)}
                className="min-w-[120px] px-6 bg-[#ff6347] rounded-full hover:bg-red-600 hover:shadow-red-400 font-medium"
              >
                Sign In
              </Button>
            ) : (
              <ProfileMenu handleLogout={handleLogout} setShowLogin={setShowLogin}/>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <Collapse open={isNavOpen}>
          <NavList />
          
          {/* Mobile Search */}
          <div className="mt-2 px-4">
            <Input
              type="search"
              color="red"
              value={searchTerm}
              onChange={handleSearch}
              label="Search for a restaurant..."
              className="mb-4"
            />
          </div>
        </Collapse>

        {/* QR Scanner Modal */}
        {isScannerActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-200 w-80 p-8 rounded-lg shadow-lg relative">
              <button
                onClick={() => setIsScannerActive(false)}
                className="absolute top-1 right-1 text-gray-700 hover:text-gray-900 font-bold"
              >
                <box-icon name="x-square" type="solid" color="black"></box-icon>
              </button>
              <div id="qr-reader" className="w-full h-full"></div>
            </div>
          </div>
        )}
        
        {/* Responsive search bar for mobile (alternative approach) */}
        {isSearchVisible && !isNavOpen && (
          <div className="mt-2 md:hidden px-4">
            <div className="relative">
              <Input
                type="search"
                color="red"
                value={searchTerm}
                onChange={handleSearch}
                label="Search for a restaurant..."
                containerProps={{
                  className: "min-w-full",
                }}
              />
            </div>
          </div>
        )}
      </Navbar>
    </div>
  );
}

export default Appbar;