import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

const STORAGE_FAVS_PREFIX = 'estatevista_favs_';

function getLocalFavs(userKey: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_FAVS_PREFIX}${userKey}`);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function setLocalFavs(userKey: string, favs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_FAVS_PREFIX}${userKey}`, JSON.stringify(favs));
  } catch (err) {
    console.error('Local storage set favorites error:', err);
  }
}

/**
 * Fetch favorite property IDs for a specific user from Firestore `users/{uid}/favorites`.
 */
export async function getUserFavoritesFromFirestore(userUid: string): Promise<string[]> {
  if (!userUid) return [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'users', userUid, 'favorites'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.id);
      }
    } catch (err) {
      console.warn(`Firestore getUserFavorites failed for ${userUid}:`, err);
    }
  }

  return getLocalFavs(userUid);
}

/**
 * Toggle a property favorite in Firestore `users/{uid}/favorites/{propertyId}` and local storage.
 */
export async function togglePropertyFavoriteInFirestore(
  userUid: string,
  propertyId: string
): Promise<string[]> {
  const currentFavs = getLocalFavs(userUid);
  const exists = currentFavs.includes(propertyId);
  const updatedFavs = exists
    ? currentFavs.filter((id) => id !== propertyId)
    : [...currentFavs, propertyId];

  setLocalFavs(userUid, updatedFavs);

  if (isFirebaseConfigured && db && userUid && userUid !== 'guest') {
    try {
      const favRef = doc(db, 'users', userUid, 'favorites', propertyId);
      if (exists) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          propertyId,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn(`Firestore togglePropertyFavorite failed for ${userUid}:`, err);
    }
  }

  return updatedFavs;
}
