import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDVvBkrQlgH4l-3Ub1Zj0YAYjgHM-46xOc",
  authDomain: "hobbytan-ai.firebaseapp.com",
  projectId: "hobbytan-ai",
  storageBucket: "hobbytan-ai.firebasestorage.app",
  messagingSenderId: "1012886362558",
  appId: "1:1012886362558:web:4efbed66e629a653b8c1ef",
  measurementId: "G-QPKC3C593X",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default firebaseConfig;
