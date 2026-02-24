import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Environment variable validation
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
] as const;

const validateEnvVars = (): void => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missing.join(", ")}`
    );
  }
};

// Process private key - handle both direct and escaped newlines
const processPrivateKey = (key: string | undefined): string => {
  if (!key) {
    throw new Error("FIREBASE_PRIVATE_KEY is not defined");
  }
  // Handle escaped newlines from environment variables
  return key.replace(/\\n/g, "\n");
};

// Firebase Admin configuration
const getFirebaseAdminConfig = () => {
  validateEnvVars();

  return {
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: processPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
  };
};

// Singleton instances
let firebaseApp: App | null = null;
let firestoreInstance: Firestore | null = null;

/**
 * Get or initialize Firebase Admin app
 * Uses singleton pattern to prevent multiple initializations
 */
export function getFirebaseApp(): App {
  if (firebaseApp) {
    return firebaseApp;
  }

  const apps = getApps();
  if (apps.length > 0) {
    firebaseApp = apps[0];
    return firebaseApp;
  }

  try {
    firebaseApp = initializeApp(getFirebaseAdminConfig());
    console.log("Firebase Admin initialized successfully");
    return firebaseApp;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

/**
 * Get Firestore instance with lazy initialization
 * Returns cached instance on subsequent calls
 */
export function getFirebaseAdmin(): Firestore {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = getFirebaseApp();
  firestoreInstance = getFirestore(app);

  // Configure Firestore settings for server-side usage
  firestoreInstance.settings({
    ignoreUndefinedProperties: true,
  });

  return firestoreInstance;
}

/**
 * Check if Firebase Admin is properly configured
 * Useful for conditional initialization
 */
export function isFirebaseAdminConfigured(): boolean {
  return requiredEnvVars.every((key) => !!process.env[key]);
}

// Export singleton Firestore instance (lazy initialization)
// Use getFirebaseAdmin() function for explicit control
export const db = (() => {
  // Only initialize if all env vars are present
  // This prevents errors during build time or in non-Firebase environments
  if (isFirebaseAdminConfigured()) {
    try {
      return getFirebaseAdmin();
    } catch (error) {
      console.warn("Firebase Admin initialization deferred:", error);
      return null;
    }
  }
  return null;
})();
