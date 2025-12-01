# 🚀 Guía de Despliegue

Esta guía te ayudará a desplegar la aplicación en diferentes entornos de producción.

## 📋 Tabla de Contenidos

- [Preparación](#preparación)
- [Despliegue en Vercel (Frontend)](#despliegue-en-vercel-frontend)
- [Despliegue en Railway (Backend + DB)](#despliegue-en-railway-backend--db)
- [Despliegue en Render](#despliegue-en-render)
- [Despliegue con Docker](#despliegue-con-docker)
- [Variables de Entorno en Producción](#variables-de-entorno-en-producción)
- [Configuración de Webhooks](#configuración-de-webhooks)
- [Monitoreo y Logs](#monitoreo-y-logs)

---

## ✅ Preparación

### 1. Checklist pre-despliegue

- [ ] Todas las pruebas pasan localmente
- [ ] Variables de entorno configuradas
- [ ] Base de datos de producción creada
- [ ] Credenciales de pago de producción obtenidas
- [ ] Dominio configurado (opcional)
- [ ] SSL/HTTPS habilitado
- [ ] CORS configurado correctamente
- [ ] Rate limiting implementado
- [ ] Logs configurados

### 2. Build local

Verifica que todo compile correctamente:

```bash
pnpm build
```

---

## 🔷 Despliegue en Vercel (Frontend)

Vercel es ideal para Next.js y ofrece despliegue automático desde Git.

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Configurar proyecto

Desde la carpeta `apps/web`:

```bash
cd apps/web
vercel
```

Sigue las instrucciones:
- **Set up and deploy?** Yes
- **Which scope?** Tu cuenta
- **Link to existing project?** No
- **Project name?** moto-ecommerce-web
- **Directory?** `./`
- **Override settings?** No

### 4. Variables de entorno

En el dashboard de Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega:
   ```
   NEXT_PUBLIC_API_BASE=https://tu-api.railway.app
   ```

### 5. Desplegar a producción

```bash
vercel --prod
```

### 6. Dominio personalizado (opcional)

En Vercel dashboard:
- **Settings** → **Domains**
- Agrega tu dominio: `www.tumotoshop.com`
- Configura los DNS según las instrucciones

---

## 🚂 Despliegue en Railway (Backend + DB)

Railway es excelente para backend Node.js y PostgreSQL.

### 1. Crear cuenta

Ve a https://railway.app y crea una cuenta con GitHub.

### 2. Crear nuevo proyecto

1. Click en **New Project**
2. Selecciona **Deploy from GitHub repo**
3. Conecta tu repositorio

### 3. Agregar PostgreSQL

1. En tu proyecto, click **New**
2. Selecciona **Database** → **PostgreSQL**
3. Railway creará automáticamente la base de datos

### 4. Configurar el servicio API

1. Click en tu servicio (apps/api)
2. Ve a **Settings**
3. Configura:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm db:generate && pnpm build`
   - **Start Command**: `pnpm start`

### 5. Variables de entorno

En **Variables**:

```env
# Railway provee automáticamente DATABASE_URL
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT
JWT_ACCESS_SECRET=tu_secret_super_seguro_produccion
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro_produccion

# Pagos (PRODUCCIÓN)
PAYMENT_PROVIDER=MERCADOPAGO
MERCADOPAGO_ACCESS_TOKEN=APP-1234567890-123456-abc...
MERCADOPAGO_WEBHOOK_SECRET=tu_webhook_secret_prod
CULQI_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxx
CULQI_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
CULQI_WEBHOOK_SECRET=tu_webhook_secret_prod

# App
PORT=3001
NEXT_PUBLIC_API_BASE=${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
```

### 6. Ejecutar migraciones

En Railway, ve a tu servicio API:

1. Click en **Settings** → **Deploy**
2. Agrega un **Deploy Command**:
   ```bash
   pnpm db:migrate && pnpm db:seed
   ```

O ejecuta manualmente desde tu terminal:

```bash
# Instala Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ejecutar migraciones
railway run pnpm db:migrate
railway run pnpm db:seed
```

### 7. Obtener URL pública

Railway te dará una URL como: `https://tu-proyecto.railway.app`

---

## 🎨 Despliegue en Render

Alternativa a Railway, también soporta Node.js y PostgreSQL.

### Backend

1. Ve a https://render.com
2. **New** → **Web Service**
3. Conecta tu repositorio
4. Configura:
   - **Name**: moto-ecommerce-api
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm db:generate && pnpm build`
   - **Start Command**: `pnpm start`
   - **Plan**: Free (o el que prefieras)

### Base de datos

1. **New** → **PostgreSQL**
2. Copia la **Internal Database URL**
3. Agrégala como variable de entorno `DATABASE_URL` en tu servicio

### Variables de entorno

Agrega todas las variables necesarias en **Environment**.

---

## 🐳 Despliegue con Docker

### 1. Crear Dockerfile para API

`apps/api/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
WORKDIR /app/apps/api
RUN pnpm db:generate
RUN pnpm build

FROM base AS deploy
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/package.json ./

EXPOSE 3001

CMD ["sh", "-c", "pnpm db:migrate && node dist/index.js"]
```

### 2. Crear Dockerfile para Web

`apps/web/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
WORKDIR /app/apps/web
RUN pnpm build

FROM base AS deploy
WORKDIR /app
COPY --from=build /app/apps/web/.next ./.next
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/node_modules ./node_modules
COPY --from=build /app/apps/web/package.json ./

EXPOSE 3000

CMD ["pnpm", "start"]
```

### 3. Docker Compose

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: moto_ecommerce
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/moto_ecommerce?schema=public
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      PAYMENT_PROVIDER: ${PAYMENT_PROVIDER}
      MERCADOPAGO_ACCESS_TOKEN: ${MERCADOPAGO_ACCESS_TOKEN}
      MERCADOPAGO_WEBHOOK_SECRET: ${MERCADOPAGO_WEBHOOK_SECRET}
      PORT: 3001
      NODE_ENV: production
    depends_on:
      - postgres

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_BASE: http://api:3001
    depends_on:
      - api

volumes:
  postgres_data:
```

### 4. Ejecutar con Docker

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

---

## 🔐 Variables de Entorno en Producción

### Generar secrets seguros

```bash
# Para JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Variables críticas

```env
# ⚠️ NUNCA uses valores de desarrollo en producción

# JWT - Genera nuevos secrets
JWT_ACCESS_SECRET=<secret_generado_64_chars>
JWT_REFRESH_SECRET=<secret_generado_64_chars>

# MercadoPago - Usa credenciales de PRODUCCIÓN
MERCADOPAGO_ACCESS_TOKEN=APP-xxxxxx  # NO uses TEST-
MERCADOPAGO_WEBHOOK_SECRET=<secret_generado>

# Culqi - Usa credenciales de PRODUCCIÓN
CULQI_PUBLIC_KEY=pk_live_xxxxxxxx  # NO uses pk_test_
CULQI_SECRET_KEY=sk_live_xxxxxxxx  # NO uses sk_test_
CULQI_WEBHOOK_SECRET=<secret_generado>

# Database - URL de producción
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public&sslmode=require

# App
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_API_BASE=https://api.tumotoshop.com
```

---

## 🔔 Configuración de Webhooks

### MercadoPago Producción

1. Ve a https://www.mercadopago.com.pe/developers/panel/notifications/webhooks
2. Cambia a **Modo Producción** (toggle arriba a la derecha)
3. Click en **Crear webhook**
4. URL: `https://api.tumotoshop.com/api/webhooks/mercadopago`
5. Eventos: `payment.created`, `payment.updated`
6. Guarda el **Webhook Secret** en tus variables de entorno

### Culqi Producción

1. Ve a https://panel.culqi.com/#/desarrollo/webhooks
2. Cambia a **Producción**
3. Agrega webhook: `https://api.tumotoshop.com/api/webhooks/culqi`
4. Eventos: `charge.succeeded`, `charge.failed`
5. Guarda el secret en tus variables de entorno

---

## 📊 Monitoreo y Logs

### Sentry (Errores)

```bash
pnpm add @sentry/node @sentry/nextjs
```

`apps/api/src/config/sentry.ts`:

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### LogTail (Logs)

```bash
pnpm add @logtail/node
```

### Uptime Monitoring

- **UptimeRobot**: https://uptimerobot.com (gratis)
- **Pingdom**: https://www.pingdom.com
- **StatusCake**: https://www.statuscake.com

### Health Check

Configura monitoreo del endpoint `/health`:

```bash
curl https://api.tumotoshop.com/health
```

---

## 🔒 Seguridad en Producción

### 1. CORS

`apps/api/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'https://tumotoshop.com',
    'https://www.tumotoshop.com'
  ],
  credentials: true,
}));
```

### 2. Rate Limiting

```bash
cd apps/api
pnpm add express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests
  message: 'Demasiadas peticiones, intenta más tarde',
});

app.use('/api/', limiter);
```

### 3. Helmet (Headers de seguridad)

Ya está configurado, pero verifica:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### 4. HTTPS

- Vercel y Railway proveen HTTPS automáticamente
- Para servidores propios, usa **Let's Encrypt** con **Certbot**

---

## 🧪 Testing en Producción

### 1. Smoke Tests

Después del despliegue, verifica:

```bash
# Health check
curl https://api.tumotoshop.com/health

# Listar productos
curl https://api.tumotoshop.com/api/products

# Swagger docs
open https://api.tumotoshop.com/api/docs
```

### 2. Test de pago real

⚠️ **Usa una tarjeta de prueba primero**

1. Agrega un producto al carrito
2. Procede al checkout
3. Completa el pago
4. Verifica que el webhook se recibió
5. Confirma que la orden se actualizó

---

## 🔄 CI/CD con GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📝 Checklist Post-Despliegue

- [ ] Frontend accesible en producción
- [ ] Backend accesible en producción
- [ ] Base de datos migrada y con seed
- [ ] Webhooks configurados y funcionando
- [ ] SSL/HTTPS activo
- [ ] Monitoreo configurado
- [ ] Logs funcionando
- [ ] Backup de base de datos configurado
- [ ] Dominio personalizado configurado (si aplica)
- [ ] Tests de humo pasados
- [ ] Documentación actualizada

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"

- Verifica que `DATABASE_URL` esté correcta
- Asegúrate de que `?sslmode=require` esté en la URL para producción
- Verifica que el firewall permita conexiones

### Error: "Webhook signature invalid"

- Verifica que `MERCADOPAGO_WEBHOOK_SECRET` sea correcto
- Asegúrate de estar usando el secret de producción, no de prueba

### Error: "CORS blocked"

- Verifica que el origen esté en la lista de CORS permitidos
- Asegúrate de que `credentials: true` esté configurado

### Build falla en Railway/Render

- Verifica que `pnpm-lock.yaml` esté en el repo
- Asegúrate de que el `Root Directory` esté correcto
- Revisa los logs de build para errores específicos

---

**¡Feliz despliegue! 🚀**

