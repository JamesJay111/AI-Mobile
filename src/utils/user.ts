import { auth } from '../config/firebase';

/**
 * Get current user ID
 * TODO: Replace with real Firebase Auth when authentication is implemented
 */
export function getCurrentUserId(): string {
  // For now, return placeholder
  // When Firebase Auth is implemented, use:
  // return auth.currentUser?.uid || 'anonymous';
  return auth.currentUser?.uid || 'current-user';
}

/**
 * Check if current user is Pro
 * TODO: Replace with real Firestore check when subscription system is implemented
 */
export function getCurrentUserIsPro(): boolean {
  // For now, return false (will be passed from App state)
  // When subscription system is implemented, check Firestore:
  // const userDoc = await getDoc(doc(db, 'users', userId));
  // return userDoc.data()?.isPro || false;
  return false;
}
