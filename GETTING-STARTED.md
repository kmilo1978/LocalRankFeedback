# Getting Started - LocalRank Feedback

## Requisitos previos

- **Node.js** >= 18.x
- **Docker** y Docker Compose (para PostgreSQL y Redis)
- **npm** >= 9.x (viene con Node.js)

## Setup rapido

### 1. Clonar el repositorio

```bash
git clone https://github.com/kmilo1978/LocalRankFeedback.git
cd LocalRankFeedback
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Los valores por defecto funcionan para desarrollo local con Docker.

### 3. Levantar servicios (PostgreSQL + Redis)

```bash
docker-compose up -d
```

Verifica que estan corriendo:
```bash
docker-compose ps
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Generar Prisma Client y ejecutar migraciones

```bash
npm run db:generate
npm run db:migrate
```

### 6. Seed de datos demo (opcional)

```bash
npm run db:seed
```

Esto crea:
- Cuenta demo: `Clinica Dental Sonrisa`
- Usuario: `admin@localrankfeedback.com` / `Demo1234!`
- 2 sedes con feedback de ejemplo

### 7. Ejecutar en desarrollo

En terminales separadas:

```bash
# Terminal 1 - Backend (NestJS en puerto 3001)
npm run dev:backend

# Terminal 2 - Frontend (Next.js en puerto 3000)
npm run dev:frontend
```

### 8. Acceder

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Swagger Docs**: http://localhost:3001/api/docs
- **Formulario feedback demo**: http://localhost:3000/feedback/clinica-sonrisa-centro

## Comandos utiles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev:backend` | Iniciar backend en modo desarrollo |
| `npm run dev:frontend` | Iniciar frontend en modo desarrollo |
| `npm run build` | Build de todos los paquetes |
| `npm run db:migrate` | Ejecutar migraciones de Prisma |
| `npm run db:generate` | Regenerar Prisma Client |
| `npm run db:seed` | Poblar BD con datos demo |
| `npm run db:studio` | Abrir Prisma Studio (GUI de BD) |
| `npm run docker:up` | Levantar PostgreSQL + Redis |
| `npm run docker:down` | Detener servicios Docker |

## Estructura del monorepo

```
packages/
├── shared/      → Tipos TypeScript compartidos (enums, DTOs, constantes)
├── backend/     → API NestJS (puerto 3001)
│   ├── src/
│   │   ├── modules/     → Modulos de negocio (auth, feedback, locations...)
│   │   └── prisma/      → Servicio de base de datos
│   └── prisma/
│       ├── schema.prisma → Definicion del schema
│       └── seed.ts       → Datos iniciales
└── frontend/    → Panel Next.js (puerto 3000)
    └── src/app/
        ├── auth/         → Login / Register
        ├── dashboard/    → Panel de control
        └── feedback/     → Formulario publico
```

## Troubleshooting

### Puerto ocupado
Si el puerto 5432 o 6379 ya esta en uso, modifica los puertos en `docker-compose.yml` y actualiza `.env`.

### Error de Prisma
Si hay errores con el schema, ejecuta:
```bash
cd packages/backend
npx prisma generate
npx prisma migrate reset
```

### Node modules desincronizados
```bash
rm -rf node_modules packages/*/node_modules
npm install
```
