# 🔐 Variables de Entorno

Este documento detalla todas las variables de entorno utilizadas en el proyecto **Moto E-commerce**.

## 📋 Configuración General

Las variables de entorno se validan automáticamente al iniciar el backend usando **Zod**. Si alguna variable requerida falta o es inválida, la aplicación lanzará un error descriptivo y no se iniciará.

## 🔍 Validador

El validador se encuentra en `apps/api/src/config/env.ts` y garantiza:
- ✅ Todas las variables requeridas están presentes
- ✅ Los tipos de datos son correctos
- ✅ Las URLs son válidas
- ✅ El puerto es un número válido
- ✅ El proveedor de pagos es válido (MERCADOPAGO o CULQI)
- ✅ Las credenciales del proveedor seleccionado están configuradas

## 📝 Variables Disponibles

### Base de Datos

#### `DATABASE_URL` (Requerida)
- **Tipo**: String
- **Descripción**: URL de conexión a PostgreSQL
- **Ejemplo**: `postgresql://postgres:postgres@localhost:5432/moto_ecommerce?schema=public`
- **Formato**: `postgresql://[usuario]:[contraseña]@[host]:[puerto]/[database]?schema=public`

---

### JWT (JSON Web Tokens)

#### `JWT_ACCESS_SECRET` (Requerida)
- **Tipo**: String
- **Descripción**: Secret para firmar tokens de acceso
- **Ejemplo**: `dev_access_secret`
- **Nota**: En producción, usa un string largo y aleatorio

#### `JWT_REFRESH_SECRET` (Requerida)
- **Tipo**: String
- **Descripción**: Secret para firmar tokens de refresco
- **Ejemplo**: `dev_refresh_secret`
- **Nota**: En producción, usa un string largo y aleatorio (diferente al access secret)

---

### Sistema de Pagos

#### `PAYMENT_PROVIDER` (Requerida)
- **Tipo**: Enum
- **Valores**: `MERCADOPAGO` | `CULQI`
- **Descripción**: Proveedor de pagos a utilizar
- **Ejemplo**: `MERCADOPAGO`
- **Validación**: Debe coincidir con las credenciales configuradas

---

### MercadoPago (Requeridas si PAYMENT_PROVIDER=MERCADOPAGO)

