

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react'; 
import Container from './Container';
import Button from '../ui/Button';
import { useAuth, ROLES } from '../../context/AuthContext';

const NavbarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Discover', href: '/discover' },
    { name: 'Community', href: '/community' },
    { name: 'Events', href: '/events' },
    { name: 'Services', href: '/services' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Collaborate', href: '/collaborate' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
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
      case ROLES.ADMIN: return '/admin';
      case ROLES.PROVIDER: return '/provider';
      case ROLES.COACH: return '/coach';
      default: return '/dashboard';
    }
  };

  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      setIsMenuOpen(false);
      return;
    }
    navigate(getBasePath(user?.role));
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur xl:py-4">
      <Container className="px-1!">
        <div className="relative flex h-16 items-center justify-between gap-4">
          
          {/* 1. Mobile Menu Button (Left) */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-md p-2 hover:bg-gray-100 xl:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

      
          <div className="flex flex-1 justify-center xl:justify-start">
            <Link to="/" className="shrink-0">
              <img 
                src="/logo.png" 
                alt="ESSA HUB Logo" 
                className="h-5 w-auto xl:h-7" // Mobile
              />
            </Link>
          </div>

          {/* 3. Desktop Navigation */}
          <nav className="hidden items-center justify-center gap-5 xl:absolute xl:left-1/2 xl:flex xl:-translate-x-1/2 xl:gap-7">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`border-b-2 px-0.5 pb-1 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'border-btn-primary text-btn-primary'
                    : 'text-navigation hover:text-btn-primary border-transparent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 4. Right Side - Desktop Buttons / Mobile User Icon */}
          <div className="flex items-center gap-2">
            {/* Desktop View */}
            <div className="hidden items-center gap-2 xl:flex">
              {!isAuthenticated ? (
                <Link to="/signin">
                  <Button variant="primary" className="rounded-md px-5">Sign In</Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-md"
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </Button>
                  <button
                    onClick={handleLogout}
                    className="text-btn-primary flex items-center gap-2 rounded-md px-3 py-2 text-base hover:bg-gray-100"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile View User Icon Only */}
            <div className="xl:hidden">
              <button 
                onClick={handleDashboardClick}
                className="p-2 text-blue-500" 
              >
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>

        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-gray-200 bg-white shadow-lg xl:hidden">
          <Container>
            <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto flex flex-col space-y-1 py-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-secondary text-btn-primary'
                      : 'text-navigation hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-2">
                {!isAuthenticated ? (
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full rounded-md">Sign In</Button>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      className="w-full rounded-md"
                      onClick={handleDashboardClick}
                    >
                      Dashboard
                    </Button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 rounded-md border border-red-300 px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
};

export default NavbarLayout;