# Roadmap de Implementacion - LocalRank Feedback

## Estrategia General

El desarrollo se divide en **4 fases** con enfoque en validacion temprana:

1. **Fase 1 (MVP Core)**: Feedback + Review Gate + Panel basico → validar product-market fit
2. **Fase 2 (IA + Respuestas)**: Auto-respuesta IA a resenas → agregar valor diferencial
3. **Fase 3 (Referidos + Remarketing)**: Programa de referidos + captura de datos → growth loops
4. **Fase 4 (Escala + Agencias)**: Multi-agencia, whitelabel, analytics avanzado → monetizacion premium

**Principio clave**: Cada fase debe entregar valor independiente y ser vendible por si misma.

---

## Fase 1: MVP Core (Semanas 1-6)

**Objetivo**: Tener un producto funcional que capture feedback, filtre resenas y notifique al negocio.

### Semana 1-2: Infraestructura Base

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Setup monorepo | NestJS backend + Next.js frontend + shared types | Critica |
| Base de datos | PostgreSQL con Prisma, tablas: accounts, locations, users, contacts | Critica |
| Autenticacion | JWT + refresh tokens, registro/login de negocios | Critica |
| CI/CD basico | GitHub Actions: lint, test, deploy a staging | Alta |
| Docker compose | Entorno local: PostgreSQL + Redis + backend + frontend | Alta |

**Entregable**: Backend corriendo con auth funcional, BD migrada, deploy automatico.

### Semana 3-4: Feedback + Review Gate

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Formulario de feedback | Pagina publica responsiva (rating 1-5 + comentario) | Critica |
| Logica Review Gate | Si 4-5 → redirect a Google review link; Si 1-3 → captura privada | Critica |
| Generacion de links | Cada sede genera su link/QR unico de feedback | Critica |
| Tickets internos | Crear ticket cuando feedback es negativo (1-3) | Alta |
| Notificaciones basicas | Email al responsable cuando hay ticket nuevo | Alta |
| Tabla de feedback | Vista en panel con filtros por rating, fecha, sede | Alta |

**Entregable**: Flujo completo feedback → review gate funcionando. Negocio puede compartir link y ver resultados.

### Semana 5-6: Panel Basico + Onboarding

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Dashboard sede | Metricas: total feedback, rating promedio, reviews dirigidas a Google | Alta |
| Configuracion sede | Logo, colores, textos de agradecimiento/disculpa, link de Google review | Alta |
| Gestion de sedes | CRUD de locations para negocios multi-sede | Media |
| Onboarding wizard | Guia paso a paso para configurar primera sede | Media |
| QR generator | Generar QR code descargable con el link de feedback | Media |

**Entregable**: Panel funcional donde el negocio configura su cuenta y ve metricas.

### Criterios de Exito Fase 1
- [ ] Un negocio puede registrarse y configurar su sede en < 5 minutos
- [ ] El flujo feedback → review gate funciona sin errores
- [ ] Los tickets internos llegan por email al responsable
- [ ] El panel muestra metricas basicas en tiempo real
- [ ] Al menos 3 negocios piloto usando el sistema

---

## Fase 2: IA + Resenas de Google (Semanas 7-12)

**Objetivo**: Conectar con Google Business Profile y agregar respuestas automaticas con IA.

### Semana 7-8: Integracion Google Business Profile

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| OAuth con Google | Flujo de conexion GMB desde el panel | Critica |
| Sync de resenas | Worker que sincroniza resenas nuevas cada 15-30 min | Critica |
| Vista de resenas | Panel con todas las resenas de Google, filtros, busqueda | Alta |
| Almacenamiento seguro | Encriptar refresh tokens, manejar token refresh | Alta |
| Verificacion de app | Iniciar proceso de verificacion con Google | Alta |

**Entregable**: El negocio ve sus resenas de Google dentro del panel de LocalRank.

### Semana 9-10: Motor de Respuestas IA

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Plantillas de prompt | CRUD de plantillas IA por cuenta (tono, politicas, contexto) | Critica |
| Generacion de respuestas | Llamar OpenAI/Claude para generar respuesta a cada resena | Critica |
| Auto-publish (positivas) | Resenas 4-5: publicar respuesta automaticamente | Alta |
| Borrador (negativas) | Resenas 1-3: guardar borrador para revision manual | Alta |
| Interfaz de aprobacion | Vista para revisar, editar y aprobar/rechazar borradores | Alta |
| Fallback multi-proveedor | Si OpenAI falla → Claude → marcar para manual | Media |

**Entregable**: Resenas positivas se responden solas. Negativas quedan como borrador revisable.