#### `MERCADOPAGO_ACCESS_TOKEN`
- **Tipo**: String
- **Descripción**: Token de acceso de MercadoPago
- **Ejemplo**: `APP_USR-1234567890-123456-x1234567890abcdef1234567890abcdef-123456789`
- **Obtención**: [Dashboard de MercadoPago](https://www.mercadopago.com.pe/developers/panel) → Credenciales

#### `MERCADOPAGO_WEBHOOK_SECRET`
- **Tipo**: String
- **Descripción**: Secret para validar webhooks de MercadoPago
- **Ejemplo**: `your_webhook_secret_here`
- **Nota**: Se configura en el panel de webhooks de MercadoPago

---

### Culqi (Requeridas si PAYMENT_PROVIDER=CULQI)

#### `CULQI_PUBLIC_KEY`
- **Tipo**: String
- **Descripción**: Llave pública de Culqi
- **Ejemplo**: `pk_test_1234567890abcdef`
- **Obtención**: [Panel de Culqi](https://culqi.com/) → Configuración → API Keys

#### `CULQI_SECRET_KEY`
- **Tipo**: String
- **Descripción**: Llave secreta de Culqi
- **Ejemplo**: `sk_test_1234567890abcdef`
- **Nota**: ⚠️ **Nunca expongas esta clave en el frontend**

#### `CULQI_WEBHOOK_SECRET`
- **Tipo**: String
- **Descripción**: Secret para validar webhooks de Culqi
- **Ejemplo**: `culqi_webhook_secret`
- **Nota**: Se configura en el panel de webhooks de Culqi

---

### Aplicación

#### `PORT` (Requerida)
- **Tipo**: Number
- **Descripción**: Puerto en el que correrá el servidor backend
- **Ejemplo**: `3001`
- **Default**: `3001`
- **Validación**: Debe ser un número válido

#### `NEXT_PUBLIC_API_BASE` (Requerida)
- **Tipo**: URL String
- **Descripción**: URL base del backend para el frontend
- **Ejemplo**: `http://localhost:3001`
- **Producción**: `https://api.tudominio.com`
- **Validación**: Debe ser una URL válida

---

## 🚀 Configuración por Entorno

### Desarrollo Local

```bash
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moto_ecommerce?schema=public"
JWT_ACCESS_SECRET="dev_access_secret_12345"
JWT_REFRESH_SECRET="dev_refresh_secret_12345"
PAYMENT_PROVIDER="MERCADOPAGO"
MERCADOPAGO_ACCESS_TOKEN="TEST-1234567890-123456-x1234567890abcdef1234567890abcdef-123456789"
MERCADOPAGO_WEBHOOK_SECRET="test_webhook_secret"
PORT=3001
NEXT_PUBLIC_API_BASE="http://localhost:3001"
```

### Producción

```bash
# .env.production
DATABASE_URL="postgresql://user:pass@host:5432/prod_db?schema=public"
JWT_ACCESS_SECRET="[GENERAR_STRING_ALEATORIO_SEGURO_64_CHARS]"
JWT_REFRESH_SECRET="[GENERAR_OTRO_STRING_ALEATORIO_SEGURO_64_CHARS]"
PAYMENT_PROVIDER="MERCADOPAGO"
MERCADOPAGO_ACCESS_TOKEN="APP_USR-[TU_TOKEN_REAL]"
MERCADOPAGO_WEBHOOK_SECRET="[TU_WEBHOOK_SECRET_REAL]"
PORT=3001
NEXT_PUBLIC_API_BASE="https://api.tudominio.com"
```

---

## ⚠️ Seguridad

### ✅ Buenas Prácticas

1. **Nunca commitees el archivo `.env`** a Git
2. **Usa `.env.example`** como plantilla (sin valores reales)
3. **Genera secrets fuertes** para producción:
   ```bash
   # Linux/Mac
   openssl rand -base64 64
   
   # Node.js
   node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
   ```
4. **Rota los secrets** periódicamente
5. **Usa variables de entorno diferentes** por entorno (dev, staging, prod)
6. **No expongas secrets del backend** en el frontend

### 🔒 Variables Públicas vs Privadas

#### Variables PÚBLICAS (pueden ir al frontend)
- ✅ `NEXT_PUBLIC_API_BASE`
- ✅ `CULQI_PUBLIC_KEY` (solo esta, es pública por diseño)

#### Variables PRIVADAS (solo backend)
- 🔒 `DATABASE_URL`
- 🔒 `JWT_ACCESS_SECRET`
- 🔒 `JWT_REFRESH_SECRET`
- 🔒 `MERCADOPAGO_ACCESS_TOKEN`
- 🔒 `MERCADOPAGO_WEBHOOK_SECRET`
- 🔒 `CULQI_SECRET_KEY`
- 🔒 `CULQI_WEBHOOK_SECRET`

---

## 🧪 Testing

Para testing, crea un archivo `.env.test`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moto_ecommerce_test?schema=public"
JWT_ACCESS_SECRET="test_access_secret"
JWT_REFRESH_SECRET="test_refresh_secret"
PAYMENT_PROVIDER="MERCADOPAGO"
MERCADOPAGO_ACCESS_TOKEN="TEST-mock-token"
MERCADOPAGO_WEBHOOK_SECRET="test_webhook"
PORT=3002
NEXT_PUBLIC_API_BASE="http://localhost:3002"
```

---

## 🐛 Troubleshooting

### Error: "DATABASE_URL es requerida"
- ✅ Verifica que el archivo `.env` existe
- ✅ Verifica que la variable está definida correctamente
- ✅ No uses espacios alrededor del `=`

### Error: "PAYMENT_PROVIDER debe ser MERCADOPAGO o CULQI"
- ✅ Revisa que el valor sea exactamente uno de estos dos
- ✅ Respeta mayúsculas/minúsculas

### Error: "MERCADOPAGO_ACCESS_TOKEN es requerido cuando..."
- ✅ Si usas `PAYMENT_PROVIDER=MERCADOPAGO`, debes configurar todas las variables de MercadoPago
- ✅ Lo mismo aplica para Culqi

### Error: "PORT debe ser un número"
- ✅ No uses comillas en el valor del puerto
- ✅ Asegúrate de que sea un número válido (1-65535)

---

## 📚 Referencias

- [MercadoPago - Documentación](https://www.mercadopago.com.pe/developers/es/docs)
- [Culqi - Documentación](https://docs.culqi.com/)
- [Zod - Schema Validation](https://zod.dev/)
- [Prisma - Database](https://www.prisma.io/docs)

