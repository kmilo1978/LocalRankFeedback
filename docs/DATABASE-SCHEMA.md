# Esquema de Base de Datos - LocalRank Feedback

## Modelo Entidad-Relacion (Fase 1 MVP)

```
accounts 1──N locations 1──N contacts
    │                │          │
    │                │          │
    N                N          N
  users           visits     feedback
                     │          │
                     │          N
                     └── internal_tickets
```

---

## Tablas Fase 1 (MVP)

### accounts
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'business', -- 'business' | 'agency'
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  plan VARCHAR(50) NOT NULL DEFAULT 'basic',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### locations (sedes)
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  google_place_id VARCHAR(255),
  google_review_url TEXT,
  feedback_slug VARCHAR(100) UNIQUE NOT NULL, -- para URL publica
  branding JSONB DEFAULT '{}', -- logo, colors, texts
  settings JSONB DEFAULT '{}', -- thresholds, notifications
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_locations_account ON locations(account_id);
CREATE INDEX idx_locations_slug ON locations(feedback_slug);
```

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin', -- 'owner' | 'admin' | 'staff' | 'viewer'
  location_ids UUID[] DEFAULT '{}', -- sedes asignadas (vacio = todas)
  active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_account ON users(account_id);
CREATE INDEX idx_users_email ON users(email);
```

### contacts (clientes/pacientes del negocio)
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  whatsapp VARCHAR(50),
  source VARCHAR(50) DEFAULT 'feedback', -- 'feedback' | 'import' | 'referral' | 'manual'
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contacts_location ON contacts(location_id);
CREATE INDEX idx_contacts_email ON contacts(location_id, email);
CREATE INDEX idx_contacts_phone ON contacts(location_id, phone);
```

### consents
```sql
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL, -- 'email' | 'sms' | 'whatsapp' | 'push'
  granted BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  policy_version VARCHAR(20) DEFAULT '1.0',
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_consents_contact ON consents(contact_id);
CREATE INDEX idx_consents_channel ON consents(contact_id, channel);
```

### visits
```sql
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source VARCHAR(50) DEFAULT 'manual', -- 'manual' | 'api' | 'import'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visits_location ON visits(location_id, visit_date DESC);
```

### feedback
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  directed_to_google BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_feedback_location ON feedback(location_id, created_at DESC);
CREATE INDEX idx_feedback_rating ON feedback(location_id, rating);
CREATE INDEX idx_feedback_contact ON feedback(contact_id);
```

### internal_tickets
```sql
CREATE TABLE internal_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- 'open' | 'in_progress' | 'resolved' | 'dismissed'
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tickets_location ON internal_tickets(location_id, status);
CREATE INDEX idx_tickets_status ON internal_tickets(status, created_at DESC);
```

---

## Tablas Fase 2 (IA + Google Reviews)

### gmb_connections
```sql
CREATE TABLE gmb_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  google_account_id VARCHAR(255) NOT NULL,
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT NOT NULL,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  account_name VARCHAR(255),
  location_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'expired' | 'revoked'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_gmb_location ON gmb_connections(location_id);
```

### gmb_reviews
```sql
CREATE TABLE gmb_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  google_review_id VARCHAR(255) NOT NULL UNIQUE,
  reviewer_name VARCHAR(255),
  reviewer_photo_url TEXT,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  reply_text TEXT,
  reply_published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'new', -- 'new' | 'responded' | 'draft_pending' | 'ignored'
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gmb_reviews_location ON gmb_reviews(location_id, published_at DESC);
CREATE INDEX idx_gmb_reviews_status ON gmb_reviews(location_id, status);
CREATE UNIQUE INDEX idx_gmb_reviews_google_id ON gmb_reviews(google_review_id);
```

### ai_templates
```sql
CREATE TABLE ai_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE, -- NULL = aplica a todo el account
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'review_response_positive' | 'review_response_negative' | 'summary'
  prompt_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- variables disponibles
  settings JSONB DEFAULT '{}', -- max_length, temperature, model preference
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_templates_account ON ai_templates(account_id, type);
```

### ai_generations
```sql
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  template_id UUID REFERENCES ai_templates(id) ON DELETE SET NULL,
  review_id UUID REFERENCES gmb_reviews(id) ON DELETE SET NULL,
  input_context JSONB NOT NULL,
  output_text TEXT NOT NULL,
  model VARCHAR(100) NOT NULL,
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost_usd DECIMAL(10, 6),
  status VARCHAR(20) DEFAULT 'generated', -- 'generated' | 'approved' | 'published' | 'rejected'
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_location ON ai_generations(location_id, created_at DESC);
CREATE INDEX idx_ai_generations_review ON ai_generations(review_id);
```

---

## Tablas Fase 3 (Referidos + Remarketing)

