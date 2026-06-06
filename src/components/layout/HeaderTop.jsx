
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Menu, X, LogOut } from 'lucide-react';
import { CiUser } from 'react-icons/ci';
import Button from '../ui/Button';
import Container from '../layout/Container';
import { useAuth, ROLES } from '../../context/AuthContext';

const HeaderTop = ({ onMenuClick, isMenuOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getBasePath = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return '/admin';
      case ROLES.PROVIDER:
        return '/provider';
      case ROLES.COACH:
        return '/coach';
      default:
        return '/dashboard';
    }
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    const path = getBasePath(user?.role);
    navigate(path);
  };

  return (
    <div className="bg-white py-2 ">
      <Container>
        {/* Mobile Header: [Menu + Search] --- Logo (centered) --- [User] */}
        <div className="flex lg:hidden items-center justify-between  ">
          {/* Left: Menu & Search together */}
          <div className="flex items-center gap-1">
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
            <img src="/logo.png" alt="ESSA HUB Logo" className="h-6 w-full" />
          </Link>

          {/* Right: User Icon (Fixed for Mobile/Tablet) */}
          {!isAuthenticated ? (
            <Link to="/signin" className="p-2 -mr-2 hover:bg-gray-100 rounded-md">
              <CiUser className="h-6 w-6" />
            </Link>
          ) : (
            <button
              onClick={handleProfileClick}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-md"
            >
              <CiUser className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="md:hidden py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />
              <input
                type="search"
                placeholder="Search for anything..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-base focus:border-btn-primary focus:outline-none focus:ring-1 focus:ring-btn-primary"
              />
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden lg:flex h-15 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ESSA HUB Logo" className="h-6 w-full" />
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative bg-white shadow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-900" />
              <input
                type="search"
                placeholder="Search for anything..."
                className="w-full rounded-xs border border-gray-300 py-2.5 pl-10 pr-4 text-base focus:border-btn-primary focus:outline-none focus:ring-1 focus:ring-btn-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-9">
            {/* {isAuthenticated && (
              <button className="flex items-center gap-2 rounded-md px-3 py-2 text-base text-btn-primary hover:bg-gray-100">
                <MapPin className="h-4 w-4" />
                <span>{user?.address || user?.city || user?.location || user?.profile?.address}</span>
              </button>
            )} */}

            {!isAuthenticated ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <Link to="/signin">
                  <Button variant="primary" className="rounded-md">Sign IN</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-base text-btn-primary hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
                {/* <button onClick={handleProfileClick} className="p-2 hover:bg-gray-100 rounded-md">
                  <CiUser className="h-6 w-6" />
                </button> */}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeaderTop;