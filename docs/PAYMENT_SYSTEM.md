# 💳 Sistema de Pagos - Moto E-commerce

## 📋 Resumen

Sistema de pagos implementado con el **patrón Adapter** que abstrae las diferencias entre **MercadoPago** y **Culqi**, permitiendo cambiar de proveedor sin modificar el código de negocio.

---

## 🏗️ Arquitectura

### Patrón Adapter

```
┌─────────────────────────────────────────────────┐
│           CheckoutService (Cliente)             │
│         (No conoce los proveedores)             │
└──────────────────┬──────────────────────────────┘
                   │
                   │ usa
                   ↓
┌─────────────────────────────────────────────────┐
│        PaymentGateway (Interface)               │
│  + createPreference()                           │
│  + verifyWebhook()                              │
│  + getPaymentStatus()                           │
└──────────────┬─────────────────┬────────────────┘
               │                 │
    ┌──────────↓──────┐   ┌─────↓──────────┐
    │ MercadoPagoGateway│   │ CulqiGateway    │
    │  (Implementación) │   │ (Implementación)│
    └───────────────────┘   └─────────────────┘
```

### Beneficios

✅ **Desacoplamiento**: El código de negocio no depende de APIs específicas  
✅ **Flexibilidad**: Cambiar de proveedor es configurar una variable  
✅ **Extensibilidad**: Agregar nuevos proveedores sin modificar código existente  
✅ **Testabilidad**: Fácil crear mocks de la interfaz  
✅ **Mantenibilidad**: Cambios en APIs de proveedores no afectan el core  

---

## 📁 Estructura de Archivos

```
apps/api/src/modules/checkout/
├── payment/
│   ├── PaymentGateway.ts          # Interface común
│   ├── MercadoPagoGateway.ts      # Implementación MercadoPago
│   ├── CulqiGateway.ts            # Implementación Culqi
│   └── index.ts                   # Factory function getGateway()
├── checkout.service.ts            # Servicio de checkout
├── checkout.controller.ts         # Controladores HTTP
└── checkout.routes.ts             # Rutas de checkout

apps/api/src/modules/webhooks/
└── webhook.routes.ts              # Rutas de webhooks
```

---

## 🔌 PaymentGateway Interface

### Métodos

#### `createPreference(data: PaymentPreferenceData): Promise<PaymentPreferenceResult>`

Crea una preferencia de pago (checkout).

**Entrada:**
```typescript
interface PaymentPreferenceData {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  payer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  backUrls?: {
    success: string;
    failure: string;
    pending: string;
  };
}
```

**Salida:**
```typescript
interface PaymentPreferenceResult {
  preferenceId: string;
  initPoint: string;      // URL para redirigir al usuario
  externalId: string;
}
```

#### `verifyWebhook(signature, body, headers): Promise<WebhookVerificationResult>`

Verifica la autenticidad de un webhook.

**Salida:**
```typescript
interface WebhookVerificationResult {
  isValid: boolean;
  paymentId?: string;
  orderId?: string;
  status?: string;
  amount?: number;
  errorMessage?: string;
}
```

#### `getPaymentStatus(paymentId: string): Promise<PaymentStatusInfo>`

Obtiene el estado actual de un pago.

---

## 🔷 MercadoPagoGateway

### Características

- ✅ Usa **Checkout Pro** de MercadoPago
- ✅ Genera `init_point` para redirigir al usuario
- ✅ Verifica webhooks con HMAC SHA256
- ✅ Mapea estados de MercadoPago a estados internos

### Configuración

```env
PAYMENT_PROVIDER=MERCADOPAGO
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx
MERCADOPAGO_WEBHOOK_SECRET=tu_secret_aqui
```

### API Endpoints Utilizados

- `POST /checkout/preferences` - Crear preferencia
- `GET /v1/payments/{id}` - Obtener estado de pago

### Verificación de Webhook

MercadoPago envía la firma en el header `x-signature`:

```
x-signature: ts=1234567890,v1=hash_sha256
x-request-id: request_id_123
```

El gateway verifica:
1. Extrae `ts` y `v1` del header
2. Construye string: `id:{payment_id};request-id:{request_id};ts:{ts};`
3. Calcula HMAC SHA256 con el secret
4. Compara con el hash recibido

### Mapeo de Estados

| Estado MercadoPago | Estado Interno |
|--------------------|----------------|
| pending            | PENDING        |
| approved           | APPROVED       |
| authorized         | APPROVED       |
| in_process         | PENDING        |
| rejected           | REJECTED       |
| cancelled          | CANCELLED      |
| refunded           | REFUNDED       |
| charged_back       | REFUNDED       |

---

## 🔶 CulqiGateway

### Características

