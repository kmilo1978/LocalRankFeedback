# LocalRank Feedback

**Plataforma SaaS de Reputacion + Retencion + Referidos + Remarketing para Negocios Locales**

---

## Que es LocalRank Feedback

LocalRank Feedback es un sistema integrado disenado para negocios locales (clinicas, fisioterapeutas, odontologos, estetica, gimnasios, etc.) que unifica en un solo flujo:

- Captura de feedback post-visita
- Gestion inteligente de reseñas en Google Maps (GMB)
- Auto-respuesta con IA a reseñas publicas
- Captura de datos para remarketing omnicanal
- Programa de referidos automatizado
- Automatizacion omnicanal (SMS, WhatsApp, Push, Email)
- Panel multi-sede y multi-agencia

---

## Problema que resuelve

Los negocios locales enfrentan multiples desafios simultaneamente:

1. **Reputacion online dispersa**: No tienen control sobre lo que se publica en Google y reaccionan tarde a reseñas negativas.
2. **Feedback interno inexistente**: No capturan la insatisfaccion antes de que se vuelva publica.
3. **Canales de comunicacion fragmentados**: Usan multiples herramientas sin integracion para SMS, WhatsApp, email.
4. **Crecimiento por referidos desaprovechado**: No tienen mecanismos sistematicos para incentivar la recomendacion boca a boca.
5. **Datos de clientes sin explotar**: No construyen audiencias para remarketing ni retargeting.

---

## Modulos principales

### 1. Feedback Post-Visita
- Envio de encuesta via link, QR, SMS, WhatsApp o push
- Encuesta breve: 1-5 estrellas + comentario opcional
- Flujo adaptativo segun la calificacion recibida

### 2. Review Gate Inteligente (Google Maps / GMB)
- Calificacion 4-5: redireccion directa al enlace de reseña de Google
- Calificacion 1-3: captura privada del feedback, generacion de ticket interno
- Notificacion inmediata al responsable por email/WhatsApp

### 3. Auto-Respuesta IA a reseñas de Google
- Conexion a Google Business Profile API
- Lectura automatica de nuevas reseñas
- reseñas positivas: respuesta automatica brand-safe
- reseñas criticas: borrador para revision antes de publicar
- Tono y politicas personalizables por marca

### 4. Captura de Datos para Remarketing
- Solicitud de datos opcionales (nombre, email, telefono) con consentimiento explicito
- Alimenta listas de: WhatsApp, Email Marketing, Google Ads Customer Match
- Segmentacion: promotores, detractores recuperados, inactivos

### 5. Programa de Referidos
- Link unico de referido generado tras feedback positivo
- Envio automatico de invitacion (configurable en tiempo: ej. 20 dias post-visita)
- Tracking de conversion de referidos
- Notificaciones de recompensa al referidor y al referido
- Recompensas definidas y entregadas por el negocio

### 6. Automatizacion Omnicanal
- WhatsApp Cloud API, SMS, Web Push, Email
- Seleccion automatica del mejor canal disponible
- Secuencias configurables con delays y reglas por rating
- Respeto del consentimiento por canal

### 7. Panel de Control
- **Vista Negocio (por sede)**: NPS, reviews generadas, reseñas Google, tickets internos, referidos, valor estimado
- **Vista Agencia (multi-cliente)**: gestion de cuentas, whitelabel, plantillas IA por cliente, limites por plan

---

## Stack Tecnologico Propuesto

| Capa | Tecnologia |
|------|-----------|
| Backend | Node.js + NestJS |
| Base de datos | PostgreSQL (multi-tenant) |
| Cache / Colas | Redis + BullMQ |
| Frontend Panel | Next.js (React) |
| Formularios | Next.js / paginas estaticas responsivas |
| IA | OpenAI GPT-4 / Claude (via API) |
| SMS | Twilio / proveedor local |
| WhatsApp | WhatsApp Cloud API (Meta) |
| Push | Web Push / Firebase Cloud Messaging |
| Email | SendGrid / Resend |
| Hosting | AWS / Vercel + Railway / Render |
| CI/CD | GitHub Actions |

---

## Modelo de Negocio

SaaS multi-tenant con planes por sede:

| Plan | Incluye |
|------|---------|
| **Basico** | Feedback + Review Gate GMB + Respuestas IA (4-5 estrellas) |
| **Avanzado** | + Remarketing (WhatsApp/Customer Match) + Referidos |
| **Agencia** | + Whitelabel + Multi-cliente + Limites agregados |

Cobro mensual por sede con limites de clientes procesados/mes y creditos de SMS.

---

## Estructura del Proyecto

```
LocalRank Feedback2/
├── README.md                  # Este archivo
├── docs/
│   ├── ARCHITECTURE.md        # Arquitectura tecnica detallada
│   ├── MVP-ROADMAP.md         # Fases de implementacion y prioridades
│   ├── DATABASE-SCHEMA.md     # Esquema de base de datos
│   └── API-DESIGN.md          # Diseno de API REST
├── src/                       # (futuro) Codigo fuente
│   ├── backend/
│   ├── frontend/
│   └── shared/
└── .github/
    └── workflows/             # CI/CD pipelines
```

---

## Estado Actual

**Fase: Planificacion y Documentacion**

- [x] Definicion de idea de negocio
- [x] Documentacion de arquitectura
- [x] Roadmap de MVP
- [ ] Setup del proyecto (monorepo)
- [ ] Implementacion MVP Fase 1

---

## Contacto

Proyecto desarrollado por el equipo de LocalRank.

---

*Documento generado: Agosto 2026*
