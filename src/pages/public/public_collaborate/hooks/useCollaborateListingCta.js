import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth, ROLES } from '../../../../context/AuthContext';

export const REGISTER_ROLE_KEYS = {
  SPORT_PROVIDER: 'sport-provider',
  SERVICE_PROVIDER: 'service-provider',
};

export const useCollaborateListingCta = ({
  targetRole,
  registerRoleKey,
  dashboardPath,
  providerLabel,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isAdmin = isAuthenticated && user?.role === ROLES.ADMIN;
  const isTargetRole = isAuthenticated && user?.role === targetRole;
  const isDisabled = isAdmin;

  const handleClick = useCallback(async () => {
    if (isDisabled) return;

    if (!isAuthenticated) {
      navigate(`/register?role=${registerRoleKey}`);
      return;
    }

    if (isTargetRole) {
      navigate(dashboardPath);
      return;
    }

    const result = await Swal.fire({
      title: 'Registration required',
      text: `You need to register as a ${providerLabel} to continue.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#107C66',
    });

    if (!result.isConfirmed) return;

    await logout();
    navigate(`/register?role=${registerRoleKey}`);
  }, [
    dashboardPath,
    isAuthenticated,
    isDisabled,
    isTargetRole,
    logout,
    navigate,
    providerLabel,
    registerRoleKey,
  ]);

  return { handleClick, isDisabled };
};
