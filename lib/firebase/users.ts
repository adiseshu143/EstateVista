import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { UserProfile, UserRole } from '@/types/user';
import { SEED_AGENTS } from '@/data/seed/agents';

const STORAGE_USERS_KEY = 'estatevista_users_v1';

function getLocalUsers(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UserProfile[];
  } catch {
    return [];
  }
}

function setLocalUsers(users: UserProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Local storage user update error:', err);
  }
}

/**
 * Fetch a single user profile from Firestore `users/{uid}` (or local fallback).
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn(`Firestore getUserProfile failed for ${uid}, checking fallback:`, err);
    }
  }

  // Fallback to local storage or seed accounts
  const localList = getLocalUsers();
  const found = localList.find((u) => u.uid === uid);
  if (found) return found;

  // Check seed agents
  const seedAgent = SEED_AGENTS.find((a) => a.uid === uid);
  if (seedAgent) {
    return {
      uid: seedAgent.uid,
      name: seedAgent.name,
      email: seedAgent.email,
      phone: seedAgent.phone,
      role: seedAgent.role,
      avatarUrl: seedAgent.avatarUrl,
      agencyName: seedAgent.agencyName,
      licenseNumber: seedAgent.licenseNumber,
      bio: seedAgent.bio,
      active: seedAgent.active,
      createdAt: seedAgent.createdAt,
      updatedAt: seedAgent.updatedAt,
    };
  }

  return null;
}

/**
 * Create a new user profile document in Firestore `users/{uid}`.
 * Enforces role='user' for new accounts.
 */
export async function createUserProfile(profile: UserProfile): Promise<UserProfile> {
  const payload: UserProfile = {
    ...profile,
    role: profile.role || 'user', // Default is always 'user'
    active: profile.active !== false,
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', profile.uid), payload);
    } catch (err) {
      console.warn('Firestore createUserProfile setDoc failed:', err);
    }
  }

  const list = getLocalUsers();
  const idx = list.findIndex((u) => u.uid === profile.uid);
  if (idx > -1) {
    list[idx] = payload;
  } else {
    list.unshift(payload);
  }
  setLocalUsers(list);

  return payload;
}

/**
 * Update user profile.
 * Prevents non-admins from mutating the `role` field.
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>,
  isCallerAdmin = false
): Promise<UserProfile | null> {
  const safeUpdates = { ...updates, updatedAt: new Date().toISOString() };

  // SECURITY RULE: Strip out `role` changes if not performed by an admin
  if (!isCallerAdmin && 'role' in safeUpdates) {
    delete safeUpdates.role;
  }

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'users', uid), safeUpdates);
    } catch (err) {
      console.warn(`Firestore updateUserProfile failed for ${uid}:`, err);
    }
  }

  const list = getLocalUsers();
  const idx = list.findIndex((u) => u.uid === uid);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...safeUpdates };
  setLocalUsers(list);

  return list[idx];
}

/**
 * Fetch all user profiles for Admin dashboard.
 */
export async function fetchUsersList(): Promise<UserProfile[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as UserProfile);
      }
    } catch (err) {
      console.warn('Firestore fetchUsersList failed, using local store:', err);
    }
  }

  return getLocalUsers();
}
