import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * RequireAuth - Protects routes based on authentication and role
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @param {string} redirectTo - Where to redirect if not authorized (default: /signin)
 */
const RequireAuth = ({ children, allowedRoles = [], redirectTo = '/signin' }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-btn-primary"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role if allowedRoles specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User doesn't have required role - redirect to unauthorized or home
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireAuth;
