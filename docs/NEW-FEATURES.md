# Nuevas Features - LocalRank Feedback

## Feature 1: Incentivo Post-Review (Cupones/QR de Recompensa)

### Concepto
Despues de que un cliente deja una calificacion positiva (4-5 estrellas) y es redirigido a Google, el sistema espera un tiempo configurable (ej. 15-30 minutos) y le envia automaticamente un cupon/QR de recompensa como agradecimiento.

### Flujo
```
Cliente da 5 estrellas
       ↓
Va a Google → deja reseña
       ↓
[15 min despues]
       ↓
Recibe WhatsApp/SMS:
"Gracias por tu reseña! Como agradecimiento, 
aqui tienes un cafe gratis en tu proxima visita"
       ↓
[Adjunto: QR o codigo de cupon]
```

### Configuracion por negocio
- **Tipo de recompensa**: cafe gratis, 10% descuento, servicio extra, etc.
- **Delay de envio**: 5 min, 15 min, 30 min, 1 hora, 24 horas
- **Canal de envio**: WhatsApp (prioritario), SMS, Email
- **Diseno del cupon**: QR code, codigo texto, imagen personalizada
- **Vigencia**: 7 dias, 14 dias, 30 dias, sin expiracion
- **Limite**: ilimitado, X cupones/mes, solo primera vez
- **Condicion**: solo si el cliente proporciono telefono/email

### Base de datos
```sql
CREATE TABLE reward_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id),
  feedback_id UUID NOT NULL REFERENCES feedback(id),
  contact_id UUID REFERENCES contacts(id),
  type VARCHAR(50) NOT NULL, -- 'qr_code' | 'text_code' | 'image'
  code VARCHAR(50) NOT NULL UNIQUE,
  reward_description TEXT NOT NULL, -- "Cafe gratis en tu proxima visita"
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'sent' | 'redeemed' | 'expired'
  send_at TIMESTAMP WITH TIME ZONE NOT NULL, -- cuando enviar (feedback_time + delay)
  sent_at TIMESTAMP WITH TIME ZONE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  channel VARCHAR(20), -- 'whatsapp' | 'sms' | 'email'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reward_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id),
  active BOOLEAN DEFAULT true,
  reward_description TEXT NOT NULL,
  delay_minutes INTEGER DEFAULT 15,
  channel VARCHAR(20) DEFAULT 'whatsapp',
  expiration_days INTEGER DEFAULT 14,
  max_per_month INTEGER, -- NULL = ilimitado
  min_rating INTEGER DEFAULT 4,
  coupon_design JSONB DEFAULT '{}', -- plantilla visual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Valor para el negocio
- Aumenta tasa de reseñas reales (el cliente sabe que hay premio)
- Genera recompra (el cupon lo trae de vuelta)
- Trackeable: el negocio ve cuantos cupones se canjearon
- ROI medible: costo del cafe vs valor de la reseña (estimado $50-100 USD por reseña)

---

## Feature 2: Referido Automatico con Premio Post Feedback Positivo

### Concepto
Cuando un cliente da 4-5 estrellas, automaticamente entra en una secuencia de referidos. Despues de un delay configurable (ej. 7-20 dias), recibe un mensaje invitandolo a recomendar a un amigo con un link unico. Si el amigo se convierte en cliente, ambos reciben un premio.

### Flujo
```
Cliente da 5 estrellas
       ↓
[Inmediato o post-cupon]
Se genera link unico de referido
       ↓
[7-20 dias despues]
       ↓
WhatsApp automatico:
"Hola Maria! Nos alegra que hayas tenido una gran
experiencia. Si recomiendas a un amigo y nos visita,
ambos reciben [premio]. Tu link personal: [url]"
       ↓
Amigo usa el link → se registra como nuevo paciente
       ↓
