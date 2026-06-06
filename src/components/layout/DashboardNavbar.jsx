import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';

const DashboardNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    const role = user?.role;
    const path =
      role === ROLES.PROVIDER
        ? '/provider/settings'
        : role === ROLES.ADMIN
          ? '/admin/profile'
          : role === ROLES.COACH
            ? '/coach/settings'
            : getBasePath(role);
    navigate(path);
  };

  const avatarSrc =
    user?.avatar ||
    user?.image ||
    'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D';

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3 lg:px-8 lg:py-4">
      <div className="flex items-center lg:hidden">
        <div className="flex flex-1 justify-start">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-1 justify-center">
          <img src="/logo.png" alt="Logo" className="h-5 w-auto max-w-[150px]" />
        </div>

        <div className="flex flex-1 justify-end">
          <button
            onClick={handleProfileClick}
            className="relative rounded-full p-0.5"
            aria-label="Open profile"
          >
            <img src={avatarSrc} alt="User avatar" className="h-8 w-8 rounded-full object-cover" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>

      <div className="hidden items-center justify-end gap-3 lg:flex lg:gap-4">
        <button className="relative rounded-full p-2 transition-colors hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div
          className="flex cursor-pointer items-center gap-2 lg:gap-3"
          onClick={handleProfileClick}
        >
          <img
            src={avatarSrc}
            alt="User avatar"
            className="h-9 w-9 rounded-full object-cover lg:h-10 lg:w-10"
          />
          <div className="text-base">
            <div className="font-medium text-gray-900">{user?.name || 'Ismat Nikita'}</div>
            <div className="text-gray-500">{user?.role || 'Member'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
