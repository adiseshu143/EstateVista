'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types/user';
import {
  loginWithEmailPassword,
  registerWithEmailPassword,
  logoutUser,
  resetUserPassword,
  subscribeToAuthChanges,
} from '@/lib/firebase/auth';
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  fetchUsersList,
} from '@/lib/firebase/users';
import {
  getUserFavoritesFromFirestore,
  togglePropertyFavoriteInFirestore,
} from '@/lib/firebase/favorites';
import { getUserFavorites, toggleUserFavorite } from '@/lib/firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  favorites: string[];
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoRole: (role: UserRole) => Promise<void>;
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CURRENT_USER_KEY = 'estatevista_current_user_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      // 1. Subscribe to Firebase Auth if configured
      unsubscribe = subscribeToAuthChanges(async (fbUser) => {
        if (fbUser) {
          try {
            let profile = await getUserProfile(fbUser.uid);
            if (!profile) {
              // Auto-create user profile with default role 'user'
              profile = await createUserProfile({
                uid: fbUser.uid,
                email: fbUser.email || '',
                name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                role: 'user', // Default role MUST be 'user'
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
            setUser(profile);
            if (typeof window !== 'undefined') {
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
            }
            const userFavs = await getUserFavoritesFromFirestore(profile.uid);
            setFavorites(userFavs);
          } catch (err) {
            console.warn('Auth state profile resolution error:', err);
          }
        } else {
          // Check for saved local demo session if no Firebase user
          if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(CURRENT_USER_KEY);
            if (saved) {
              try {
                const parsed = JSON.parse(saved) as UserProfile;
                setUser(parsed);
                setFavorites(getUserFavorites(parsed.uid));
              } catch {
                setUser(null);
                setFavorites(getUserFavorites('guest'));
              }
            } else {
              setUser(null);
              setFavorites(getUserFavorites('guest'));
            }
          }
        }
        setLoading(false);
      });
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    // 1. Try Firebase Auth
    const res = await loginWithEmailPassword(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
      }
      const favs = await getUserFavoritesFromFirestore(res.user.uid);
      setFavorites(favs);
      setLoading(false);
      return { success: true };
    }

    // 2. If Firebase Auth returned an explicit error (and Firebase is configured), return error
    if (res.error && !res.error.includes('not configured')) {
      setLoading(false);
      return { success: false, error: res.error };
    }

    // 3. Fallback for demo showcase mode
    try {
      const users = await fetchUsersList();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existing) {
        if (!existing.active) {
          setLoading(false);
          return { success: false, error: 'Your account has been deactivated. Please contact support.' };
        }
        setUser(existing);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existing));
        setFavorites(getUserFavorites(existing.uid));
        setLoading(false);
        return { success: true };
      }

      // Default fallback account (Role MUST always be 'user')
      const newUser: UserProfile = {
        uid: `user-${Date.now()}`,
        email,
        name: email.split('@')[0].replace('.', ' '),
        role: 'user', // Default role
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setFavorites(getUserFavorites(newUser.uid));
      setLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      return { success: false, error: msg };
    }
  };

  const signup = async (name: string, email: string, pass: string, phone?: string) => {
    setLoading(true);
    // 1. Try Firebase Auth registration
    const res = await registerWithEmailPassword(name, email, pass, phone);
    if (res.success && res.user) {
      setUser(res.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
      }
      setFavorites([]);
      setLoading(false);
      return { success: true };
    }

    // 2. If Firebase returned explicit error, return it
    if (res.error && !res.error.includes('not configured')) {
      setLoading(false);
      return { success: false, error: res.error };
    }

    // 3. Fallback for demo mode registration
    try {
      const users = await fetchUsersList();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        setLoading(false);
        return { success: false, error: 'An account with this email address already exists.' };
      }

      const newUser: UserProfile = {
        uid: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim(),
        role: 'user', // Default role MUST be 'user'
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createUserProfile(newUser);
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setFavorites([]);
      setLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    setFavorites(getUserFavorites('guest'));
  };

  const resetPassword = async (email: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    return resetUserPassword(email);
  };

  const loginAsDemoRole = async (targetRole: UserRole) => {
    setLoading(true);
    const users = await fetchUsersList();
    const demoUser = users.find((u) => u.role === targetRole) || {
      uid: `demo-${targetRole}`,
      name:
        targetRole === 'admin'
          ? 'Aditya Varma (Admin)'
          : targetRole === 'agent'
          ? 'Rajesh Sharma (Agent)'
          : 'Rohan Deshmukh (Client)',
      email: `${targetRole}@estatevista.com`,
      role: targetRole,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
    }
    setFavorites(getUserFavorites(demoUser.uid));
    setLoading(false);
  };

  const toggleFavorite = async (propertyId: string) => {
    const userUid = user ? user.uid : 'guest';
    const updated = await togglePropertyFavoriteInFirestore(userUid, propertyId);
    setFavorites(updated);
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  const updateCurrentUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    // SECURITY RULE: Normal users cannot modify their own role
    const isCallerAdmin = user.role === 'admin';
    const updated = await updateUserProfile(user.uid, updates, isCallerAdmin);
    if (updated) {
      const merged = { ...user, ...updated };
      setUser(merged);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(merged));
      }
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        favorites,
        login,
        signup,
        logout,
        resetPassword,
        loginAsDemoRole,
        toggleFavorite,
        isFavorite,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
