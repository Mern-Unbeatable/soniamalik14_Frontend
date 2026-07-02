import React from 'react';
import { Bell, Menu, User } from 'lucide-react';
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

  const handleNotificationClick = () => {
    const role = user?.role;
    if (role === ROLES.PROVIDER) {
      navigate('/provider/notifications');
    } else if (role === ROLES.COACH) {
      navigate('/coach/notifications');
    } else if (role === ROLES.ADMIN) {
      navigate('/admin/profile');
    } else {
      navigate('/dashboard/notifications');
    }
  };

  const avatarSrc = user?.avatar || user?.image;
  const hasAvatar = !!avatarSrc;

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
            {hasAvatar ? (
              <img src={avatarSrc} alt="User avatar" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                <User className="h-4 w-4 text-gray-500" />
              </div>
            )}
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>

      <div className="hidden items-center justify-end gap-3 lg:flex lg:gap-4">
        {user?.role !== ROLES.ADMIN && (
          <button
            onClick={handleNotificationClick}
            className="relative rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        )}

        <div
          className="flex cursor-pointer items-center gap-2 lg:gap-3"
          onClick={handleProfileClick}
        >
          {hasAvatar ? (
            <img
              src={avatarSrc}
              alt="User avatar"
              className="h-9 w-9 rounded-full object-cover lg:h-10 lg:w-10"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 border border-gray-200 lg:h-10 lg:w-10">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}
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
