-- ============================================
-- LocalRank Feedback - Schema completo para Supabase
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- ACCOUNTS
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'business',
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  plan VARCHAR(50) NOT NULL DEFAULT 'basic',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LOCATIONS
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  google_place_id VARCHAR(255),
  google_review_url TEXT,
  feedback_slug VARCHAR(100) UNIQUE NOT NULL,
  branding JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_locations_account ON locations(account_id);

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  location_ids UUID[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_account ON users(account_id);

-- CONTACTS
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  source VARCHAR(50) DEFAULT 'feedback',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_contacts_location_email ON contacts(location_id, email);
CREATE INDEX idx_contacts_location ON contacts(location_id);
CREATE INDEX idx_contacts_phone ON contacts(location_id, phone);

-- CONSENTS
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL,
  granted BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  policy_version VARCHAR(20) DEFAULT '1.0',
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);
CREATE INDEX idx_consents_contact ON consents(contact_id);

-- VISITS
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  visit_date DATE DEFAULT CURRENT_DATE,
  source VARCHAR(50) DEFAULT 'manual',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_visits_location ON visits(location_id, visit_date DESC);

-- FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  directed_to_google BOOLEAN DEFAULT false,
  ip_address VARCHAR(50),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feedback_location ON feedback(location_id, created_at DESC);
CREATE INDEX idx_feedback_rating ON feedback(location_id, rating);
CREATE INDEX idx_feedback_contact ON feedback(contact_id);

-- INTERNAL TICKETS
CREATE TABLE IF NOT EXISTS internal_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_tickets_location ON internal_tickets(location_id, status);
CREATE INDEX idx_tickets_status ON internal_tickets(status, created_at DESC);

-- REVIEW PLATFORMS
CREATE TABLE IF NOT EXISTS review_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(10),
  active BOOLEAN DEFAULT true,
  priority INT DEFAULT 0,
  clicks INT DEFAULT 0,
  reviews INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_review_platforms_location ON review_platforms(location_id, active);

-- REWARD CONFIGS
CREATE TABLE IF NOT EXISTS reward_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  reward_title VARCHAR(255) NOT NULL,
  reward_description TEXT NOT NULL,
  delay_minutes INT DEFAULT 15,
  channel VARCHAR(20) DEFAULT 'whatsapp',
  expiration_days INT DEFAULT 14,
  max_per_month INT,
  min_rating INT DEFAULT 4,
  coupon_design JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reward_configs_location ON reward_configs(location_id);

-- REWARD COUPONS
CREATE TABLE IF NOT EXISTS reward_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES reward_configs(id) ON DELETE CASCADE,
  location_id UUID NOT NULL,
  feedback_id UUID NOT NULL,
  contact_id UUID,
  code VARCHAR(50) NOT NULL UNIQUE,
  reward_title VARCHAR(255) NOT NULL,
  reward_description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  send_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  channel VARCHAR(20),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reward_coupons_location ON reward_coupons(location_id, status);
CREATE INDEX idx_reward_coupons_send ON reward_coupons(send_at);
CREATE INDEX idx_reward_coupons_code ON reward_coupons(code);

-- REFERRAL PROGRAMS
CREATE TABLE IF NOT EXISTS referral_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  name VARCHAR(255) NOT NULL,
  reward_referrer TEXT NOT NULL,
  reward_referred TEXT NOT NULL,
  delay_days INT DEFAULT 7,
  min_rating INT DEFAULT 4,
  max_referrals INT,
  expiration_days INT DEFAULT 60,
  reminder_days INT[] DEFAULT '{14,21}',
  message TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_referral_programs_location ON referral_programs(location_id);

