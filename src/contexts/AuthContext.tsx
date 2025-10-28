/**
 * Authentication Context Provider
 */

"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/auth/useAuth';
import type { AuthState, SignupPayload, LoginPayload } from '@/lib/hooks/auth/types/authTypes';

interface AuthContextType {
  state: AuthState;
  actions: {
    signup: (payload: SignupPayload) => Promise<void>;
    login: (payload: LoginPayload) => Promise<void>;
    logout: () => void;
    restoreSession: () => void;
  };
  getToken: () => string | undefined;
  reset: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
