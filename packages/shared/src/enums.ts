// ============================================
// USER ROLES
// ============================================

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  STAFF = 'staff',
  VIEWER = 'viewer',
}

// ============================================
// ACCOUNT TYPES
// ============================================

export enum AccountType {
  BUSINESS = 'business',
  AGENCY = 'agency',
}

// ============================================
// PLANS
// ============================================

export enum Plan {
  BASIC = 'basic',
  ADVANCED = 'advanced',
  AGENCY = 'agency',
}

// ============================================
// TICKET STATUS
// ============================================

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

// ============================================
// CONTACT SOURCE
// ============================================

export enum ContactSource {
  FEEDBACK = 'feedback',
  IMPORT = 'import',
  REFERRAL = 'referral',
  MANUAL = 'manual',
}

// ============================================
// NOTIFICATION CHANNELS
// ============================================

export enum Channel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
}

// ============================================
// FEEDBACK ACTION (Review Gate result)
// ============================================

export enum FeedbackAction {
  REDIRECT_GOOGLE = 'redirect_google',
  CAPTURED_PRIVATE = 'captured_private',
}

// ============================================
// REVIEW STATUS (Fase 2)
// ============================================

export enum ReviewStatus {
  NEW = 'new',
  RESPONDED = 'responded',
  DRAFT_PENDING = 'draft_pending',
  IGNORED = 'ignored',
}

// ============================================
// NOTIFICATION STATUS
// ============================================

export enum NotificationStatus {
  QUEUED = 'queued',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  OPENED = 'opened',
  CLICKED = 'clicked',
}

// ============================================
// SYSTEM EVENTS
// ============================================

export enum SystemEvent {
  VISIT_REGISTERED = 'visit.registered',
  FEEDBACK_RECEIVED = 'feedback.received',
  FEEDBACK_POSITIVE = 'feedback.positive',
  FEEDBACK_NEGATIVE = 'feedback.negative',
  REVIEW_NEW = 'review.new',
  REVIEW_RESPONDED = 'review.responded',
  REFERRAL_CREATED = 'referral.created',
  REFERRAL_CONVERTED = 'referral.converted',
  CONTACT_OPTED_IN = 'contact.opted_in',
  SEQUENCE_STEP_DUE = 'sequence.step_due',
}
