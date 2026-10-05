import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Lead, LeadStatus } from '@/types/lead';

const STORAGE_LEADS_KEY = 'estatevista_leads_v1';

function getLocalLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_LEADS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

function setLocalLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error('Local storage set leads error:', err);
  }
}

/**
 * Submit a new inquiry/contact form to Firestore `inquiries` and `leads` collections.
 */
export async function submitInquiry(
  data: Omit<Lead, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<Lead> {
  const newId = `inq-${Date.now()}`;
  const now = new Date().toISOString();

  const newInquiry: Lead = {
    ...data,
    id: newId,
    status: 'New',
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      // Save to `inquiries` collection (and `leads` collection for compatibility)
      await setDoc(doc(db, 'inquiries', newId), newInquiry);
      await setDoc(doc(db, 'leads', newId), newInquiry);
    } catch (err) {
      console.warn('Firestore submitInquiry failed:', err);
    }
  }

  const list = getLocalLeads();
  list.unshift(newInquiry);
  setLocalLeads(list);

  return newInquiry;
}

/**
 * Fetch inquiries for Admin, Agent, or User.
 */
export async function fetchInquiries(options?: {
  agentId?: string;
  userId?: string;
}): Promise<Lead[]> {
  if (isFirebaseConfigured && db) {
    try {
      let q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      
      if (options?.agentId) {
        q = query(collection(db, 'inquiries'), where('assignedAgentId', '==', options.agentId), orderBy('createdAt', 'desc'));
      } else if (options?.userId) {
        q = query(collection(db, 'inquiries'), where('userId', '==', options.userId), orderBy('createdAt', 'desc'));
      }

      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Lead);
      }
    } catch (err) {
      console.warn('Firestore fetchInquiries failed, using local store:', err);
    }
  }

  let list = getLocalLeads();
  if (options?.agentId) {
    list = list.filter((l) => l.assignedAgentId === options.agentId);
  }
  if (options?.userId) {
    list = list.filter((l) => l.userId === options.userId || l.email === options.userId);
  }

  return list;
}

/**
 * Update inquiry status or notes in Firestore.
 */
export async function updateInquiryStatus(
  id: string,
  status: LeadStatus,
  notes?: string,
  assignedAgentId?: string,
  assignedAgentName?: string
): Promise<Lead | null> {
  const now = new Date().toISOString();
  const updates: Partial<Lead> = { status, updatedAt: now };
  if (notes !== undefined) updates.notes = notes;
  if (assignedAgentId !== undefined) updates.assignedAgentId = assignedAgentId;
  if (assignedAgentName !== undefined) updates.assignedAgentName = assignedAgentName;

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'inquiries', id), updates);
      await updateDoc(doc(db, 'leads', id), updates);
    } catch (err) {
      console.warn(`Firestore updateInquiryStatus failed for ${id}:`, err);
    }
  }

  const list = getLocalLeads();
  const idx = list.findIndex((l) => l.id === id);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates };
  setLocalLeads(list);
  return list[idx];
}
