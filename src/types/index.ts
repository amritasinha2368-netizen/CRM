export type UserRole = 'super_admin' | 'crm_admin' | 'team_leader' | 'counsellor' | 'admissions';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone: string;
  center: string;
  teamId?: string;
  isActive: boolean;
  createdAt: string;
}

export type LeadStatus =
  | 'new' | 'assigned' | 'contacted' | 'interested' | 'counselling'
  | 'visit' | 'application' | 'documents' | 'payment' | 'enrolled' | 'lost';

export type LeadSource =
  | 'website' | 'google_ads' | 'meta_ads' | 'instagram' | 'whatsapp'
  | 'walk_in' | 'referral' | 'event' | 'csv_import' | 'api' | 'landing_page' | 'other';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  city: string;
  address?: string;
  qualification: string;
  courseId: string;
  centerId: string;
  batchId?: string;
  source: LeadSource;
  campaignId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  message?: string;
  enquiryDate: string;
  status: LeadStatus;
  leadScore: number;
  assignedTo?: string;
  teamLeaderId?: string;
  lostReason?: string;
  customFields?: Record<string, string>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  fee: number;
  duration: string;
  centerIds: string[];
  isActive: boolean;
  icon?: string;
}

export interface Batch {
  id: string;
  courseId: string;
  name: string;
  centerId: string;
  startDate: string;
  timing: string;
  capacity: number;
  enrolled: number;
  isActive: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  source: LeadSource;
  spend: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  leadsCount: number;
  conversions: number;
  description?: string;
}

export interface Call {
  id: string;
  leadId: string;
  counsellorId: string;
  direction: 'inbound' | 'outbound';
  duration: number;
  startTime: string;
  disposition: string;
  notes?: string;
  recordingUrl?: string;
  aiSummary?: AISummary;
}

export interface AISummary {
  transcript: string;
  summary: string;
  intent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  interestLevel: 'high' | 'medium' | 'low';
  objections: string[];
  budgetConcerns: boolean;
  competitorMentions: string[];
  parentInvolvement: boolean;
  nextBestAction: string;
  callScore: {
    greeting: number;
    discovery: number;
    courseExplanation: number;
    objectionHandling: number;
    accuracy: number;
    closing: number;
    overall: number;
  };
}

export interface FollowUp {
  id: string;
  leadId: string;
  counsellorId: string;
  dueDate: string;
  type: 'call' | 'whatsapp' | 'email' | 'sms' | 'visit';
  notes: string;
  status: 'pending' | 'completed' | 'snoozed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Application {
  id: string;
  leadId: string;
  studentId?: string;
  courseId: string;
  centerId: string;
  batchId: string;
  applicationDate: string;
  status: 'draft' | 'submitted' | 'documents_pending' | 'verified' | 'approved' | 'enrolled' | 'rejected';
  scholarship?: number;
  discount?: number;
  totalFee: number;
}

export interface Payment {
  id: string;
  applicationId: string;
  leadId: string;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  scholarship: number;
  discount: number;
  installments: Installment[];
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

export interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  transactionId?: string;
  receiptUrl?: string;
  method?: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Document {
  id: string;
  leadId: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'missing';
  version: number;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'call' | 'whatsapp' | 'sms' | 'email' | 'note' | 'follow_up' | 'document' | 'payment' | 'status_change' | 'assignment';
  description: string;
  timestamp: string;
  userId: string;
  metadata?: Record<string, string>;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  isActive: boolean;
  lastRun?: string;
  runsCount: number;
}

export interface Template {
  id: string;
  name: string;
  type: 'whatsapp' | 'sms' | 'email';
  subject?: string;
  content: string;
  variables: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Center {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  centerId?: string;
  courseId?: string;
  source?: LeadSource;
  status?: LeadStatus;
}
