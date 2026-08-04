import {
  UserRole,
  AccountType,
  Plan,
  TicketStatus,
  ContactSource,
  Channel,
  FeedbackAction,
} from './enums';

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// ============================================
// AUTH TYPES
// ============================================

export interface RegisterRequest {
  name: string;
  businessName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserInfo;
  account: AccountInfo;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AccountInfo {
  id: string;
  name: string;
}

// ============================================
// LOCATION TYPES
// ============================================

export interface Location {
  id: string;
  accountId: string;
  name: string;
  address?: string;
  phone?: string;
  googlePlaceId?: string;
  googleReviewUrl?: string;
  feedbackSlug: string;
  branding: LocationBranding;
  settings: LocationSettings;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocationBranding {
  primaryColor?: string;
  logo?: string;
  thankYouTitle?: string;
  thankYouSubtitle?: string;
  positiveMessage?: string;
  negativeMessage?: string;
}

export interface LocationSettings {
  reviewGateThreshold?: number;
  notifyEmail?: string;
  notifyWhatsapp?: string;
}

export interface CreateLocationRequest {
  name: string;
  address?: string;
  phone?: string;
  googlePlaceId?: string;
  googleReviewUrl?: string;
  branding?: Partial<LocationBranding>;
  settings?: Partial<LocationSettings>;
}

export interface UpdateLocationRequest extends Partial<CreateLocationRequest> {}

// ============================================
// FEEDBACK TYPES
// ============================================

export interface Feedback {
  id: string;
  locationId: string;
  contactId?: string;
  visitId?: string;
  rating: number;
  comment?: string;
  directedToGoogle: boolean;
  createdAt: string;
  contact?: ContactBasic;
}

export interface SubmitFeedbackRequest {
  rating: number;
  comment?: string;
  name?: string;
  email?: string;
  phone?: string;
  consentChannels?: Channel[];
}

export interface FeedbackResult {
  feedbackId: string;
  action: FeedbackAction;
  googleReviewUrl?: string;
  message: string;
}

export interface FeedbackStats {
  total: number;
  averageRating: number;
  directedToGoogle: number;
  distribution: Record<number, number>;
}

// ============================================
// CONTACT TYPES
// ============================================

export interface Contact {
  id: string;
  locationId: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  source: ContactSource;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ContactBasic {
  id: string;
  name?: string;
  email?: string;
}

// ============================================
// TICKET TYPES
// ============================================

export interface InternalTicket {
  id: string;
  locationId: string;
  feedbackId: string;
  status: TicketStatus;
  assignedTo?: string;
  notes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  feedback?: Feedback;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  notes?: string;
  assignedTo?: string;
}

// ============================================
// PUBLIC FORM TYPES
// ============================================

export interface LocationFormConfig {
  id: string;
  name: string;
  feedbackSlug: string;
  googleReviewUrl?: string;
  branding: LocationBranding;
  settings: LocationSettings;
  active: boolean;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardOverview {
  totalFeedback: number;
  averageRating: number;
  directedToGoogle: number;
  openTickets: number;
  feedbackThisWeek: number;
  ratingTrend: number; // positive or negative change
}
