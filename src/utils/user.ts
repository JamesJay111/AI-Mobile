import { auth } from '../config/firebase';

/**
 * Get current user ID
 * Returns the authenticated user's UID, or throws if not authenticated
 */
export function getCurrentUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.error('[TRACE] getCurrentUserId: No authenticated user found');
    throw new Error('User not authenticated. Please wait for authentication to complete.');
  }
  return uid;
}

/**
 * Wait for authentication to complete
 * Returns the user UID once authenticated
 */
export async function waitForAuth(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (auth.currentUser) {
      resolve(auth.currentUser.uid);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        reject(new Error('Authentication failed'));
      }
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      unsubscribe();
      reject(new Error('Authentication timeout'));
    }, 10000);
  });
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
