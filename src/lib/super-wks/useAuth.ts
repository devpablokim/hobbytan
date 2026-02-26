'use client';

import { useState, useEffect, useCallback } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { getUserDoc, isAdminEmail, type FirestoreUser } from './firestoreService';
import { toAppUser } from './userAdapter';
import type { Role, User } from './types';

export type UserState = 'loading' | 'logged_out' | 'needs_onboarding' | 'pending_approval' | 'active' | 'suspended';

interface AuthState {
  isLoggedIn: boolean;
  userState: UserState;
  firestoreUser: FirestoreUser | null;
  firebaseUser: FirebaseUser | null;
  /** Legacy User object for child components (bridge adapter) */
  appUser: User | null;
  role: Role;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firestoreUser, setFirestoreUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState<UserState>('loading');

  const checkUserState = useCallback(async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      setFirestoreUser(null);
      setUserState('logged_out');
      setLoading(false);
      return;
    }

    try {
      const fsUser = await getUserDoc(fbUser.uid);
      setFirestoreUser(fsUser);

      if (!fsUser) {
        // No Firestore doc → needs onboarding
        setUserState('needs_onboarding');
      } else if (fsUser.status === 'pending') {
        setUserState('pending_approval');
      } else if (fsUser.status === 'suspended') {
        setUserState('suspended');
      } else if (fsUser.status === 'active' || isAdminEmail(fbUser.email || '')) {
        setUserState('active');
      } else {
        setUserState('needs_onboarding');
      }
    } catch (error) {
      console.error('Error checking user state:', error);
      // Fallback: if Firestore fails, check if admin
      if (isAdminEmail(fbUser.email || '')) {
        setUserState('active');
      } else {
        setUserState('needs_onboarding');
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      checkUserState(user);
    });
    return () => unsubscribe();
  }, [checkUserState]);

  const login = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setFirestoreUser(null);
      setUserState('logged_out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (firebaseUser) {
      await checkUserState(firebaseUser);
    }
  }, [firebaseUser, checkUserState]);

  const isAdmin = isAdminEmail(firebaseUser?.email || '');
  const role: Role = isAdmin ? 'admin' : (firestoreUser?.role || 'student');
  const appUser = firebaseUser ? toAppUser(firebaseUser, firestoreUser) : null;

  return {
    isLoggedIn: !!firebaseUser,
    userState,
    firestoreUser,
    firebaseUser,
    appUser,
    role,
    loading,
    isAdmin,
    login,
    logout,
    refreshUser,
  };
}
