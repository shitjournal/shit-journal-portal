import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Profile } from '../../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles: Profile['role'][];
}

export const RoleProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-4xl animate-pulse">💩</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <span className="text-6xl block mb-6">🚫</span>
        <h2 className="text-2xl font-serif font-bold mb-2">Access Denied</h2>
        <p className="chinese-serif text-charcoal-light">权限不足</p>
      </div>
    );
  }

  return <>{children}</>;
};
