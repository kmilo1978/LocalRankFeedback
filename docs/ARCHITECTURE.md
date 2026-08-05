# Arquitectura Tecnica - LocalRank Feedback

## Vision General

LocalRank Feedback es un sistema **multi-tenant SaaS** disenado para escalar desde decenas hasta miles de negocios locales. La arquitectura prioriza:

- **Aislamiento de datos** entre tenants (negocios/agencias)
- **Procesamiento asincrono** para integraciones externas (Google, WhatsApp, SMS)
- **Escalabilidad horizontal** en workers de automatizacion
- **Resiliencia** ante fallos de APIs externas (reintentos, circuit breakers)

---

## Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTES / USUARIOS                          │
├─────────────────────────────────────────────────────────────────────┤
│  Panel Web (Next.js)  │  Formularios Feedback  │  Links Referidos   │
└──────────┬────────────┴──────────┬─────────────┴──────────┬────────┘
           │                       │                        │
           ▼                       ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / BACKEND (NestJS)                  │
├─────────────────────────────────────────────────────────────────────┤
│  Auth Module  │  Feedback Module  │  Reviews Module  │  Referrals   │
│  Contacts     │  Notifications    │  Sequences       │  Analytics   │
└──────────┬────┴──────────┬────────┴──────────┬───────┴─────────────┘
           │               │                   │
           ▼               ▼                   ▼
┌──────────────┐  ┌────────────────┐  ┌───────────────────┐
│  PostgreSQL  │  │  Redis/BullMQ  │  │  Object Storage   │
│  (Multi-T)   │  │  (Colas/Cache) │  │  (S3/R2)          │
└──────────────┘  └───────┬────────┘  └───────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      WORKERS ASINCRONOS                              │
├─────────────────────────────────────────────────────────────────────┤
│  Worker GMB    │  Worker WhatsApp  │  Worker SMS  │  Worker Email   │
│  Worker IA     │  Worker Push      │  Worker Referidos              │
└──────────┬─────┴──────────┬───────┴──────────┬────┴────────────────┘
           │                │                   │
           ▼                ▼                   ▼
