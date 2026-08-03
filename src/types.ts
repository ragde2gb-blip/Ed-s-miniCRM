export type LeadStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'PROPOSAL SENT' | 'WON' | 'LOST';

export type LeadSource = 
  | 'Facebook Ads' 
  | 'Website' 
  | 'Messenger' 
  | 'Referral' 
  | 'Organic' 
  | 'LinkedIn' 
  | 'Cold Email'
  | 'Google Search';

export interface Touchpoint {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'social';
  date: string;
  notes: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  business: string;
  email: string;
  phone?: string;
  socialOrWeb: string;
  source: LeadSource;
  status: LeadStatus;
  assignedDate: string;
  contactedDate?: string;
  closedDate?: string;
  nextAction: {
    label: string;
    type: 'event' | 'done' | 'warning' | 'verified' | 'history' | 'urgent';
    dateString?: string;
  };
  dealValue: number;
  priority: 'low' | 'medium' | 'high';
  initials: string;
  avatarBg?: string;
  notes?: string;
  touchpoints?: Touchpoint[];
}

export interface TaskItem {
  id: string;
  title: string;
  leadId?: string;
  leadName?: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'Call' | 'Email' | 'Proposal' | 'Meeting' | 'Review';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  type: 'status_change' | 'new_lead' | 'note_added' | 'task_completed' | 'email_sent';
}

export interface CampaignStat {
  channel: LeadSource;
  leadsThisMonth: number;
  conversionRate: number;
  totalRevenue: number;
  qualityScore: number;
  costPerLead: number;
  trend: string;
}