Sistema notifica:
- A Maria: "Tu amigo vino! Aqui esta tu premio: [QR]"
- Al amigo: "Bienvenido! Aqui esta tu descuento: [QR]"
```

### Configuracion
- **Premio para el referidor**: descuento, servicio gratis, credito
- **Premio para el referido**: descuento primera visita
- **Delay de invitacion**: 3, 7, 14, 20, 30 dias post-feedback
- **Rating minimo para activar**: 4 o 5
- **Recordatorios**: 1, 2, o 3 recordatorios si no ha compartido
- **Limite de referidos por persona**: ilimitado o X maximo
- **Expiracion del link**: 30, 60, 90 dias
- **Como se registra la conversion**: por link (auto) o manual (negocio confirma)

### Diferencia con cupon (Feature 1)
| | Cupon Post-Review | Referido con Premio |
|--|---|---|
| Cuando | Inmediato/minutos despues | Dias despues |
| Objetivo | Agradecer + recompra | Conseguir cliente nuevo |
| Destinatario | El mismo cliente | El cliente invita a otro |
| Premio | Solo para el | Para ambos (referidor + referido) |
| Trigger | Haber dado 4-5 estrellas | Haber dado 4-5 + tiempo de espera |

### Combinacion ideal
```
Dia 0: Cliente da 5⭐ → va a Google
Dia 0 + 15 min: Recibe cupon de cafe (Feature 1)
Dia 7: Recibe invitacion de referido con premio (Feature 2)
Dia 14: Recordatorio si no ha compartido
Dia 21: Ultimo recordatorio
```

---

## Feature 3: Dashboard de Clientes (Mini-CRM)

### Concepto
Un panel donde el negocio ve toda la informacion de cada cliente en un solo lugar: historial de visitas, calificaciones, cupones, referidos, y comunicaciones.

### Vista de lista
```
┌─────────────────────────────────────────────────────────────────────┐
│ Clientes (347)                                    [Buscar] [Filtrar]│
├─────────────────────────────────────────────────────────────────────┤
│ Nombre        │ Visitas │ Ultima │ Rating │ Cupones │ Referidos │ $  │
│ Maria Garcia  │  5      │ Hoy    │ ⭐4.8  │ 2/3     │ 3 activos │ +  │
│ Carlos R.     │  3      │ Ayer   │ ⭐5.0  │ 1/1     │ 1 conv.   │ +  │
│ Ana Martinez  │  2      │ 5 dias │ ⭐2.5  │ 0       │ 0         │ ⚠  │
│ Pedro Lopez   │  8      │ 1 sem  │ ⭐4.2  │ 3/5     │ 5 conv.   │ 🏆 │
└─────────────────────────────────────────────────────────────────────┘
```

### Vista detalle de cliente
```
┌─────────────────────────────────────────┐
│ Maria Garcia                        VIP │
│ maria@email.com | +57 300 111 2222      │
├─────────────────────────────────────────┤
│ Resumen                                 │
│ • 5 visitas totales                     │
│ • Rating promedio: 4.8⭐                │
│ • 2 reseñas dejadas en Google           │
│ • 3 referidos activos (1 convertido)    │
│ • Valor estimado: $450.000 COP          │
│ • Ultima visita: Hoy                    │
├─────────────────────────────────────────┤
│ Timeline                                │
│ Ago 4 - Visita + Feedback 5⭐           │
│ Ago 4 - Cupon cafe enviado              │
│ Jul 28 - Referido "Juan" convertido     │
│ Jul 20 - Invitacion referido enviada    │
│ Jul 15 - Visita + Feedback 5⭐          │
│ Jul 15 - Dejo reseña en Google          │
│ Jun 30 - Primera visita + Feedback 4⭐  │
├─────────────────────────────────────────┤
│ Acciones                                │
│ [Enviar mensaje] [Agregar nota] [Tag]   │
└─────────────────────────────────────────┘
```

### Segmentos automaticos
- **VIP / Promotores**: 3+ visitas, rating promedio 4.5+, tiene referidos
- **En riesgo**: no visita hace 30+ dias, ultimo feedback < 4
- **Nuevos**: primera visita en los ultimos 7 dias
- **Recuperados**: tuvieron feedback negativo pero volvieron
- **Embajadores**: 3+ referidos convertidos

### Metricas del dashboard
- Total clientes activos (visita en ultimos 60 dias)
- CLV promedio (customer lifetime value)
- Tasa de retencion (% que vuelve en 60 dias)
- Tasa de referido (% que refiere a alguien)
- NPS (net promoter score)

---

## Feature 4: Plantillas de Diseno Personalizadas

### Concepto
El negocio puede elegir entre varios templates pre-disenados para su formulario de feedback, y personalizarlos. No solo colores y logo, sino el layout completo, tipografia, estilo de estrellas, animaciones.

### Templates disponibles

| Template | Estilo | Ideal para |
|----------|--------|-----------|
| **Minimalista** | Limpio, fondo blanco, sin distracciones | Clinicas, medicos, abogados |
| **Colorido** | Gradientes, iconos animados, juvenil | Gimnasios, estetica, peluquerias |
| **Premium** | Oscuro, tipografia serif, elegante | Spas, restaurantes fine dining |
| **Divertido** | Emojis grandes, colores vivos, redondeado | Veterinarias, tiendas infantiles |
| **Corporativo** | Estructurado, formal, con logomark grande | Clinicas grandes, franquicias |
| **Neon** | Fondo oscuro, acentos neon, moderno | Barberias, tattoo studios |

### Personalizacion por template
- Logo (posicion: arriba, centrado, esquina)
- Colores: primario, secundario, fondo, texto
- Tipografia: sans-serif (moderno), serif (elegante), rounded (amigable)
- Estilo de estrellas: estrellas clasicas, corazones, thumbs up/down, emojis, numeros
- Animaciones: transiciones suaves, confetti en 5 estrellas, shake en envio
- Banner superior: on/off, color, imagen de fondo
- Bordes: redondeados, rectos, shadow, sin borde
- Boton CTA: color, texto, forma (redondeado, pill, cuadrado)

### Editor visual (Fase futura)
- Drag & drop de elementos
- Preview en tiempo real (mobile + desktop)
- Guardar como template propio
- Exportar/importar entre sedes

### Para la agencia (whitelabel)
- Crear templates y asignarlos a multiples clientes
- Template "base" de agencia que heredan los clientes
- Brandkit: subir fuentes, paletas, logos → aplicar automatico

---

## Feature 5: Calificar en Multiples Plataformas (no solo Google)

### Concepto
El negocio configura a donde quiere enviar a los clientes satisfechos. Puede ser Google Maps, pero tambien Doctoralia, TripAdvisor, Facebook, Yelp, Trustpilot, u cualquier plataforma con link de reseña.

### Plataformas soportadas

| Plataforma | Industrias | Link format |
|-----------|-----------|-------------|
| **Google Maps (GMB)** | Todas | g.page/r/XXXXX/review |
| **Doctoralia** | Salud (medicos, dentistas, fisios) | doctoralia.co/XXXXX#leave-review |
| **Facebook Reviews** | Todas (con pagina FB) | facebook.com/XXXXX/reviews |
| **TripAdvisor** | Restaurantes, hoteles, turismo | tripadvisor.com/XXXXX |
| **Yelp** | Restaurantes, servicios | yelp.com/biz/XXXXX |
| **Trustpilot** | E-commerce, servicios | trustpilot.com/review/XXXXX |
| **Rappi / iFood** | Restaurantes delivery | deep link |
| **URL personalizada** | Cualquiera | Link libre |

### Configuracion
```
Plataformas de destino:
 [✓] Google Maps (principal)     → https://g.page/r/example/review
 [✓] Doctoralia                  → https://doctoralia.co/mi-clinica
 [ ] Facebook Reviews            → (no configurado)
 [ ] TripAdvisor                 → (no aplica)
 [✓] URL personalizada           → https://mi-sitio.com/reseñas