┌──────────────┐  ┌────────────────┐  ┌───────────────────┐
│  Google BPI  │  │  WhatsApp API  │  │  Twilio / SMS     │
│  OpenAI/LLM  │  │  Meta Cloud    │  │  SendGrid / Email │
└──────────────┘  └────────────────┘  └───────────────────┘
```

---

## Diseno Multi-Tenant

### Estrategia: Schema compartido con tenant_id

Se utiliza una sola base de datos PostgreSQL con discriminador `tenant_id` en todas las tablas principales. Esta estrategia es la mas adecuada para el MVP y escala bien hasta miles de tenants.

```
┌─────────────────────────────────────────┐
│           PostgreSQL                      │
├─────────────────────────────────────────┤
│  Tabla: accounts (agencias/negocios)     │
│  Tabla: locations (sedes) → FK account   │
│  Tabla: contacts → FK location           │
│  Tabla: feedback → FK location, contact  │
│  Tabla: reviews → FK location            │
│  ... todas con tenant_id indexado        │
└─────────────────────────────────────────┘
```

**Ventajas:**
- Simplicidad operativa (un solo schema, migraciones unificadas)
- Bajo costo de infraestructura inicial
- Facil de implementar Row-Level Security (RLS) en PostgreSQL

**Mitigacion de riesgos:**
- Indices compuestos con `tenant_id` como primer campo
- RLS policies para prevenir data leaks entre tenants
- Connection pooling con PgBouncer para manejar carga

### Evolucion futura (si se necesita):
- Schema por tenant (para clientes enterprise/agencias grandes)
- Sharding horizontal por regiones geograficas

---

## Sistema de Colas y Eventos

### BullMQ sobre Redis

Todas las operaciones que involucran APIs externas o logica diferida se procesan via colas:

| Cola | Responsabilidad | Prioridad |
|------|----------------|-----------|
| `feedback.process` | Procesar feedback recibido, decidir flujo (review gate vs ticket) | Alta |
| `reviews.sync` | Sincronizar reseñas desde Google Business Profile | Media |
| `reviews.respond` | Generar y publicar respuestas IA | Media |
| `notifications.whatsapp` | Enviar mensajes por WhatsApp | Alta |
| `notifications.sms` | Enviar SMS | Alta |
| `notifications.email` | Enviar emails | Normal |
| `notifications.push` | Enviar web push | Normal |
| `referrals.invite` | Enviar invitaciones de referido (diferidas) | Baja |
| `referrals.reward` | Procesar conversiones y notificar recompensas | Media |
| `analytics.aggregate` | Calcular metricas y reportes | Baja |

**Configuracion por cola:**
- Reintentos exponenciales (3 intentos, backoff 2^n * 1000ms)
- Dead Letter Queue para mensajes fallidos
- Rate limiting por tenant (evitar abusos y respetar limites de APIs)
- Concurrencia configurable por worker

### Patron de Eventos

```typescript
// Eventos principales del sistema
enum SystemEvent {
  VISIT_REGISTERED = 'visit.registered',
  FEEDBACK_RECEIVED = 'feedback.received',
  FEEDBACK_POSITIVE = 'feedback.positive',    // 4-5 estrellas
  FEEDBACK_NEGATIVE = 'feedback.negative',    // 1-3 estrellas
  REVIEW_NEW = 'review.new',
  REVIEW_RESPONDED = 'review.responded',
  REFERRAL_CREATED = 'referral.created',
  REFERRAL_CONVERTED = 'referral.converted',
  CONTACT_OPTED_IN = 'contact.opted_in',
  SEQUENCE_STEP_DUE = 'sequence.step_due',
}
```

---

## Modulo de Integraciones

### Google Business Profile API

**Flujo de conexion:**
1. Negocio inicia OAuth 2.0 desde el panel
2. Se almacena refresh_token encriptado en BD
3. Worker sincroniza reseñas cada 15-30 minutos (polling)
4. Nuevas reseñas disparan evento `review.new`

**Limites conocidos:**
- Google BPI tiene rate limits estrictos (~60 requests/min por proyecto)
- Se requiere verificacion de app para acceso a produccion
- Solo cuentas verificadas en GMB pueden responder reseñas

**Mitigacion:**
- Cache de reseñas en BD local (evitar re-lecturas)
- Cola con rate limiting global por proyecto Google
- Retry con backoff exponencial en 429/503

### WhatsApp Cloud API (Meta)

**Arquitectura:**
- Webhook receptor para mensajes entrantes y delivery reports
- Templates pre-aprobados por Meta para mensajes proactivos
- Cola dedicada con rate limiting (80 mensajes/segundo por WABA)

**Consideraciones:**
- Templates deben ser aprobados previamente por Meta
- Ventana de 24h para mensajes de respuesta libre
- Costos por conversacion (varian por pais)

### Proveedores SMS

- Integracion con Twilio como proveedor principal
- Abstraccion para soportar proveedores locales (mas baratos en LATAM)
- Manejo de delivery reports para tracking

### Capa de IA (LLM)

```
┌────────────────────────────────────────┐
│         AI Response Engine              │
├────────────────────────────────────────┤
│  1. Cargar plantilla de prompt (BD)    │
│  2. Inyectar contexto: reseña, marca   │
│  3. Llamar LLM API                     │
│  4. Validar respuesta (largo, tono)    │
│  5. Si auto-approve → publicar         │
│     Si manual → guardar borrador       │
└────────────────────────────────────────┘
```

**Plantillas por cuenta:**
- Prompt base con tono de marca, valores, politicas
- Variables dinamicas: nombre_cliente, rating, texto_reseña, nombre_sede
- Reglas de negocio: largo maximo, palabras prohibidas, disclaimers

**Fallbacks:**
- Si OpenAI falla → intentar con Claude/Groq
- Si todos fallan → marcar para respuesta manual
- Timeout de 30s por generacion

---

## Esquema de Base de Datos (Resumen)

### Tablas Principales

```sql
-- Tenants y estructura organizacional
accounts          -- Agencias o negocios principales
locations         -- Sedes fisicas (pertenecen a un account)
users             -- Usuarios del panel (roles: owner, admin, viewer)

-- Contactos y consentimientos
contacts          -- Clientes/pacientes del negocio
consents          -- Registro de consentimientos por canal y timestamp

-- Feedback y reviews
visits            -- Registro de visitas (disparador del flujo)
feedback          -- Respuestas de encuesta (rating + comentario)
internal_tickets  -- Tickets generados por feedback negativo
gmb_reviews       -- Cache de reseñas de Google
gmb_responses     -- Respuestas generadas (borradores y publicadas)

-- Referidos
referral_programs -- Configuracion del programa por sede
referral_links    -- Links unicos por contacto
referral_events   -- Conversiones y recompensas

-- Automatizacion
sequences         -- Definicion de secuencias (pasos, delays, condiciones)
sequence_steps    -- Pasos individuales de cada secuencia
sequence_runs     -- Ejecuciones activas de secuencias por contacto
notification_logs -- Log de todas las notificaciones enviadas

-- IA
ai_templates      -- Plantillas de prompt por cuenta/sede
ai_generations    -- Log de generaciones (input, output, modelo, tokens)

