export type UserRole = 'user' | 'agent' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  agencyName?: string;
  licenseNumber?: string;
  bio?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentStats {
  assignedPropertiesCount: number;
  activeLeadsCount: number;
  scheduledVisitsCount: number;
  closedDealsCount: number;
  rating: number;
  reviewCount: number;
}