Comportamiento:
 ○ Enviar a TODAS las plataformas activas (mostrar botones)
 ● Enviar a UNA al azar (rotacion)
 ○ Enviar a la que tenga menos reseñas (equilibrar)
 ○ Prioridad fija (primero Google, si ya dejo → Doctoralia)
```

### UX del cliente (post 4-5 estrellas)

**Opcion A: Multiples botones**
```
┌─────────────────────────────────────┐
│      Donde quieres dejar tu reseña? │
│                                     │
│  [⭐ Google Maps]                   │
│  [👨‍⚕️ Doctoralia]                    │
│  [📘 Facebook]                      │
│                                     │
│  (Puedes elegir mas de una)         │
└─────────────────────────────────────┘
```

**Opcion B: Una sola (rotacion)**
```
┌─────────────────────────────────────┐
│      Gracias! Te invitamos a        │
│      compartir tu experiencia       │
│                                     │
│  [Dejar reseña en Google Maps →]    │
│                                     │
└─────────────────────────────────────┘
```

**Opcion C: Secuencia (una por visita)**
- Visita 1 → Google
- Visita 2 → Doctoralia
- Visita 3 → Google
- ...

### Metricas multi-plataforma
- reseñas generadas por plataforma
- Rating promedio por plataforma
- Tasa de conversion por plataforma (clicks → reseña confirmada)
- Recomendacion: "Tu Google va bien (4.7). Enfocate en Doctoralia (3.9)"

---

## Prioridad de Implementacion Sugerida

| # | Feature | Impacto | Esfuerzo | Prioridad |
|---|---------|---------|----------|-----------|
| 1 | Cupones post-review | Alto (recompra + motivacion) | Medio | **Alta** |
| 2 | Referidos con premio | Alto (crecimiento organico) | Alto | **Alta** |
| 3 | Multi-plataforma | Medio (mas opciones) | Bajo | **Media-Alta** |
| 4 | Dashboard clientes | Medio (retencion + insights) | Medio | **Media** |
| 5 | Plantillas diseno | Medio (diferenciacion) | Alto | **Media-Baja** |

### Orden recomendado de build:
1. Multi-plataforma (rapido, alto valor percibido)
2. Cupones post-review (diferenciador, genera recompra)
3. Referidos con premio (ya estaba en roadmap, completar)
4. Dashboard clientes (evolucionar contactos → mini-CRM)
5. Plantillas de diseno (nice-to-have, para agencias)

---

*Nuevas features documentadas - Agosto 2026*