-- Sistema
audit_logs        -- Log de auditoria (acciones de usuarios y sistema)
plans             -- Planes de suscripcion
subscriptions     -- Suscripciones activas por account
usage_metrics     -- Metricas de uso (para limites de plan)
```

### Indices Criticos

```sql
-- Todos los queries filtran por tenant
CREATE INDEX idx_feedback_location ON feedback(location_id, created_at DESC);
CREATE INDEX idx_reviews_location ON gmb_reviews(location_id, published_at DESC);
CREATE INDEX idx_contacts_location ON contacts(location_id, email);
CREATE INDEX idx_referral_links_code ON referral_links(code) WHERE active = true;
CREATE INDEX idx_sequence_runs_due ON sequence_runs(next_step_at) WHERE status = 'active';
```

---

## Seguridad

### Autenticacion y Autorizacion

- **JWT** con refresh tokens (access: 15min, refresh: 7 dias)
- **RBAC** (Role-Based Access Control): owner, admin, staff, viewer
- **Scoping por tenant**: middleware que inyecta tenant_id en cada request
- **API Keys** para integraciones externas (webhook receivers)

### Proteccion de Datos

- Encriptacion at-rest para tokens OAuth y API keys (AES-256)
- Consentimientos con timestamp, canal, IP y version de politica
- No se almacena informacion clinica, solo experiencia de servicio
- Soft-delete en contactos para cumplir solicitudes de eliminacion
- Logs de auditoria inmutables

### Rate Limiting

```
Panel API:        100 req/min por usuario
Feedback forms:   30 req/min por IP
Webhook receivers: 1000 req/min por tenant
Public links:     60 req/min por IP
```

---

## Escalabilidad

### Fase 1 (0-500 sedes): Arquitectura Simple
- 1 instancia backend (NestJS)
- 1 PostgreSQL (managed: RDS/Supabase)
- 1 Redis (managed: ElastiCache/Upstash)
- Workers en el mismo proceso o separados

### Fase 2 (500-5000 sedes): Separacion de Workers
- Backend API escalado horizontalmente (2-4 instancias)
- Workers separados por tipo (GMB, notifications, AI)
- Read replicas de PostgreSQL para queries de analytics
- CDN para formularios estaticos

### Fase 3 (5000+ sedes): Microservicios selectivos
- Separar modulo de notificaciones como servicio independiente
- Separar motor de IA como servicio independiente
- Considerar sharding de BD por region
- Event streaming con Kafka/NATS si el volumen lo justifica

---

## Riesgos Tecnicos y Mitigaciones

| Riesgo | Impacto | Mitigacion |
|--------|---------|-----------|
| Google BPI rate limits | No poder sincronizar reseñas a tiempo | Cache local + polling inteligente con prioridad por actividad |
| Aprobacion de app Google | Bloqueo del lanzamiento | Iniciar proceso de verificacion en paralelo al desarrollo |
| Rechazo de templates WhatsApp | No poder enviar mensajes proactivos | Preparar multiples variantes, seguir guidelines de Meta |
| Costos de LLM escalan | Margen reducido en plan basico | Caching de respuestas similares, modelos mas baratos para positivas |
| Deliverability SMS/Email | Mensajes no llegan | Multiples proveedores, monitoreo de tasas de entrega |
| Cambios en APIs de Google/Meta | Roturas de integracion | Abstraccion de integraciones, monitoreo de deprecations |
| Data leak entre tenants | Perdida de confianza, legal | RLS en PostgreSQL + tests automatizados de aislamiento |

---

## Decisiones Tecnicas Clave

### Por que NestJS (no Express plano)
- Estructura modular nativa (modulos por dominio)
- Inyeccion de dependencias (facilita testing)
- Guards y interceptors para auth/tenant scoping
- Soporte nativo de colas (BullMQ), WebSockets, CRON
- TypeScript first con decoradores

### Por que PostgreSQL (no MongoDB)
- Datos altamente relacionales (tenant → locations → contacts → feedback)
- RLS nativo para multi-tenancy seguro
- JSONB para datos flexibles cuando se necesite
- Madurez y ecosistema de herramientas
- Migraciones con Prisma o TypeORM

### Por que BullMQ (no SQS/RabbitMQ)
- Simplicidad: Redis ya se necesita para cache/sessions
- Prioridades, delays, rate limiting nativos
- Dashboard con Bull Board para monitoreo
- Escalable para el volumen esperado (hasta ~10K jobs/min)
- Migracion a SQS/Kafka solo si se necesita en Fase 3

### Por que Next.js para el panel
- SSR para SEO en paginas publicas (formularios, landing)
- React ecosystem (componentes, librerias UI)
- API routes como BFF (Backend For Frontend) si se necesita
- Despliegue simple en Vercel
- Shadcn/UI + Tailwind para UI rapida y consistente

---

## Monitoreo y Observabilidad

- **Logs estructurados**: Pino/Winston con correlacion por request_id
- **Metricas**: Prometheus + Grafana (latencias, tasas de error, jobs en cola)
- **Alertas**: PagerDuty/OpsGenie para fallos criticos
- **APM**: Sentry para tracking de errores en frontend y backend
- **Health checks**: /health endpoint con verificacion de BD, Redis, APIs externas

---

*Documento de arquitectura - LocalRank Feedback - Agosto 2026*
