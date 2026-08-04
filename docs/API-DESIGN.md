# Diseno de API REST - LocalRank Feedback

## Convenciones Generales

- **Base URL**: `https://api.localrankfeedback.com/v1`
- **Formato**: JSON
- **Autenticacion**: Bearer JWT en header `Authorization`
- **Paginacion**: `?page=1&limit=20` con respuesta envuelta en `{ data: [], meta: { total, page, limit } }`
- **Errores**: Formato estandar `{ error: { code, message, details? } }`
- **Versionado**: En URL path (`/v1/`)

---

## Endpoints Publicos (sin auth)

### Feedback Form

```
GET  /public/feedback/:slug          → Obtener config del formulario (branding, textos)
POST /public/feedback/:slug          → Enviar feedback (rating, comment, contact info)
GET  /public/referral/:code          → Obtener info del link de referido
POST /public/referral/:code/convert  → Registrar conversion de referido
```

### Auth

```
POST /auth/register        → Registrar nuevo negocio
POST /auth/login           → Login (devuelve access + refresh token)
POST /auth/refresh         → Renovar access token
POST /auth/forgot-password → Enviar email de reset
POST /auth/reset-password  → Cambiar password con token
```

---

## Endpoints Protegidos (requieren JWT)

### Account & Locations

```
GET    /account                → Info de la cuenta actual
PATCH  /account                → Actualizar cuenta
GET    /locations              → Listar sedes
POST   /locations              → Crear sede
GET    /locations/:id          → Detalle de sede
PATCH  /locations/:id          → Actualizar sede
DELETE /locations/:id          → Eliminar sede (soft delete)
PATCH  /locations/:id/branding → Actualizar branding (logo, colores, textos)
```

### Users

```
GET    /users           → Listar usuarios de la cuenta
POST   /users           → Invitar usuario
GET    /users/:id       → Detalle usuario
PATCH  /users/:id       → Actualizar usuario (rol, sedes asignadas)
DELETE /users/:id       → Desactivar usuario
```

### Feedback

```
GET  /locations/:id/feedback           → Listar feedback con filtros (rating, fecha)
GET  /locations/:id/feedback/:fid      → Detalle de un feedback
GET  /locations/:id/feedback/stats     → Estadisticas (promedio, distribucion, tendencia)
```

### Internal Tickets

```
GET    /locations/:id/tickets          → Listar tickets (filtros por status)
PATCH  /locations/:id/tickets/:tid     → Actualizar ticket (status, notes, assigned_to)
```

### Google Reviews (Fase 2)

```
POST   /locations/:id/gmb/connect      → Iniciar OAuth con Google
GET    /locations/:id/gmb/callback     → Callback OAuth
DELETE /locations/:id/gmb/disconnect   → Desconectar GMB
GET    /locations/:id/reviews          → Listar resenas de Google
GET    /locations/:id/reviews/:rid     → Detalle de resena
POST   /locations/:id/reviews/:rid/respond   → Publicar respuesta (manual o aprobar borrador IA)
POST   /locations/:id/reviews/:rid/generate  → Generar respuesta IA (borrador)
POST   /locations/:id/reviews/sync     → Forzar sincronizacion manual
```

### AI Templates (Fase 2)

```
GET    /ai-templates              → Listar plantillas
POST   /ai-templates              → Crear plantilla
GET    /ai-templates/:id          → Detalle
PATCH  /ai-templates/:id          → Actualizar plantilla
DELETE /ai-templates/:id          → Eliminar
POST   /ai-templates/:id/test     → Probar plantilla con datos de ejemplo
```

### Contacts (Fase 3)

```
GET    /locations/:id/contacts          → Listar contactos (filtros, busqueda)
POST   /locations/:id/contacts          → Crear contacto manualmente
GET    /locations/:id/contacts/:cid     → Detalle contacto
PATCH  /locations/:id/contacts/:cid     → Actualizar
DELETE /locations/:id/contacts/:cid     → Eliminar (soft delete + anonimizar PII)
POST   /locations/:id/contacts/export   → Exportar CSV (para Google Ads, etc.)
GET    /locations/:id/contacts/:cid/history → Historial (feedback, notificaciones, referidos)
```

### Referrals (Fase 3)

```
GET    /locations/:id/referral-program          → Config del programa
PUT    /locations/:id/referral-program          → Crear/actualizar programa
GET    /locations/:id/referrals                 → Listar links de referido + stats
GET    /locations/:id/referrals/:rid            → Detalle de referido + eventos
GET    /locations/:id/referrals/stats           → Metricas del programa
```

### Sequences (Fase 3)

```
GET    /locations/:id/sequences          → Listar secuencias
POST   /locations/:id/sequences          → Crear secuencia
GET    /locations/:id/sequences/:sid      → Detalle con steps
PATCH  /locations/:id/sequences/:sid      → Actualizar
DELETE /locations/:id/sequences/:sid      → Eliminar
POST   /locations/:id/sequences/:sid/activate    → Activar
POST   /locations/:id/sequences/:sid/deactivate  → Pausar
GET    /locations/:id/sequences/:sid/runs        → Ver ejecuciones activas
```

### Notifications (Fase 3)

```
GET    /locations/:id/notifications      → Log de notificaciones enviadas
GET    /locations/:id/notifications/stats → Metricas (entregados, abiertos, clicks)
```

### Analytics (Fase 4)

```
GET  /locations/:id/analytics/overview    → Metricas principales (NPS, reviews, referidos)
GET  /locations/:id/analytics/feedback    → Tendencias de feedback
GET  /locations/:id/analytics/reviews     → Tendencias de resenas Google
GET  /locations/:id/analytics/referrals   → Metricas del programa de referidos
GET  /locations/:id/analytics/channels    → Performance por canal de comunicacion
GET  /account/analytics/overview          → Vista agregada multi-sede
```

### Agency (Fase 4)

```
GET    /agency/clients             → Listar clientes (sub-accounts)
POST   /agency/clients             → Crear sub-account
GET    /agency/clients/:id         → Detalle
PATCH  /agency/clients/:id         → Actualizar
GET    /agency/analytics           → Metricas agregadas de todos los clientes
GET    /agency/billing             → Uso y facturacion
```

### Billing (Fase 4)

```
GET    /billing                    → Estado actual de suscripcion
POST   /billing/checkout           → Crear sesion de pago Stripe
POST   /billing/portal            → Abrir portal de Stripe para gestionar plan
GET    /billing/usage             → Uso actual vs limites del plan
GET    /billing/invoices          → Historial de facturas
```

---

## Webhooks Entrantes (para integraciones)

```
POST /webhooks/whatsapp    → Webhook receptor de WhatsApp Cloud API
POST /webhooks/twilio      → Delivery reports de SMS
POST /webhooks/stripe      → Eventos de pago/suscripcion
POST /webhooks/google      → Notificaciones de cambios en GMB (si aplica)
```

---

## Formato de Respuesta Estandar

### Exito (singular)
```json
{
  "data": {
    "id": "uuid",
    "type": "feedback",
    "attributes": { ... }
  }
}
```

### Exito (lista)
```json
{
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Rating must be between 1 and 5",
    "details": [
      { "field": "rating", "message": "Must be an integer between 1 and 5" }
    ]
  }
}
```

---

## Rate Limiting Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1627776000
```

---

*Diseno de API - LocalRank Feedback - Agosto 2026*
