export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Visit Scheduled'
  | 'Converted'
  | 'Closed';

export type EnquiryType = 'general' | 'property' | 'visit' | 'callback';
export type ContactMethod = 'email' | 'phone' | 'whatsapp';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  propertySlug?: string;
  propertyPrice?: number;
  propertyLocation?: string;
  propertyImage?: string;
  userId?: string; // If registered user
  enquiryType: EnquiryType;
  preferredContactMethod?: ContactMethod;
  assignedAgentId?: string;
  assignedAgentName?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
