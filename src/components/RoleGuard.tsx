import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types/user';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  permission?: string;
  fallback?: ReactNode;
}

const RoleGuard = ({ 
  children, 
  allowedRoles, 
  permission, 
  fallback = null 
}: RoleGuardProps) => {
  const { user, hasPermission } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  // Check permission-based access
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;