### Semana 11-12: Notificaciones Mejoradas + WhatsApp

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| WhatsApp Cloud API | Configuracion de WABA, webhook receptor | Alta |
| Templates WhatsApp | Crear y someter templates para feedback request | Alta |
| Envio por WhatsApp | Alternativa al link: enviar solicitud de feedback por WhatsApp | Alta |
| Selector de canal | Logica para elegir mejor canal disponible (WhatsApp > SMS > Email) | Media |
| Dashboard mejorado | Agregar metricas de resenas, respuestas IA, tasa de respuesta | Media |

**Entregable**: El sistema puede enviar feedback requests por WhatsApp y responde resenas con IA.

### Criterios de Exito Fase 2
- [ ] Conexion OAuth con GMB funciona para al menos 5 cuentas
- [ ] 90%+ de resenas positivas se responden en < 1 hora
- [ ] Borradores de negativas se generan con calidad aceptable (tasa de aprobacion > 70%)
- [ ] WhatsApp templates aprobados y enviando correctamente
- [ ] Costo de IA por resena < $0.05 USD promedio

---

## Fase 3: Referidos + Remarketing (Semanas 13-18)

**Objetivo**: Agregar programa de referidos y captura de datos para remarketing.

### Semana 13-14: Captura de Datos y Consentimientos

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Formulario extendido | Agregar campos opcionales: nombre, email, telefono | Alta |
| Gestion de consentimientos | Registro con timestamp, canal, version de politica | Critica |
| Lista de contactos | Vista en panel con segmentacion (promotores, detractores, etc.) | Alta |
| Exportacion | Export CSV para Google Ads Customer Match | Media |
| Integracion email | Conectar con SendGrid/Resend para email marketing basico | Media |

**Entregable**: El negocio construye una base de contactos segmentada con consentimiento.

### Semana 15-16: Programa de Referidos

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Configuracion programa | Definir recompensas, reglas, delays por sede | Alta |
| Generacion de links | Link unico por contacto tras feedback positivo | Critica |
| Landing de referido | Pagina donde el amigo ve la recomendacion y puede actuar | Alta |
| Tracking conversion | Detectar cuando el referido se convierte en cliente | Alta |
| Envio diferido | Invitacion automatica X dias despues del feedback positivo | Alta |
| Notificaciones reward | Avisar al referidor y al referido cuando hay conversion | Media |

**Entregable**: Flujo completo de referidos: cliente satisfecho → invita amigo → conversion → recompensa.

### Semana 17-18: Automatizaciones y Secuencias

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Motor de secuencias | Engine que ejecuta pasos con delays y condiciones | Alta |
| Secuencias predefinidas | Templates: post-visita, solicitud review, invitacion referido | Alta |
| Editor de secuencias | UI visual para crear/editar secuencias en el panel | Media |
| SMS integration | Twilio para envio de SMS en secuencias | Media |
| Analytics de secuencias | Tasa de apertura, click, conversion por paso | Media |

**Entregable**: Secuencias automaticas que combinan multiples canales y acciones.

### Criterios de Exito Fase 3
- [ ] Al menos 30% de clientes con feedback positivo comparten link de referido
- [ ] Tasa de conversion de referidos > 5%
- [ ] Base de contactos con > 80% de consentimientos validos
- [ ] Secuencias ejecutandose sin errores en produccion
- [ ] Al menos 2 negocios usando el programa de referidos activamente

---

## Fase 4: Escala + Agencias (Semanas 19-24)

**Objetivo**: Habilitar modelo de agencias, whitelabel y analytics avanzado.

### Semana 19-20: Multi-Agencia y Whitelabel

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Modelo de agencia | Account type: agency con multiples sub-accounts | Alta |
| Vista multi-cliente | Dashboard agregado para agencias | Alta |
| Whitelabel basico | Dominio personalizado, logo, colores por agencia | Alta |
| Gestion de planes | Limites por plan: sedes, contactos/mes, creditos SMS | Alta |
| Billing integration | Stripe para cobros recurrentes por sede | Alta |

**Entregable**: Agencias pueden gestionar multiples negocios desde una sola cuenta.

### Semana 21-22: Analytics Avanzado

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| NPS tracking | Calculo y evolucion de NPS por sede y periodo | Alta |
| Reportes automaticos | Email semanal con resumen de metricas | Media |
| IA insights | Resumen IA de temas recurrentes en feedback y resenas | Media |
| Comparativas | Benchmarks entre sedes del mismo negocio | Media |
| Exportacion avanzada | Reportes PDF, integracion con Google Data Studio | Baja |

**Entregable**: Panel con insights accionables y reportes automaticos.

### Semana 23-24: Optimizacion y Hardening

