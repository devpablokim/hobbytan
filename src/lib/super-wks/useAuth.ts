'use client';

import { useState, useEffect, useCallback } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import type { Role, User } from './types';
import { users } from './mockData';

const ADMIN_EMAILS = ['tanhyu.kim@gmail.com'];

interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  role: Role;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
}

function buildUserFromFirebase(fbUser: FirebaseUser, role: Role): User {
  const isAdmin = ADMIN_EMAILS.includes(fbUser.email || '');
  const effectiveRole = isAdmin ? 'admin' : role;
  
  // Try to find matching mock user
  const mockUser = users.find(u => u.email === fbUser.email) 
    || users.find(u => u.role === effectiveRole)
    || users[0];
  
  return {
    ...mockUser,
    userId: fbUser.uid,
    displayName: fbUser.displayName || 'User',
    email: fbUser.email || '',
    photoURL: fbUser.photoURL,
    role: effectiveRole,
  };
}

export function useAuth(): AuthState {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>('student');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user && ADMIN_EMAILS.includes(user.email || '')) {
        setRole('admin');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      setRole('student');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  const switchRole = useCallback((newRole: Role) => {
    setRole(newRole);
  }, []);

  const currentUser = firebaseUser ? buildUserFromFirebase(firebaseUser, role) : null;

  return {
    isLoggedIn: !!firebaseUser,
    currentUser,
    firebaseUser,
    role: currentUser?.role || 'student',
    loading,
    login,
    logout,
    switchRole,
  };
}
