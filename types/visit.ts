export type VisitStatus =
  | 'Requested'
  | 'Confirmed'
  | 'Rescheduled'
  | 'Completed'
  | 'Cancelled';

export interface Visit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertySlug: string;
  propertyLocation: string;
  propertyImage?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  preferredDate: string;
  preferredTime: string;
  status: VisitStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