| Tarea | Detalle | Prioridad |
|-------|---------|-----------|
| Performance | Optimizar queries, caching agresivo, lazy loading | Alta |
| Monitoreo | Sentry, Prometheus, alertas criticas | Alta |
| Tests E2E | Cypress/Playwright para flujos criticos | Alta |
| Documentacion API | OpenAPI/Swagger para integraciones | Media |
| Seguridad audit | Penetration testing basico, review de permisos | Alta |
| Onboarding mejorado | Videos, tooltips, guided tours | Media |

**Entregable**: Plataforma estable, monitoreada y lista para escalar.

### Criterios de Exito Fase 4
- [ ] Al menos 2 agencias gestionando 5+ clientes cada una
- [ ] Uptime > 99.5% durante 30 dias consecutivos
- [ ] Billing automatizado sin intervencion manual
- [ ] Tiempo de onboarding < 10 minutos para nuevo negocio
- [ ] NPS de la propia plataforma > 50

---

## Timeline Visual

```
Semana:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
         ├──────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
         │   FASE 1: MVP    │  │  FASE 2: IA + Google    │  │ FASE 3: Referidos+Mktg  │  │ FASE 4: Agencias+Scale  │
         │   (6 semanas)    │  │     (6 semanas)         │  │     (6 semanas)         │  │     (6 semanas)         │
         └──────────────────┘  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘

Hitos:   ▲ MVP Live          ▲ IA Respondiendo          ▲ Referidos Activos         ▲ Producto Completo
         (Sem 6)             (Sem 12)                   (Sem 18)                    (Sem 24)
```

**Total estimado**: 24 semanas (6 meses) para producto completo.
**MVP vendible**: Semana 6 (1.5 meses).

---

## Dependencias Externas y Tiempos

| Dependencia | Tiempo estimado | Cuando iniciar |
|-------------|----------------|----------------|
| Verificacion app Google (BPI) | 2-6 semanas | Semana 1 (en paralelo) |
| Aprobacion templates WhatsApp | 1-2 semanas | Semana 9 |
| Cuenta Twilio verificada | 1-3 dias | Semana 15 |
| Cuenta Stripe activada | 1-5 dias | Semana 17 |
| Dominio + SSL para whitelabel | 1-2 dias | Semana 19 |

---

## Equipo Minimo Sugerido

| Fase | Equipo |
|------|--------|
| Fase 1 | 1 fullstack developer + 1 designer (part-time) |
| Fase 2 | 1 fullstack + 1 backend (integraciones) |
| Fase 3 | 2 developers + 1 designer |
| Fase 4 | 2-3 developers + 1 designer + 1 QA |

**Alternativa solo-founder**: Con IA (Cursor/Kiro) como copiloto, un developer experimentado puede completar Fase 1-2 solo, con timeline extendido a 10-12 semanas.

---

## Riesgos por Fase y Plan B

### Fase 1
| Riesgo | Plan B |
|--------|--------|
| Negocios no entienden el valor | Ofrecer setup gratuito + demo personalizada |
| Baja tasa de respuesta a feedback | A/B test de canales y timing de envio |

### Fase 2
| Riesgo | Plan B |
|--------|--------|
| Verificacion Google demora mucho | Operar con cuentas de prueba, ofrecer modulo IA standalone |
| Respuestas IA de baja calidad | Modo 100% manual con sugerencias IA como opcional |

### Fase 3
| Riesgo | Plan B |
|--------|--------|
| Programa referidos no genera traccion | Pivotear a loyalty points / descuentos directos |
| WhatsApp templates rechazados | Usar SMS como canal primario, WhatsApp solo para opt-in |

### Fase 4
| Riesgo | Plan B |
|--------|--------|
| Agencias no pagan premium | Modelo freemium con limites + upsell por uso |
| Churn alto | Agregar contratos anuales con descuento, mejorar onboarding |

---

## Metricas Clave por Fase

| Metrica | Fase 1 Target | Fase 2 Target | Fase 3 Target | Fase 4 Target |
|---------|--------------|--------------|--------------|--------------|
| Negocios activos | 5 | 20 | 50 | 150+ |
| Feedback/mes total | 200 | 1,000 | 5,000 | 20,000+ |
| Reviews dirigidas a Google | 50 | 300 | 1,500 | 5,000+ |
| MRR | $0 (piloto) | $500 | $3,000 | $15,000+ |
| Tasa respuesta feedback | >30% | >40% | >45% | >50% |

---

## Siguiente Paso Inmediato

1. Crear el monorepo con NestJS + Next.js + Prisma
2. Definir schema de BD (Fase 1 minimal)
3. Implementar auth (registro + login)
4. Crear formulario de feedback publico
5. Implementar logica de review gate

**Start building!**

---

*Roadmap de implementacion - LocalRank Feedback - Agosto 2026*
