import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  console.log('[AuthGuard] Status:', { isAuthenticated, isLoading });

  if (isLoading) {
    console.log('[AuthGuard] Loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[AuthGuard] Not authenticated, redirecting to /auth/signin');
    return <Navigate to="/auth/signin" replace />;
  }

  console.log('[AuthGuard] Authenticated, rendering children');
  return <>{children}</>;
};