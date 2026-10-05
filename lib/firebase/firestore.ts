import { Property, PropertyFormData } from '@/types/property';
import { Lead, LeadStatus } from '@/types/lead';
import { Visit, VisitStatus } from '@/types/visit';
import { UserProfile, UserRole } from '@/types/user';
import { db, isFirebaseConfigured } from './config';
import { fetchAllProperties, fetchPropertyBySlug, createProperty, updateProperty, deleteProperty } from './properties';
import { submitInquiry, fetchInquiries, updateInquiryStatus } from './inquiries';
import { getUserProfile, createUserProfile, updateUserProfile, fetchUsersList } from './users';
import { getUserFavoritesFromFirestore, togglePropertyFavoriteInFirestore } from './favorites';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  PROPERTIES: 'estatevista_properties_v1',
  LEADS: 'estatevista_leads_v1',
  VISITS: 'estatevista_visits_v1',
  USERS: 'estatevista_users_v1',
  FAVORITES_PREFIX: 'estatevista_favs_',
};

// Re-export modular property operations
export { fetchAllProperties, fetchPropertyBySlug, createProperty, updateProperty, deleteProperty };

// Re-export modular inquiry/lead operations
export { submitInquiry as submitLead, fetchInquiries as fetchLeads, updateInquiryStatus as updateLeadStatus };

// Re-export user operations
export { getUserProfile, createUserProfile, updateUserProfile as updateUserRoleOrStatus, fetchUsersList };

// Re-export favorites
export { getUserFavoritesFromFirestore, togglePropertyFavoriteInFirestore };

// Synchronous local favorites helper for immediate state updates
export function getUserFavorites(userKey: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.FAVORITES_PREFIX}${userKey}`);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function toggleUserFavorite(userKey: string, propertyId: string): string[] {
  if (typeof window === 'undefined') return [];
  const key = `${STORAGE_KEYS.FAVORITES_PREFIX}${userKey}`;
  const favs = getUserFavorites(userKey);
  const exists = favs.includes(propertyId);
  const updated = exists ? favs.filter((id) => id !== propertyId) : [...favs, propertyId];
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error('Local storage set favorite error:', err);
  }
  return updated;
}

// ----------------------------------------------------------------------
// VISIT SCHEDULING OPERATIONS
// ----------------------------------------------------------------------

export async function scheduleVisit(visitData: Omit<Visit, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Visit> {
  const newId = `visit-${Date.now()}`;
  const now = new Date().toISOString();
  const newVisit: Visit = {
    ...visitData,
    id: newId,
    status: 'Requested',
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'visits', newId), newVisit);
    } catch (err) {
      console.warn('Firestore scheduleVisit failed:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VISITS);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(newVisit);
      localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(list));
    } catch (err) {
      console.error('Local storage scheduleVisit error:', err);
    }
  }

  return newVisit;
}

export async function fetchVisits(options?: { agentId?: string; userId?: string }): Promise<Visit[]> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VISITS);
    let list: Visit[] = raw ? JSON.parse(raw) : [];

    if (options?.agentId) {
      list = list.filter((v) => v.assignedAgentId === options.agentId);
    }
    if (options?.userId) {
      list = list.filter((v) => v.userId === options.userId || v.userEmail === options.userId);
    }
    return list;
  } catch {
    return [];
  }
}

export async function updateVisitStatus(id: string, status: VisitStatus, notes?: string): Promise<Visit | null> {
  const now = new Date().toISOString();
  const updates: Partial<Visit> = { status, updatedAt: now };
  if (notes !== undefined) updates.notes = notes;

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'visits', id), updates);
    } catch (err) {
      console.warn('Firestore updateVisitStatus failed:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VISITS);
      const list: Visit[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((v) => v.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(list));
        return list[idx];
      }
    } catch (err) {
      console.error('Local storage updateVisitStatus error:', err);
    }
  }

  return null;
}

export function initLocalDataStore(): void {
  // Utility for fallback store initialization
}

export async function resetDemoData(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
  localStorage.removeItem(STORAGE_KEYS.LEADS);
  localStorage.removeItem(STORAGE_KEYS.VISITS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
}