### referral_programs
```sql
CREATE TABLE referral_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  reward_referrer TEXT, -- descripcion de la recompensa para el referidor
  reward_referred TEXT, -- descripcion de la recompensa para el referido
  delay_days INTEGER DEFAULT 20, -- dias despues de feedback para enviar invitacion
  min_rating SMALLINT DEFAULT 4, -- rating minimo para generar link de referido
  active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_programs_location ON referral_programs(location_id);
```

### referral_links
```sql
CREATE TABLE referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES referral_programs(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL UNIQUE, -- codigo corto para URL
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_links_code ON referral_links(code) WHERE active = true;
CREATE INDEX idx_referral_links_contact ON referral_links(contact_id);
```

### referral_events
```sql
CREATE TABLE referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES referral_links(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'click' | 'signup' | 'conversion' | 'reward_sent'
  referred_contact_id UUID REFERENCES contacts(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_events_link ON referral_events(link_id, type);
```

### sequences
```sql
CREATE TABLE sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  trigger_event VARCHAR(50) NOT NULL, -- 'feedback.positive' | 'visit.registered' | etc.
  active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sequences_location ON sequences(location_id);
```

### sequence_steps
```sql
CREATE TABLE sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  step_order SMALLINT NOT NULL,
  delay_minutes INTEGER DEFAULT 0, -- minutos de espera antes de ejecutar
  action_type VARCHAR(50) NOT NULL, -- 'send_whatsapp' | 'send_sms' | 'send_email' | 'send_push' | 'create_referral'
  template JSONB NOT NULL, -- contenido del mensaje / configuracion de la accion
  conditions JSONB DEFAULT '{}', -- condiciones para ejecutar (ej: solo si no ha respondido)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sequence_steps_sequence ON sequence_steps(sequence_id, step_order);
```

### sequence_runs
```sql
CREATE TABLE sequence_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  current_step SMALLINT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'completed' | 'cancelled' | 'paused'
  next_step_at TIMESTAMP WITH TIME ZONE,
  trigger_data JSONB DEFAULT '{}', -- datos del evento que disparo la secuencia
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sequence_runs_due ON sequence_runs(next_step_at) WHERE status = 'active';
CREATE INDEX idx_sequence_runs_contact ON sequence_runs(contact_id);
```

### notification_logs
```sql
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  channel VARCHAR(20) NOT NULL, -- 'email' | 'sms' | 'whatsapp' | 'push'
  type VARCHAR(50) NOT NULL, -- 'feedback_request' | 'review_invite' | 'referral_invite' | 'reward_notification'
  status VARCHAR(20) DEFAULT 'sent', -- 'queued' | 'sent' | 'delivered' | 'failed' | 'opened' | 'clicked'
  recipient VARCHAR(255) NOT NULL, -- email o telefono
  content_preview TEXT, -- primeros 200 chars del mensaje
  external_id VARCHAR(255), -- ID del proveedor (Twilio SID, etc.)
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notification_logs_location ON notification_logs(location_id, sent_at DESC);
CREATE INDEX idx_notification_logs_contact ON notification_logs(contact_id);
CREATE INDEX idx_notification_logs_status ON notification_logs(status) WHERE status IN ('queued', 'sent');
```

---

## Tablas Fase 4 (Agencias + Billing)

### subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'cancelled' | 'past_due' | 'trial'
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  max_locations INTEGER DEFAULT 1,
  max_contacts_per_month INTEGER DEFAULT 500,
  sms_credits_monthly INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_account ON subscriptions(account_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
```

### usage_metrics
```sql
CREATE TABLE usage_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  feedback_count INTEGER DEFAULT 0,
  sms_sent INTEGER DEFAULT 0,
  whatsapp_sent INTEGER DEFAULT 0,
  ai_generations INTEGER DEFAULT 0,
  ai_tokens_used INTEGER DEFAULT 0,
  contacts_created INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usage_metrics_account ON usage_metrics(account_id, period_start DESC);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(100) NOT NULL, -- 'review.responded' | 'settings.updated' | 'user.created'
  resource_type VARCHAR(50), -- 'location' | 'review' | 'contact'
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_account ON audit_logs(account_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
```

---

## Notas de Implementacion

### Migraciones
- Usar **Prisma** como ORM con migraciones versionadas
- Cada fase agrega tablas sin modificar las existentes (additive migrations)
- Seeds para datos de prueba y planes iniciales

### Row-Level Security (RLS)
```sql
-- Ejemplo de politica RLS para locations
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON locations
  USING (account_id = current_setting('app.current_account_id')::uuid);
```

### Soft Deletes
- Contactos usan soft delete (`deleted_at TIMESTAMP`) para cumplimiento de privacidad
- Se mantiene registro de eliminacion pero datos PII se anulan

### Particionamiento (Fase 4+)
- `notification_logs` particionado por mes (alto volumen)
- `audit_logs` particionado por mes
- `feedback` particionado por mes si supera 1M registros

---

*Esquema de base de datos - LocalRank Feedback - Agosto 2026*
