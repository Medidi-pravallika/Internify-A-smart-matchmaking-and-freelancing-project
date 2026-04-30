import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
