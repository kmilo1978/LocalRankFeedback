// ============================================
// APP CONSTANTS
// ============================================

export const APP_NAME = 'LocalRank Feedback';
export const APP_VERSION = '0.1.0';

// ============================================
// DEFAULTS
// ============================================

export const DEFAULT_REVIEW_GATE_THRESHOLD = 4;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const MAX_COMMENT_LENGTH = 2000;
export const MIN_PASSWORD_LENGTH = 8;

// ============================================
// RATING
// ============================================

export const MIN_RATING = 1;
export const MAX_RATING = 5;
export const POSITIVE_RATINGS = [4, 5];
export const NEGATIVE_RATINGS = [1, 2, 3];

// ============================================
// REFERRALS (Fase 3)
// ============================================

export const DEFAULT_REFERRAL_DELAY_DAYS = 20;
export const DEFAULT_REFERRAL_MIN_RATING = 4;
export const REFERRAL_CODE_LENGTH = 8;

// ============================================
// RATE LIMITS
// ============================================

export const RATE_LIMITS = {
  PANEL_API: { requests: 100, windowMs: 60_000 },
  FEEDBACK_FORM: { requests: 30, windowMs: 60_000 },
  WEBHOOK: { requests: 1000, windowMs: 60_000 },
  PUBLIC_LINKS: { requests: 60, windowMs: 60_000 },
} as const;

// ============================================
// PLAN LIMITS
// ============================================

export const PLAN_LIMITS = {
  basic: {
    maxLocations: 1,
    maxContactsPerMonth: 500,
    smsCreditsMonthly: 0,
    features: ['feedback', 'review_gate', 'ai_responses_positive'],
  },
  advanced: {
    maxLocations: 5,
    maxContactsPerMonth: 2000,
    smsCreditsMonthly: 200,
    features: [
      'feedback',
      'review_gate',
      'ai_responses_all',
      'remarketing',
      'referrals',
      'whatsapp',
    ],
  },
  agency: {
    maxLocations: 50,
    maxContactsPerMonth: 10000,
    smsCreditsMonthly: 1000,
    features: [
      'feedback',
      'review_gate',
      'ai_responses_all',
      'remarketing',
      'referrals',
      'whatsapp',
      'whitelabel',
      'multi_client',
      'api_access',
    ],
  },
} as const;

// ============================================
// CHANNELS PRIORITY ORDER
// ============================================

export const CHANNEL_PRIORITY = ['whatsapp', 'sms', 'email', 'push'] as const;