-- REFERRAL LINKS
CREATE TABLE IF NOT EXISTS referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES referral_programs(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL UNIQUE,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  invite_sent_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_referral_links_code ON referral_links(code);
CREATE INDEX idx_referral_links_contact ON referral_links(contact_id);

-- REFERRAL EVENTS
CREATE TABLE IF NOT EXISTS referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES referral_links(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  referred_name VARCHAR(255),
  referred_phone VARCHAR(50),
  referred_email VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_referral_events_link ON referral_events(link_id, type);

-- ============================================
-- SEED DATA (Demo)
-- ============================================

-- Demo account
INSERT INTO accounts (id, name, email, phone, plan, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Clinica Dental Sonrisa',
  'demo@localrankfeedback.com',
  '+57 601 234 5678',
  'advanced',
  '{"timezone": "America/Bogota", "language": "es"}'
) ON CONFLICT (email) DO NOTHING;

-- Demo user (password: Demo1234!)
-- bcrypt hash of 'Demo1234!' with 12 rounds
INSERT INTO users (id, account_id, email, password_hash, name, role)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'admin@localrankfeedback.com',
  '$2b$12$LJ3a5S6gH9K4N8x2Y7rZe.8Q3Ml5JhFm3C2wNbL1z2xNsR4K5.Wy',
  'Dr. Juan Perez',
  'owner'
) ON CONFLICT (email) DO NOTHING;

-- Demo locations
INSERT INTO locations (id, account_id, name, address, phone, feedback_slug, google_review_url, branding, settings)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'Sede Centro',
  'Calle 50 #10-20, Bogota',
  '+57 601 234 5678',
  'clinica-sonrisa-centro',
  'https://g.page/r/example/review',
  '{"primaryColor": "#2563eb", "showBanner": true, "bannerColor": "#2563eb", "backgroundColor": "#f0f4ff", "thankYouTitle": "Como fue tu experiencia?", "thankYouSubtitle": "Tu opinion es muy importante para nosotros", "positiveMessage": "Nos alegra tu experiencia! Compartela en Google.", "negativeMessage": "Gracias por tu feedback. Tomaremos accion para mejorar."}',
  '{"reviewGateThreshold": 4, "notifyEmail": "admin@localrankfeedback.com", "notifyWhatsapp": "+57 300 123 4567", "showNameField": true, "showEmailField": true, "showPhoneField": true}'
),
(
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'Sede Norte',
  'Carrera 15 #100-45, Bogota',
  '+57 601 987 6543',
  'clinica-sonrisa-norte',
  'https://g.page/r/example2/review',
  '{"primaryColor": "#2563eb", "showBanner": true, "bannerColor": "#059669", "backgroundColor": "#f0fdf4", "thankYouTitle": "Cuentanos tu experiencia", "thankYouSubtitle": "Queremos mejorar para ti", "positiveMessage": "Gracias! Te invitamos a compartirlo en Google.", "negativeMessage": "Gracias. Nos pondremos en contacto contigo."}',
  '{"reviewGateThreshold": 4, "notifyEmail": "admin@localrankfeedback.com", "showNameField": true, "showEmailField": true, "showPhoneField": true}'
) ON CONFLICT (feedback_slug) DO NOTHING;

-- Demo review platforms
INSERT INTO review_platforms (location_id, platform, name, url, icon, priority)
VALUES
  ('00000000-0000-0000-0000-000000000003', 'google', 'Google Maps', 'https://g.page/r/example/review', '🔍', 10),
  ('00000000-0000-0000-0000-000000000003', 'doctoralia', 'Doctoralia', 'https://doctoralia.co/clinica-sonrisa', '👨‍⚕️', 5),
  ('00000000-0000-0000-0000-000000000003', 'facebook', 'Facebook', 'https://facebook.com/clinicasonrisa/reviews', '📘', 3);

-- Demo reward config
INSERT INTO reward_configs (location_id, reward_title, reward_description, delay_minutes, channel, expiration_days, min_rating)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Cafe gratis',
  'Disfruta un cafe gratis en tu proxima visita como agradecimiento',
  15,
  'whatsapp',
  14,
  4
);

-- Demo referral program
INSERT INTO referral_programs (location_id, name, reward_referrer, reward_referred, delay_days, min_rating, expiration_days)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Recomienda y Gana',
  '20% descuento en tu proxima visita',
  '15% descuento en tu primera visita',
  7,
  4,
  60
);

-- ============================================
-- DONE! Tablas creadas y datos demo insertados
-- ============================================
