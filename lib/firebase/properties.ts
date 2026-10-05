import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Property, PropertyFormData } from '@/types/property';
import { SEED_PROPERTIES } from '@/data/seed/properties';

const STORAGE_PROPERTIES_KEY = 'estatevista_properties_v1';

function getLocalProperties(): Property[] {
  if (typeof window === 'undefined') return SEED_PROPERTIES;
  try {
    const raw = localStorage.getItem(STORAGE_PROPERTIES_KEY);
    if (!raw) return SEED_PROPERTIES;
    const parsed = JSON.parse(raw) as Property[];
    return parsed.length > 0 ? parsed : SEED_PROPERTIES;
  } catch {
    return SEED_PROPERTIES;
  }
}

function setLocalProperties(properties: Property[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PROPERTIES_KEY, JSON.stringify(properties));
  } catch (err) {
    console.error('Local storage set properties error:', err);
  }
}

/**
 * Fetch all properties from Firestore.
 * Automatically falls back to existing seed showcase data if Firestore is empty or unconfigured.
 */
export async function fetchAllProperties(): Promise<Property[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Property));
      }
    } catch (err) {
      console.warn('Firestore fetchAllProperties notice (using showcase seed data):', err);
    }
  }

  return getLocalProperties();
}

/**
 * Fetch a single property by slug or ID.
 */
export async function fetchPropertyBySlug(slugOrId: string): Promise<Property | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'properties', slugOrId));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Property;
      }
    } catch {
      // Ignore and fallback to list lookup
    }
  }

  const all = await fetchAllProperties();
  const found = all.find((p) => p.slug === slugOrId || p.id === slugOrId);
  return found || null;
}

/**
 * Create a new property in Firestore `properties/{id}`.
 */
export async function createProperty(data: PropertyFormData): Promise<Property> {
  const newId = `prop-${Date.now()}`;
  const now = new Date().toISOString();
  
  const newProperty: Property = {
    ...data,
    id: newId,
    viewsCount: 0,
    favoritesCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'properties', newId), newProperty);
    } catch (err) {
      console.warn('Firestore createProperty failed:', err);
    }
  }

  const list = getLocalProperties();
  const updatedList = [newProperty, ...list];
  setLocalProperties(updatedList);

  return newProperty;
}

/**
 * Update property details in Firestore.
 */
export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  const safeUpdates = { ...updates, updatedAt: new Date().toISOString() };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'properties', id), safeUpdates);
    } catch (err) {
      console.warn(`Firestore updateProperty failed for ${id}:`, err);
    }
  }

  const list = getLocalProperties();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...safeUpdates };
  setLocalProperties(list);
  return list[idx];
}

/**
 * Delete a property from Firestore.
 */
export async function deleteProperty(id: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (err) {
      console.warn(`Firestore deleteProperty failed for ${id}:`, err);
    }
  }

  const list = getLocalProperties();
  const filtered = list.filter((p) => p.id !== id);
  setLocalProperties(filtered);
  return true;
}
