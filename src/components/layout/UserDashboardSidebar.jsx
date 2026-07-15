import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, LogOut, X, Bell, Calendar, Users, Bookmark, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/dashboard/notifications' },
  { id: 'myEvents', label: 'My Events', icon: <Calendar className="w-5 h-5" />, path: '/dashboard/my-events' },
  { id: 'insights', label: 'Insights', icon: <MessageSquare className="w-5 h-5" />, path: '/dashboard/insights' },
  { id: 'community', label: 'Community', icon: <Users className="w-5 h-5" />, path: '/dashboard/community' },
  { id: 'saved', label: 'Saved', icon: <Bookmark className="w-5 h-5" />, path: '/dashboard/saved' },
  { id: 'account', label: 'Account Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/account' },
];

const UserDashboardSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform`}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      <div className="px-6 pt-6 pb-4">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="w-full h-auto" />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.id}
            to={it.path}
            end={it.id === 'dashboard'}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 font-medium text-base px-4 py-3 rounded-md ${isActive ? 'bg-btn-primary text-white' : 'text-sidebarLink hover:bg-gray-50'}`
            }
          >
            <span className="flex items-center">{it.icon}</span>
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 text-btn-primary px-4 py-3 hover:bg-gray-50 rounded-md">
          <LogOut className="w-5 h-5" />
          <span className="text-base font-medium">Log Out</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default UserDashboardSidebar;
