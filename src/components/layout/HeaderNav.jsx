

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import Container from './Container';
import { CiUser } from 'react-icons/ci';
import { useAuth, ROLES } from '../../context/AuthContext';

const HeaderNav = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Discover', href: '/discover' },
    { name: 'Community', href: '/community' },
    { name: 'Events', href: '/events' },
    { name: 'Services', href: '/services' },
    { name: 'Marketplace', href: '/marketplace' },
    
    { name: 'Collaborate', href: '/collaborate' },
    // { name: 'News', href: '/news' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    // Treat checkout and order-confirmed as part of marketplace for active nav state
    if (path === '/marketplace') {
      return (
        location.pathname.startsWith('/marketplace') ||
        location.pathname === '/order-confirmed' ||
        location.pathname === '/checkout'
      );
    }
    return location.pathname.startsWith(path);
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
      setIsMenuOpen(false);
      return;
    }

    const path = getBasePath(user?.role);
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-nav-bg border-b border-gray-200 shadow-sm">
      <Container>
        {/* Desktop Navigation */}
        <div className="hidden items-center justify-between py-4 lg:flex">
          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base  font-normal transition-colors ${isActive(item.href)
                  ? 'text-btn-primary border-btn-primary border-b-2 pb-1'
                  : 'hover:text-btn-primary text-navigation'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>


          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                {/* <Button
                  variant="secondary"
                  size="xs"
                  className="rounded-md text-xs py-1.5"
                  onClick={() => {
                    navigate('/my-orders');
                    setIsMenuOpen(false);
                  }}
                >
                  My Orders
                </Button> */}
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-md text-xs py-1.5"
                  onClick={handleProfileClick}
                >
                  Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Menu (full-width overlay) */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 pb-4 shadow-xl lg:hidden z-[60]">
          <Container>
            <nav className="flex flex-col space-y-1 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-base lg:text-base font-medium transition-colors ${isActive(item.href)
                    ? 'bg-secondary text-btn-primary'
                    : 'text-navigation hover:bg-gray-100'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3">
                {isAuthenticated ? (
                  <>
                    {/* <Button
                      variant="secondary"
                      className="w-full rounded-md"
                      onClick={() => {
                        navigate('/my-orders');
                        setIsMenuOpen(false);
                      }}
                    >
                      My Orders
                    </Button> */}
                    <Button
                      variant="secondary"
                      className="w-full rounded-md"
                      onClick={() => {
                        handleProfileClick();
                      }}
                    >
                      Dashboard
                    </Button>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 flex items-center justify-center gap-2 rounded-md border border-red-300 px-4 py-2 text-base font-medium hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full rounded-md">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </div>
  );
};

export default HeaderNav;




