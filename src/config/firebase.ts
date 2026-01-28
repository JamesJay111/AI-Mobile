import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import Constants from 'expo-constants';

// Firebase configuration
// For Expo: Use Constants.expoConfig.extra or process.env
// For Vite/Web: Use import.meta.env (commented out for Expo compatibility)
const getEnvVar = (key: string, defaultValue: string): string => {
  // Try expo-constants first (Expo way)
  if (Constants.expoConfig?.extra?.[key]) {
    return Constants.expoConfig.extra[key] as string;
  }
  // Try process.env (works in both Expo and Node)
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  // Fallback to default
  return defaultValue;
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', "your-api-key"),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', "your-project.firebaseapp.com"),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', "your-project-id"),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', "your-project.appspot.com"),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', "123456789"),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', "your-app-id")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