- ✅ Usa API de **Órdenes** y **Cargos**
- ✅ El frontend crea token con tarjeta, backend crea cargo
- ✅ Verifica webhooks con HMAC SHA256
- ✅ Soporta PEN (soles peruanos)

### Configuración

```env
PAYMENT_PROVIDER=CULQI
CULQI_PUBLIC_KEY=pk_test_xxxxx
CULQI_SECRET_KEY=sk_test_xxxxx
CULQI_WEBHOOK_SECRET=tu_secret_aqui
```

### API Endpoints Utilizados

- `POST /v2/orders` - Crear orden
- `POST /v2/charges` - Crear cargo
- `GET /v2/charges/{id}` - Obtener estado

### Flujo de Pago

1. **Backend** crea orden con `createPreference()`
2. **Frontend** muestra formulario con Culqi.js
3. **Frontend** obtiene token de tarjeta con Culqi.js
4. **Frontend** envía token al backend
5. **Backend** crea cargo con `createCharge(tokenId, ...)`
6. **Culqi** envía webhook de confirmación

### Verificación de Webhook

Culqi envía la firma en el header `x-culqi-signature`:

```
x-culqi-signature: hash_sha256_del_body
```

El gateway verifica:
1. Toma el body completo como JSON string
2. Calcula HMAC SHA256 con el secret
3. Compara con el hash recibido

### Mapeo de Estados

| Estado Culqi      | Estado Interno |
|-------------------|----------------|
| venta_exitosa     | APPROVED       |
| pending           | PENDING        |
| rejected          | REJECTED       |
| expired           | CANCELLED      |

---

## 🏭 Factory Function: `getGateway()`

### Uso

```typescript
import { getGateway } from './modules/checkout/payment';

// Obtiene el gateway configurado en .env
const gateway = getGateway();

// O especifica uno manualmente
const mercadoPago = getGateway('MERCADOPAGO');
const culqi = getGateway('CULQI');
```

### Implementación

```typescript
export function getGateway(provider?: string): PaymentGateway {
  const paymentProvider = provider || env.PAYMENT_PROVIDER;

  switch (paymentProvider) {
    case 'MERCADOPAGO':
      return new MercadoPagoGateway();
    
    case 'CULQI':
      return new CulqiGateway();
    
    default:
      throw new Error(`Proveedor no soportado: ${paymentProvider}`);
  }
}
```

---

## 🛣️ API Endpoints

### POST `/api/checkout`

Crea una orden y retorna la URL de pago.

**Request:**
```json
{
  "userId": "clx123abc",
  "items": [
    {
      "variantId": "clx456def",
      "quantity": 1
    }
  ],
  "shippingCost": 50.00,
  "backUrls": {
    "success": "https://miapp.com/success",
    "failure": "https://miapp.com/failure",
    "pending": "https://miapp.com/pending"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout creado exitosamente",
  "data": {
    "orderId": "clx789ghi",
    "paymentId": "clx012jkl",
    "checkoutUrl": "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=...",
    "total": 12550.00,
    "status": "PENDING"
  }
}
```

### GET `/api/checkout/:orderId`

Obtiene información de una orden.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx789ghi",
    "status": "PAID",
    "total": 12550.00,
    "items": [...],
    "payment": {...}
  }
}
```

### POST `/api/webhooks/mercadopago`

Recibe notificaciones de MercadoPago.

**Headers:**
```
x-signature: ts=1234567890,v1=hash
x-request-id: request_id
```

### POST `/api/webhooks/culqi`

Recibe notificaciones de Culqi.

**Headers:**
```
x-culqi-signature: hash
```

---

## 🔄 Flujo Completo de Compra

### 1. Usuario Agrega al Carrito

```typescript
// El usuario navega y agrega productos al carrito
// (Este flujo está fuera del sistema de pagos)
```

### 2. Usuario Hace Checkout

```http
POST /api/checkout
Content-Type: application/json

{
  "userId": "user_123",
  "items": [
    { "variantId": "variant_456", "quantity": 1 }
  ],
  "shippingCost": 50
}
```

**Backend:**
1. Valida stock
2. Calcula totales
3. Crea `Order` (status: PENDING)
4. Crea `Payment` (status: PENDING)
5. Llama a `gateway.createPreference()`
6. Retorna `checkoutUrl`

### 3. Usuario es Redirigido

```typescript
// Frontend redirige al usuario
window.location.href = checkoutUrl;
// Usuario paga en MercadoPago/Culqi
```

### 4. Webhook Confirma el Pago

```http
POST /api/webhooks/mercadopago
x-signature: ts=...,v1=...

