import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Package,
  MessageSquare,
  Users,
  DollarSign,
  LogOut,
  BarChart3,
  UserPlus,
  X,
  Settings,
  CirclePlus,
  List,
  TrendingUp,
  FileText,
  CalendarPlus2,
  Bell,
  PlusCircle,
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';

// Menu items configuration
const getMenuItems = (role, basePath) => {
  const adminMenu = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: `${basePath}`,
    },
    { id: 'users', label: 'Users', icon: <Users className="h-5 w-5" />, path: `${basePath}/users` },
    {
      id: 'listings',
      label: 'Listings ',
      icon: <List className="h-5 w-5" />,
      path: `${basePath}/listings`,
    },
    {
      id: 'event',
      label: 'Event',
      icon: <Calendar className="h-5 w-5" />,
      path: `${basePath}/event`,
    },
    {
      id: 'brand',
      label: 'Brand',
      icon: <Package className="h-5 w-5" />,
      path: `${basePath}/brand`,
    },
    {
      id: 'demand',
      label: 'Demand',
      icon: <TrendingUp className="h-5 w-5" />,
      path: `${basePath}/demand`,
    },
    {
      id: 'content',
      label: 'Content',
      icon: <FileText className="h-5 w-5" />,
      path: `${basePath}/content`,
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: <DollarSign className="h-5 w-5" />,
      path: `${basePath}/revenue`,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      path: `${basePath}/analytics`,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: `${basePath}/settings`,
    },
  ];

  const providerMenu = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: `${basePath}`,
    },
    {
      id: 'add_listing',
      label: 'Add Listing',
      icon: <PlusCircle className="h-5 w-5" />,
      path: `${basePath}/add-listing`,
    },
    {
      id: 'event',
      label: 'Event',
      icon: <Calendar className="h-5 w-5" />,
      path: `${basePath}/event`,
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: <BarChart3 className="h-5 w-5" />,
      path: `${basePath}/insights`,
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <MessageSquare className="h-5 w-5" />,
      path: `${basePath}/enquiries`,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      path: `${basePath}/notifications`,
    },
  ];

  const coachMenu = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: `${basePath}`,
    },
    {
      id: 'recruitment',
      label: 'Manage Listings',
      icon: <UserPlus className="h-5 w-5" />,
      path: `${basePath}/recruitment`,
    },
    {
      id: 'event',
      label: 'Events',
      icon: <CalendarPlus2 className="h-5 w-5" />,
      path: `${basePath}/events`,
    },
    {
      id: 'event-analytics',
      label: 'Insights',
      icon: <BarChart3 className="h-5 w-5" />,
      path: `${basePath}/event-analytics`,
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <MessageSquare className="h-5 w-5" />,
      path: `${basePath}/enquiries`,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      path: `${basePath}/notifications`,
    },
  ];

  switch (role) {
    case ROLES.ADMIN:
      return adminMenu;
    case ROLES.PROVIDER:
      return providerMenu;
    case ROLES.COACH:
      return coachMenu;
    default:
      return [];
  }
};

// Get base path for each role
const getBasePath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.PROVIDER:
      return '/provider';
    case ROLES.COACH:
      return '/coach';
    default:
      return '/';
  }
};

// Get role display name
const getRoleTitle = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'Admin';
    case ROLES.PROVIDER:
      return 'Service Provider';
    case ROLES.COACH:
      return 'Club/Coach Designer';
    default:
      return '';
  }
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const basePath = getBasePath(user?.role);
  const menuItems = getMenuItems(user?.role, basePath);
  const _roleTitle = getRoleTitle(user?.role);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when a nav item is clicked
    if (isOpen) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-63 transform flex-col overflow-x-hidden border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:w-80 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} `}
      >
        {/* Close button for mobile */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4  rounded-full p-1 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button> */}

        {/* Logo */}
        <div className="flex items-center px-5  border-b border-gray-300">
          <Link to="/" onClick={handleNavClick} className="inline-block" aria-label="Home">
            <img src="/logo.png" alt="Logo" className="h-auto  w-57  py-6.5 " />
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-x-hidden overflow-y-auto pt-4 pb-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              <NavLink
                to={item.path}
                end={item.id === 'dashboard' || item.id === 'event'}
                onClick={handleNavClick}
                className={({ isActive }) => {
                  // Make Event (or Event Analytics) appear active when viewing a specific event detail route (/coach/event/:id)
                  const isEventDetailsRoute = location.pathname.startsWith(`${basePath}/event/`);
                  // Match only the event list route (exact) so event-analytics doesn't collide
                  const isEventListRoute = location.pathname === `${basePath}/event`;
                  const from = location.state?.from;
                  let extraActive = false;
                  if (isEventDetailsRoute) {
                    // if navigated from analytics, highlight Event Analytics
                    if (from === 'analytics' && item.id === 'event-analytics') extraActive = true;
                    // if navigated from event page (or direct URL with no state), highlight Event
                    if ((from === 'event' || from == null) && item.id === 'event')
                      extraActive = true;
                  }
                  // Make only Event menu active when viewing the event list route
                  if (isEventListRoute && item.id === 'event') {
                    extraActive = true;
                  }
                  const active = isActive || extraActive;
                  return `mx-5 flex items-center gap-3 py-3 text-base font-medium ${active ? 'bg-btn-primary mx-8 rounded-lg px-8 text-white' : 'text-sidebarLink px-5 pl-6 hover:bg-gray-50'}`;
                }}
              >
                <span className="flex items-center">{item.icon}</span>
                <span className="text-base font-medium">{item.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 px-4 py-3">
          <button
            onClick={handleLogout}
            className="text-btn-primary flex w-full items-center gap-3 rounded-none px-4 py-3 hover:bg-gray-50"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-base font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
