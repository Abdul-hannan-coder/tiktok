/**
 * Auth Guard Component
 * Protects routes that require authentication
 */

"use client"

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/auth/login' }: AuthGuardProps) {
  const { state } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!state.isAuthenticated && state.status !== 'loading' && state.status !== 'idle') {
      router.push(redirectTo);
    }
  }, [state.isAuthenticated, state.status, router, redirectTo]);

  // Show loading or nothing while checking auth
  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A012A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#C5C5D2]">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