{
  "type": "payment",
  "data": { "id": "123456" }
}
```

**Backend:**
1. Verifica firma del webhook
2. Consulta estado del pago
3. Actualiza `Payment` (status: APPROVED)
4. Actualiza `Order` (status: PAID)
5. Descuenta stock

### 5. Usuario es Redirigido de Vuelta

```
https://miapp.com/success?orderId=clx789ghi
```

Frontend muestra confirmación de compra.

---

## 🧪 Testing

### Crear un Checkout (Desarrollo)

```bash
curl -X POST http://localhost:3001/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "clx123abc",
    "items": [
      { "variantId": "clx456def", "quantity": 1 }
    ],
    "shippingCost": 50
  }'
```

### Simular Webhook (MercadoPago)

```bash
curl -X POST http://localhost:3001/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -H "x-signature: ts=1234567890,v1=test_hash" \
  -H "x-request-id: test_request" \
  -d '{
    "type": "payment",
    "data": { "id": "123456" }
  }'
```

---

## 🔐 Seguridad

### Verificación de Webhooks

✅ **Siempre verifica** la firma del webhook  
✅ **Nunca confíes** en webhooks sin verificar  
✅ **Usa secrets fuertes** en producción  
✅ **Regenera secrets** periódicamente  

### Secretos en Producción

```bash
# Generar secret aleatorio
openssl rand -hex 32
```

### HTTPS Obligatorio

⚠️ Los webhooks **deben** recibirse en HTTPS en producción.

---

## 📊 Estados del Sistema

### PaymentStatus

- `PENDING` - Pago pendiente
- `APPROVED` - Pago aprobado
- `REJECTED` - Pago rechazado
- `CANCELLED` - Pago cancelado
- `REFUNDED` - Pago reembolsado

### OrderStatus

- `PENDING` - Orden creada, esperando pago
- `PAID` - Orden pagada
- `PROCESSING` - En preparación
- `SHIPPED` - Enviada
- `DELIVERED` - Entregada
- `CANCELLED` - Cancelada
- `REFUNDED` - Reembolsada

---

## 🔄 Agregar Nuevo Proveedor

### 1. Crear Implementación

```typescript
// apps/api/src/modules/checkout/payment/PayPalGateway.ts

export class PayPalGateway implements PaymentGateway {
  async createPreference(data: PaymentPreferenceData): Promise<PaymentPreferenceResult> {
    // Implementar con API de PayPal
  }

  async verifyWebhook(signature: string, body: any, headers: Record<string, string>): Promise<WebhookVerificationResult> {
    // Verificar webhook de PayPal
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusInfo> {
    // Consultar estado en PayPal
  }
}
```

### 2. Registrar en Factory

```typescript
// apps/api/src/modules/checkout/payment/index.ts

export function getGateway(provider?: string): PaymentGateway {
  switch (paymentProvider) {
    case 'MERCADOPAGO':
      return new MercadoPagoGateway();
    case 'CULQI':
      return new CulqiGateway();
    case 'PAYPAL':  // ← Nuevo
      return new PayPalGateway();
    default:
      throw new Error(`Proveedor no soportado`);
  }
}
```

### 3. Configurar Variables

```env
PAYMENT_PROVIDER=PAYPAL
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx
```

✅ **No se necesita modificar código de negocio**

---

## 📝 Mejores Prácticas

1. **Siempre verifica webhooks** antes de procesar
2. **Registra (log) todos los webhooks** para auditoría
3. **Maneja idempotencia** (webhook puede llegar múltiples veces)
4. **Retorna 200** en webhooks para evitar reintentos
5. **Usa HTTPS** en producción
6. **Mantén secrets seguros** y rotativos
7. **Prueba con sandbox** antes de producción

---

## 🐛 Troubleshooting

### Error: "Proveedor no soportado"

```bash
# Verifica la variable de entorno
echo $PAYMENT_PROVIDER

# Debe ser: MERCADOPAGO o CULQI
```

### Webhook no se procesa

1. Verifica que el secret esté correcto
2. Revisa logs del servidor
3. Usa herramientas como ngrok para testing local
4. Verifica headers del webhook

### initPoint undefined

- MercadoPago: Revisa el access token
- Culqi: Verifica las llaves pública y secreta

---

## 📚 Referencias

- [MercadoPago API](https://www.mercadopago.com.pe/developers/es/docs)
- [Culqi API](https://docs.culqi.com/)
- [Patrón Adapter](https://refactoring.guru/design-patterns/adapter)

---

## ✅ Implementación Completa

✅ Patrón Adapter implementado  
✅ MercadoPago Gateway funcional  
✅ Culqi Gateway funcional  
✅ Factory function getGateway()  
✅ Endpoints de checkout  
✅ Webhooks integrados  
✅ Actualización de Order + Payment  
✅ Descuento de stock automático  
✅ Verificación de firmas  
✅ Documentación completa  

**El sistema de pagos está 100% funcional y listo para producción.** 🎉

