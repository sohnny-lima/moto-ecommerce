# 🏍️ Moto E-commerce

Plataforma completa de e-commerce para venta de motocicletas, desarrollada con arquitectura de monorepo usando **Turborepo**, **Next.js 15**, **Express**, **Prisma** y **PostgreSQL**.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Documentation](#api-documentation)
- [Integración de Pagos](#integración-de-pagos)
- [Testing con MercadoPago Sandbox](#testing-con-mercadopago-sandbox)
- [Scripts Disponibles](#scripts-disponibles)

---

## ✨ Características

- 🛒 **Catálogo de productos** con filtros avanzados (marca, categoría, color, precio)
- 🔍 **Búsqueda** y ordenamiento de productos
- 🎨 **Variantes de productos** (colores, SKU, stock individual)
- 💳 **Integración de pagos** con MercadoPago y Culqi (patrón Adapter)
- 📦 **Gestión de órdenes** con estados y tracking
- 🔔 **Webhooks** para actualización automática de pagos
- 📱 **Diseño responsive** con Tailwind CSS
- 🔐 **Autenticación JWT** (preparado para implementar)
- 📊 **Panel de administración** (preparado para implementar)
- 🚀 **SSR/SSG** con Next.js 15
- 📖 **Documentación API** con Swagger/OpenAPI

---

## 🛠️ Tecnologías

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (gestión de estado)
- **Axios** (cliente HTTP)

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (autenticación)
- **Zod** (validación)

### Pagos
- **MercadoPago** (Checkout Pro)
- **Culqi** (API de cargos)

### DevOps
- **Turborepo** (monorepo)
- **pnpm** (gestor de paquetes)
- **Docker** (opcional)

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **PostgreSQL** >= 14.x
- **Git**

### Instalación de pnpm

```bash
npm install -g pnpm
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/moto-ecommerce.git
cd moto-ecommerce
```

### 2. Instalar dependencias

```bash
pnpm install
```

Este comando instalará todas las dependencias de todos los paquetes del monorepo.

---

## ⚙️ Configuración

### 1. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Postgres
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/moto_ecommerce?schema=public"

# JWT
JWT_ACCESS_SECRET="tu_secret_super_seguro_aqui"
JWT_REFRESH_SECRET="tu_refresh_secret_super_seguro_aqui"

# Pagos
PAYMENT_PROVIDER="MERCADOPAGO"  # o "CULQI"
MERCADOPAGO_ACCESS_TOKEN="TEST-1234567890-123456-abcdef1234567890abcdef1234567890-123456789"
MERCADOPAGO_WEBHOOK_SECRET="tu_webhook_secret_mercadopago"
CULQI_PUBLIC_KEY="pk_test_xxxxxxxxxxxxxxxx"
CULQI_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxx"
CULQI_WEBHOOK_SECRET="tu_webhook_secret_culqi"

# App
PORT=3001
NEXT_PUBLIC_API_BASE="http://localhost:3001"
```

### 2. Configurar base de datos

Asegúrate de que PostgreSQL esté corriendo y crea la base de datos:

```sql
CREATE DATABASE moto_ecommerce;
```

---

## 🗄️ Base de Datos

### 1. Generar cliente Prisma

```bash
pnpm db:generate
```

### 2. Ejecutar migraciones

```bash
pnpm db:migrate
```

Este comando aplicará todas las migraciones y creará las tablas en la base de datos.

### 3. Poblar la base de datos (seed)

```bash
pnpm db:seed
```

Esto creará:
- ✅ 4 marcas (Honda, Yamaha, Bajaj, Suzuki)
- ✅ 6 categorías (Scooter, Deportiva, Chopper, Touring, Off-Road, Eléctrica)
- ✅ ~12 productos con imágenes
- ✅ Variantes con colores (rojo, azul, negro, etc.)
- ✅ Usuario ADMIN: `admin@demo.com` / `admin123`
- ✅ Usuario CUSTOMER: `user@demo.com` / `user123`

---

## 🏃 Ejecución

### Modo desarrollo (todos los servicios)

```bash
pnpm dev
```

Esto iniciará:
- 🌐 **Frontend (Next.js)**: http://localhost:3000
- 🔌 **Backend (Express)**: http://localhost:3001
- 📖 **API Docs (Swagger)**: http://localhost:3001/api/docs

### Ejecutar solo el backend

```bash
pnpm dev:api
```

### Ejecutar solo el frontend

```bash
pnpm dev:web
```

### Prisma Studio (explorador de base de datos)

```bash
pnpm db:studio
```

Abre http://localhost:5555 para explorar y editar datos.

---

## 📁 Estructura del Proyecto

```
moto-ecommerce/
├── apps/
│   ├── api/                    # Backend (Express + Prisma)
│   │   ├── src/
│   │   │   ├── config/         # Configuración (env, swagger)
│   │   │   ├── modules/
│   │   │   │   ├── products/   # Módulo de productos
│   │   │   │   ├── checkout/   # Módulo de checkout y pagos
│   │   │   │   └── webhooks/   # Webhooks de proveedores
│   │   │   └── index.ts        # Punto de entrada
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Esquema de base de datos
│   │   │   ├── migrations/     # Migraciones
│   │   │   └── seed.ts         # Datos iniciales
│   │   └── package.json
│   │
│   └── web/                    # Frontend (Next.js 15)
│       ├── src/
│       │   ├── app/            # App Router
│       │   │   ├── page.tsx    # Home
│       │   │   ├── catalogo/   # Catálogo de productos
│       │   │   ├── producto/   # Detalle de producto
│       │   │   ├── carrito/    # Carrito de compras
│       │   │   ├── checkout/   # Proceso de pago
│       │   │   ├── blog/       # Blog
│       │   │   ├── servicio/   # Página de servicio
│       │   │   ├── contacto/   # Contacto
│       │   │   └── auth/       # Login/Register
│       │   ├── components/     # Componentes React
│       │   ├── lib/            # Utilidades
│       │   └── store/          # Zustand stores
│       └── package.json
│
├── packages/
│   ├── ui/                     # Componentes compartidos
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── ProductCard.tsx
│   │       ├── PriceBadge.tsx
│   │       ├── FilterWidget.tsx
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── HeroSlider.tsx
│   │
│   └── config/                 # Configuración compartida
│       ├── tsconfig.package.json
│       └── eslint.base.cjs
│
├── .env.example                # Plantilla de variables de entorno
├── turbo.json                  # Configuración de Turborepo
├── pnpm-workspace.yaml         # Configuración de workspace
└── package.json                # Scripts raíz
```

---

## 📖 API Documentation

La documentación completa de la API está disponible en **Swagger UI** cuando el servidor está corriendo:

🔗 **http://localhost:3001/api/docs**

### Endpoints principales

#### Products
- `GET /api/products` - Listar productos con filtros
- `GET /api/products/:slug` - Obtener producto por slug
- `GET /api/products/id/:id` - Obtener producto por ID
- `GET /api/products/filters/brands` - Listar marcas
- `GET /api/products/filters/categories` - Listar categorías
- `GET /api/products/filters/colors` - Listar colores

#### Checkout
- `POST /api/checkout` - Crear orden y checkout
- `GET /api/checkout/:orderId` - Obtener orden

#### Webhooks
- `POST /api/webhooks/mercadopago` - Webhook MercadoPago
- `POST /api/webhooks/culqi` - Webhook Culqi

#### Health
- `GET /health` - Health check del servidor

---

## 💳 Integración de Pagos

El proyecto implementa el **patrón Adapter** para soportar múltiples proveedores de pago.

### Arquitectura

```
PaymentGateway (Interface)
    ├── MercadoPagoGateway
    └── CulqiGateway
```

### Cambiar proveedor de pagos

Edita la variable `PAYMENT_PROVIDER` en el archivo `.env`:

```env
PAYMENT_PROVIDER="MERCADOPAGO"  # o "CULQI"
```

### MercadoPago (Checkout Pro)

1. Crea una cuenta en https://www.mercadopago.com.pe/developers
2. Obtén tus credenciales de prueba (TEST)
3. Configura el webhook en tu panel de MercadoPago

### Culqi

1. Crea una cuenta en https://www.culqi.com
2. Obtén tus llaves de prueba
3. Configura el webhook en tu panel de Culqi

---

## 🧪 Testing con MercadoPago Sandbox

### 1. Configurar credenciales de prueba

Usa las credenciales **TEST** de tu cuenta de MercadoPago:

```env
MERCADOPAGO_ACCESS_TOKEN="TEST-1234567890-123456-abcdef..."
```

### 2. Exponer tu servidor local con ngrok

Para recibir webhooks en desarrollo, necesitas exponer tu servidor local:

#### Instalar ngrok

```bash
# Windows (con Chocolatey)
choco install ngrok

# macOS (con Homebrew)
brew install ngrok

# Linux (con snap)
snap install ngrok
```

#### Ejecutar ngrok

```bash
ngrok http 3001
```

Obtendrás una URL pública como: `https://abc123.ngrok.io`

### 3. Configurar webhook en MercadoPago

1. Ve a https://www.mercadopago.com.pe/developers/panel/notifications/webhooks
2. Crea un nuevo webhook con la URL:
   ```
   https://abc123.ngrok.io/api/webhooks/mercadopago
   ```
3. Selecciona los eventos: `payment.created`, `payment.updated`
4. Copia el **Webhook Secret** y agrégalo a tu `.env`

### 4. Probar el flujo completo

1. Inicia el servidor:
   ```bash
   pnpm dev
   ```

2. Abre la aplicación: http://localhost:3000

3. Agrega productos al carrito

4. Procede al checkout

5. Usa tarjetas de prueba de MercadoPago:
   - **Visa aprobada**: `4509 9535 6623 3704`
   - **Mastercard rechazada**: `5031 7557 3453 0604`
   - CVV: cualquier 3 dígitos
   - Fecha: cualquier fecha futura

6. Verifica en ngrok que se recibió el webhook:
   ```
   http://localhost:4040
   ```

7. Comprueba que la orden se actualizó en la base de datos

---

## 📜 Scripts Disponibles

### Raíz del proyecto

```bash
pnpm install          # Instalar dependencias
pnpm dev              # Iniciar todos los servicios en desarrollo
pnpm build            # Compilar todos los paquetes
pnpm lint             # Ejecutar linter en todos los paquetes
pnpm clean            # Limpiar archivos generados
```

### Base de datos

```bash
pnpm db:generate      # Generar cliente Prisma
pnpm db:migrate       # Ejecutar migraciones
pnpm db:seed          # Poblar base de datos
pnpm db:studio        # Abrir Prisma Studio
pnpm db:push          # Push schema sin migración (desarrollo)
pnpm db:reset         # Resetear base de datos (⚠️ borra todo)
```

### Backend (apps/api)

```bash
pnpm dev:api          # Iniciar backend en desarrollo
pnpm build:api        # Compilar backend
pnpm start:api        # Iniciar backend en producción
```

### Frontend (apps/web)

```bash
pnpm dev:web          # Iniciar frontend en desarrollo
pnpm build:web        # Compilar frontend
pnpm start:web        # Iniciar frontend en producción
```

---

## 🔐 Seguridad

### Producción

Antes de desplegar a producción:

1. ✅ Cambia todos los secrets en `.env`
2. ✅ Usa credenciales de producción de MercadoPago/Culqi
3. ✅ Configura CORS correctamente
4. ✅ Habilita HTTPS
5. ✅ Configura rate limiting
6. ✅ Implementa autenticación JWT completa
7. ✅ Revisa y valida todos los inputs
8. ✅ Configura logs y monitoreo

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Tu Nombre** - [GitHub](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [MercadoPago](https://www.mercadopago.com.pe/)
- [Culqi](https://www.culqi.com/)
- [Turborepo](https://turbo.build/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Soporte

Si tienes alguna pregunta o problema:

- 📧 Email: support@motoshop.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/moto-ecommerce/issues)
- 📖 Docs: http://localhost:3001/api/docs

---

**¡Feliz coding! 🏍️💨**
