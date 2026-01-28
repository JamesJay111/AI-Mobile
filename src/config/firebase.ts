import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { Platform } from 'react-native';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase - 确保只初始化一次
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth - 在 React Native 中使用 AsyncStorage persistence
let auth: Auth;
if (Platform.OS !== 'web') {
  // React Native 环境：延迟导入 AsyncStorage 以避免在 Web 环境中出错
  try {
    // 动态导入 AsyncStorage（仅在 React Native 环境中）
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (error: any) {
      // 如果已经初始化，使用 getAuth
      if (error.code === 'auth/already-initialized') {
        auth = getAuth(app);
      } else {
        // 如果 AsyncStorage 不可用，回退到 getAuth（不持久化）
        console.warn('AsyncStorage not available, using getAuth without persistence:', error);
        auth = getAuth(app);
      }
    }
  } catch (importError) {
    // 如果无法导入 AsyncStorage，使用 getAuth（不持久化）
    console.warn('AsyncStorage import failed, using getAuth without persistence:', importError);
    auth = getAuth(app);
  }
} else {
  // Web 环境：直接使用 getAuth
  auth = getAuth(app);
}

// Initialize Firebase services
export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
// Cloud Functions 部署在 us-central1，必须显式指定 region
export const functions = getFunctions(app, 'us-central1');

export default app;
