import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDhVaaonY2dmpb6HQGG2jMMP7Y_nI6kwcY",
  authDomain: "hobbytan-ai.firebaseapp.com",
  projectId: "hobbytan-ai",
  storageBucket: "hobbytan-ai.firebasestorage.app",
  messagingSenderId: "605948498053",
  appId: "1:605948498053:web:d7e06d6c0b0e0a2a3b4c5d",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default firebaseConfig;
