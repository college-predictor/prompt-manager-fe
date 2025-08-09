"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { authAPI } from '@/lib/api';
import { setCookie, getCookie, deleteCookie, isSessionValid } from '@/lib/cookies';

interface AuthUser {
  email: string;
  name: string;
  firebaseUser: User;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = (): boolean => {
    const sessionValid = isSessionValid();
    console.log('AuthProvider: Session check result:', sessionValid);
    return sessionValid;
  };

  const clearUserData = () => {
    console.log('AuthProvider: Clearing user data and cookies');
    setUser(null);
    deleteCookie('session_token');
    deleteCookie('session_expiry');
    deleteCookie('user_email');
    deleteCookie('user_name');
  };

  const setUserData = (userData: { email: string; name: string }, firebaseUser: User) => {
    console.log('AuthProvider: Setting user data and session cookies');
    setUser({
      email: userData.email,
      name: userData.name,
      firebaseUser,
    });

    // Set session cookies (expires in 7 days)
    const expiryTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
    setCookie('session_token', 'authenticated', 7);
    setCookie('session_expiry', expiryTime.toString(), 7);
    setCookie('user_email', userData.email, 7);
    setCookie('user_name', userData.name, 7);
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up authentication');

    // First check if we have a valid session
    if (checkSession()) {
      const email = getCookie('user_email');
      const name = getCookie('user_name');

      if (email && name) {
        console.log('AuthProvider: Found valid session, checking Firebase auth');

        // Check if Firebase user is still authenticated
        const currentUser = auth.currentUser;
        if (currentUser) {
          console.log('AuthProvider: Firebase user found, restoring session');
          setUser({
            email,
            name,
            firebaseUser: currentUser,
          });
          setLoading(false);
          return;
        }
      }
    }

    console.log('AuthProvider: No valid session found, setting up Firebase listener');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthProvider: Firebase auth state changed', firebaseUser ? 'User logged in' : 'User logged out');

      if (firebaseUser) {
        // Check if we already have a valid session
        if (checkSession()) {
          const email = getCookie('user_email');
          const name = getCookie('user_name');

          if (email && name) {
            console.log('AuthProvider: Using existing session data');
            setUser({
              email,
              name,
              firebaseUser,
            });
            setLoading(false);
            return;
          }
        }

        try {
          console.log('AuthProvider: Getting Firebase ID token for backend auth');
          const token = await firebaseUser.getIdToken(true); // Force refresh
          console.log('AuthProvider: Firebase token obtained, calling backend');

          const response = await authAPI.login({
            auth_type: 0,
            token: token,
          });

          console.log('AuthProvider: Backend login response:', response);

          if (response.result === 'ok') {
            setUserData(response.data, firebaseUser);
          } else {
            console.error('AuthProvider: Backend login failed:', response);
            clearUserData();
            await auth.signOut();
          }
        } catch (error) {
          console.error('AuthProvider: Backend login error:', error);
          clearUserData();
          await auth.signOut();
        }
      } else {
        console.log('AuthProvider: No Firebase user, clearing session');
        clearUserData();
      }
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const login = async (token: string) => {
    try {
      console.log('AuthProvider: Manual login called');
      const response = await authAPI.login({
        auth_type: 0,
        token,
      });

      console.log('AuthProvider: Manual login response:', response);

      if (response.result === 'ok') {
        // User data will be set through onAuthStateChanged
        return;
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error('AuthProvider: Manual login error:', error);
      clearUserData();
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthProvider: Logout called');
      await authAPI.logout();
      await auth.signOut();
      clearUserData();
      console.log('AuthProvider: Logout completed');
    } catch (error) {
      console.error('AuthProvider: Logout error:', error);
      // Force logout even if API call fails
      await auth.signOut();
      clearUserData();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkSession,
  };

  console.log('AuthProvider: Rendering with state:', {
    hasUser: !!user,
    loading,
    userEmail: user?.email,
    sessionValid: checkSession()
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
