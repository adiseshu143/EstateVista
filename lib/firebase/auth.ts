import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User as FirebaseUser,
  type AuthError,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';
import { getUserProfile, createUserProfile } from './users';
import { UserProfile } from '@/types/user';

/**
 * Converts raw Firebase Auth error codes to user-friendly error messages.
 */
export function formatAuthError(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  const errObj = error as AuthError;
  const code = errObj.code || (errObj as any).message || '';

  switch (code) {
    case 'auth/user-not-found':
      return 'No account exists with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. You can reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console.';
    default:
      if (typeof errObj.message === 'string' && !errObj.message.includes('Firebase:')) {
        return errObj.message;
      }
      return 'Authentication failed. Please check your credentials and try again.';
  }
}

/**
 * Sign in existing user with Firebase Auth.
 */
export async function loginWithEmailPassword(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, error: 'Firebase Auth is not configured in environment.' };
  }

  try {
    const credential = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await getUserProfile(credential.user.uid);
    
    if (profile && !profile.active) {
      await signOut(auth);
      return { success: false, error: 'Your account has been deactivated. Please contact EstateVista support.' };
    }

    return { success: true, user: profile || undefined };
  } catch (err) {
    return { success: false, error: formatAuthError(err) };
  }
}

/**
 * Register a new user with Firebase Auth.
 * Role is ALWAYS initialized to 'user'. Frontend cannot pass agent or admin role.
 */
export async function registerWithEmailPassword(
  name: string,
  email: string,
  pass: string,
  phone?: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, error: 'Firebase Auth is not configured in environment.' };
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = credential.user.uid;
    const now = new Date().toISOString();

    const newProfile: UserProfile = {
      uid,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      phone: phone?.trim() || '',
      role: 'user', // STRICT: Default role must always be 'user'
      active: true,
      createdAt: now,
      updatedAt: now,
    };

    await createUserProfile(newProfile);
    return { success: true, user: newProfile };
  } catch (err) {
    return { success: false, error: formatAuthError(err) };
  }
}

/**
 * Sign out current Firebase Auth user.
 */
export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
  }
}

/**
 * Send password reset email.
 */
export async function resetUserPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseConfigured || !auth) {
    return { success: true }; // Fallback for local demo mode
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err) {
    return { success: false, error: formatAuthError(err) };
  }
}

/**
 * Subscribe to Firebase Auth state changes.
 */
export function subscribeToAuthChanges(callback: (user: FirebaseUser | null) => void): () => void {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
}
