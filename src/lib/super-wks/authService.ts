import type { Role, User } from './types';
import { users } from './mockData';
import { isFirebaseConfigured } from './firebase';

// Auth service abstraction - switches between mock and Firebase
// When Firebase is configured, this will use real Google OAuth

export interface AuthService {
  login(role?: Role): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

// Mock implementation
class MockAuthService implements AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('superworkshop_role') as Role;
      const isLoggedIn = localStorage.getItem('superworkshop_loggedin') === 'true';
      if (isLoggedIn && savedRole) {
        this.currentUser = this.getUserByRole(savedRole);
      }
    }
  }

  private getUserByRole(role: Role): User {
    if (role === 'admin') return users.find(u => u.role === 'admin')!;
    if (role === 'team_lead') return users.find(u => u.role === 'team_lead')!;
    return users.find(u => u.role === 'student' && u.teamId === 'team-alpha')!;
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  async login(role?: Role): Promise<User> {
    const savedRole = typeof window !== 'undefined'
      ? localStorage.getItem('superworkshop_role') as Role
      : 'student';
    const selectedRole = role || savedRole || 'student';
    if (typeof window !== 'undefined') {
      localStorage.setItem('superworkshop_loggedin', 'true');
      localStorage.setItem('superworkshop_role', selectedRole);
    }
    this.currentUser = this.getUserByRole(selectedRole);
    this.notify();
    return this.currentUser;
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('superworkshop_loggedin');
    }
    this.currentUser = null;
    this.notify();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
}

// Firebase implementation (placeholder - activate when Firebase is configured)
class FirebaseAuthService implements AuthService {
  async login(_role?: Role): Promise<User> {
    // TODO: Implement Google OAuth with Firebase
    // const provider = new GoogleAuthProvider();
    // const result = await signInWithPopup(auth, provider);
    // const firebaseUser = result.user;
    // Fetch user doc from Firestore, return User
    throw new Error('Firebase Auth not yet implemented');
  }

  async logout(): Promise<void> {
    // TODO: await signOut(auth);
    throw new Error('Firebase Auth not yet implemented');
  }

  getCurrentUser(): User | null {
    // TODO: return mapped Firebase user
    return null;
  }

  onAuthStateChanged(_callback: (user: User | null) => void): () => void {
    // TODO: return auth.onAuthStateChanged(...)
    return () => {};
  }
}

// Factory
export function createAuthService(): AuthService {
  if (isFirebaseConfigured()) {
    return new FirebaseAuthService();
  }
  return new MockAuthService();
}

export const authService = createAuthService();
