# 🗄️ Esquema de Base de Datos - Moto E-commerce

## 📋 Resumen

Este documento describe el esquema completo de la base de datos implementado con **Prisma ORM** para el proyecto Moto E-commerce.

---

## 🎯 Modelos y Relaciones

### Diagrama de Relaciones

```
User (1) ──────── (1) Cart ──────── (N) CartItem ──────── (1) Variant
  │                                                            │
  │                                                            │
  └── (N) Order ──── (1) Payment                              │
         │                                                     │
         └── (N) OrderItem ─────────────────────────────────┘
                                                               │
Brand (1) ──── (N) Product ──── (N) Variant                  │
                    │                                          │
Category (1) ───────┘                                         │
                                                               │
                    (relación entre OrderItem/CartItem y Variant)
```

---

## 📊 Modelos Detallados

### 1️⃣ **User** (Usuarios)

Usuarios del sistema (administradores y clientes).

| Campo      | Tipo     | Descripción                    |
|------------|----------|--------------------------------|
| id         | String   | ID único (cuid)                |
| email      | String   | Email único                    |
| password   | String   | Contraseña hasheada (bcrypt)   |
| firstName  | String   | Nombre                         |
| lastName   | String   | Apellido                       |
| phone      | String?  | Teléfono (opcional)            |
| role       | UserRole | ADMIN o CUSTOMER (default)     |
| createdAt  | DateTime | Fecha de creación              |
| updatedAt  | DateTime | Fecha de actualización         |

**Relaciones:**
- `cart` - Cart (1:1)
- `orders` - Order[] (1:N)

**Usuarios por Defecto (Seed):**
- **Admin**: `admin@demo.com` / `Admin123!`
- **Customer**: `customer@demo.com` / `Customer123!`

---

### 2️⃣ **Brand** (Marcas)

Marcas de motocicletas.

| Campo       | Tipo     | Descripción               |
|-------------|----------|---------------------------|
| id          | String   | ID único (cuid)           |
| name        | String   | Nombre único de la marca  |
| description | String?  | Descripción (opcional)    |
| logoUrl     | String?  | URL del logo (opcional)   |
| createdAt   | DateTime | Fecha de creación         |
| updatedAt   | DateTime | Fecha de actualización    |

**Relaciones:**
- `products` - Product[] (1:N)

**Marcas por Defecto (Seed):**
1. **Honda** - Líder mundial en motocicletas
2. **Yamaha** - Alto rendimiento y diseño japonés
3. **Bajaj** - Eficiencia y excelente precio
4. **Suzuki** - Innovación y rendimiento

---

### 3️⃣ **Category** (Categorías)

Categorías de motocicletas.

| Campo       | Tipo     | Descripción                |
|-------------|----------|----------------------------|
| id          | String   | ID único (cuid)            |
| name        | String   | Nombre único de categoría  |
| description | String?  | Descripción (opcional)     |
| imageUrl    | String?  | Imagen (opcional)          |
| createdAt   | DateTime | Fecha de creación          |
| updatedAt   | DateTime | Fecha de actualización     |

**Relaciones:**
- `products` - Product[] (1:N)

**Categorías por Defecto (Seed):**
1. **Scooter** - Urbanas y económicas
2. **Deportiva** - Alta velocidad y rendimiento
3. **Chopper** - Estilo clásico americano
4. **Touring** - Viajes largos y comodidad
5. **Naked** - Diseño minimalista y ágil
6. **Off-Road** - Todo terreno y aventura

---

### 4️⃣ **Product** (Productos)

Productos (motocicletas) del catálogo.

| Campo       | Tipo     | Descripción                    |
|-------------|----------|--------------------------------|
| id          | String   | ID único (cuid)                |
| name        | String   | Nombre del producto            |
| description | String   | Descripción detallada          |
| price       | Decimal  | Precio base (10,2)             |
| brandId     | String   | FK a Brand                     |
| categoryId  | String   | FK a Category                  |
| images      | String[] | Array de URLs de imágenes      |
| isActive    | Boolean  | Activo/Inactivo (default true) |
| createdAt   | DateTime | Fecha de creación              |
| updatedAt   | DateTime | Fecha de actualización         |

**Relaciones:**
- `brand` - Brand (N:1)
- `category` - Category (N:1)
- `variants` - Variant[] (1:N)

**Productos por Defecto (Seed):** 12 productos
- Honda PCX 160, Honda CRF 250L, Honda CBR 500R
- Yamaha R15 V4, Yamaha MT-03, Yamaha FZ-15
- Bajaj Pulsar NS200, Bajaj Avenger Cruise 220, Bajaj Dominar 400
- Suzuki Gixxer SF 250, Suzuki V-Strom 650 XT, Suzuki Intruder 150

---

### 5️⃣ **Variant** (Variantes)

Variantes de productos (colores, SKU).

| Campo     | Tipo     | Descripción            |
|-----------|----------|------------------------|
| id        | String   | ID único (cuid)        |
| productId | String   | FK a Product           |
| color     | String   | Color de la variante   |
| stock     | Int      | Stock disponible       |
| sku       | String   | SKU único              |
| createdAt | DateTime | Fecha de creación      |
| updatedAt | DateTime | Fecha de actualización |

**Relaciones:**
- `product` - Product (N:1)
- `cartItems` - CartItem[] (1:N)
- `orderItems` - OrderItem[] (1:N)

**Colores Disponibles (Seed):**
- Rojo, Azul, Negro (principal)
- Rojo Racing, Azul Racing, Negro Mate
- Amarillo Campeón, etc.

**Total Variantes:** 32 variantes creadas

---

### 6️⃣ **Cart** (Carrito)

Carrito de compras del usuario.

| Campo     | Tipo     | Descripción            |
|-----------|----------|------------------------|
| id        | String   | ID único (cuid)        |
| userId    | String   | FK a User (único)      |
| createdAt | DateTime | Fecha de creación      |
| updatedAt | DateTime | Fecha de actualización |

**Relaciones:**
- `user` - User (1:1)
- `items` - CartItem[] (1:N)

---

### 7️⃣ **CartItem** (Items del Carrito)

Items individuales dentro del carrito.

| Campo     | Tipo     | Descripción            |
|-----------|----------|------------------------|
| id        | String   | ID único (cuid)        |
| cartId    | String   | FK a Cart              |
| variantId | String   | FK a Variant           |
| quantity  | Int      | Cantidad               |
| createdAt | DateTime | Fecha de creación      |
| updatedAt | DateTime | Fecha de actualización |

**Relaciones:**
- `cart` - Cart (N:1)
- `variant` - Variant (N:1)

**Constraints:**
- Unique: `[cartId, variantId]` - Un usuario no puede tener la misma variante dos veces

---

### 8️⃣ **Order** (Órdenes)

Órdenes de compra.

| Campo        | Tipo        | Descripción                    |
|--------------|-------------|--------------------------------|
| id           | String      | ID único (cuid)                |
| userId       | String      | FK a User                      |
| status       | OrderStatus | Estado de la orden (default PENDING) |
| subtotal     | Decimal     | Subtotal (10,2)                |
| shippingCost | Decimal     | Costo de envío (10,2)          |
| tax          | Decimal     | Impuestos (10,2)               |
| total        | Decimal     | Total (10,2)                   |
| createdAt    | DateTime    | Fecha de creación              |
| updatedAt    | DateTime    | Fecha de actualización         |

**Relaciones:**
- `user` - User (N:1)
- `items` - OrderItem[] (1:N)
- `payment` - Payment (1:1)

**Estados (OrderStatus):**
- `PENDING` - Pendiente
- `PAID` - Pagado
- `PROCESSING` - En proceso
- `SHIPPED` - Enviado
- `DELIVERED` - Entregado
- `CANCELLED` - Cancelado
- `REFUNDED` - Reembolsado

---

### 9️⃣ **OrderItem** (Items de la Orden)

Items individuales de una orden.

| Campo      | Tipo     | Descripción            |
|------------|----------|------------------------|
| id         | String   | ID único (cuid)        |
| orderId    | String   | FK a Order             |
| variantId  | String   | FK a Variant           |
| quantity   | Int      | Cantidad               |
| unitPrice  | Decimal  | Precio unitario (10,2) |
| totalPrice | Decimal  | Precio total (10,2)    |

**Relaciones:**
- `order` - Order (N:1)
- `variant` - Variant (N:1)

---

### 🔟 **Payment** (Pagos)

Pagos asociados a órdenes.

| Campo           | Tipo            | Descripción                   |
|-----------------|-----------------|-------------------------------|
| id              | String          | ID único (cuid)               |
| orderId         | String          | FK a Order (único)            |
| provider        | PaymentProvider | MERCADOPAGO o CULQI           |
| status          | PaymentStatus   | Estado del pago (default PENDING) |
| amount          | Decimal         | Monto (10,2)                  |
| currency        | String          | Moneda (default "PEN")        |
| externalId      | String?         | ID en el proveedor (opcional) |
| externalStatus  | String?         | Estado del proveedor (opcional) |
| paymentMethod   | String?         | Método de pago (opcional)     |
| transactionDate | DateTime?       | Fecha de transacción (opcional) |
| errorMessage    | String?         | Mensaje de error (opcional)   |
| webhookData     | Json?           | Datos del webhook (opcional)  |
| createdAt       | DateTime        | Fecha de creación             |
| updatedAt       | DateTime        | Fecha de actualización        |

**Relaciones:**
- `order` - Order (1:1)

**Estados (PaymentStatus):**
- `PENDING` - Pendiente
- `APPROVED` - Aprobado
- `REJECTED` - Rechazado
- `CANCELLED` - Cancelado
- `REFUNDED` - Reembolsado

**Proveedores (PaymentProvider):**
- `MERCADOPAGO` - MercadoPago (Perú)
- `CULQI` - Culqi (Perú)

---

## 🔑 Enums

### UserRole
```typescript
enum UserRole {
  ADMIN      // Administrador del sistema
  CUSTOMER   // Cliente normal
}
```

### OrderStatus
```typescript
enum OrderStatus {
  PENDING     // Orden creada, esperando pago
  PAID        // Pagado exitosamente
  PROCESSING  // En proceso de preparación
  SHIPPED     // Enviado
  DELIVERED   // Entregado
  CANCELLED   // Cancelado
  REFUNDED    // Reembolsado
}
```

### PaymentStatus
```typescript
enum PaymentStatus {
  PENDING    // Pago pendiente
  APPROVED   // Pago aprobado
  REJECTED   // Pago rechazado
  CANCELLED  // Pago cancelado
  REFUNDED   // Pago reembolsado
}
```

### PaymentProvider
```typescript
enum PaymentProvider {
  MERCADOPAGO  // MercadoPago
  CULQI        // Culqi
}
```

---

## 🔄 Flujo de Compra

### 1. Navegación y Carrito
```
User → Browse Products → Add Variant to Cart → CartItem created
```

### 2. Checkout
```
User → View Cart → Proceed to Checkout → Order created (PENDING)
```

### 3. Pago
```
Order → Payment created (PENDING) → User pays → Webhook received → Payment updated (APPROVED) → Order updated (PAID)
```

### 4. Procesamiento y Envío
```
Order (PAID) → PROCESSING → SHIPPED → DELIVERED
```

---

## 📝 Comandos Útiles

### Gestión de Base de Datos

```bash
# Sincronizar schema (desarrollo)
pnpm db:push

# Crear migración (producción)
pnpm db:migrate

# Ejecutar seed
pnpm db:seed

# Abrir Prisma Studio (explorador visual)
pnpm db:studio

# Generar cliente de Prisma
npx prisma generate
```

### Seed

El seed crea automáticamente:
- ✅ 2 usuarios (admin y customer)
- ✅ 4 marcas de motocicletas
- ✅ 6 categorías
- ✅ 12 productos completos
- ✅ 32 variantes de colores

---

## 🔒 Constraints e Índices

### Unique Constraints
- `User.email` - Un email por usuario
- `Brand.name` - Nombre único de marca
- `Category.name` - Nombre único de categoría
- `Variant.sku` - SKU único por variante
- `Cart.userId` - Un carrito por usuario
- `CartItem[cartId, variantId]` - Una variante por carrito
- `Payment.orderId` - Un pago por orden

### Cascade Deletes
- Al eliminar `User` → se eliminan `Cart` y sus `CartItem`
- Al eliminar `Brand` → se eliminan sus `Product` y `Variant`
- Al eliminar `Category` → se eliminan sus `Product` y `Variant`
- Al eliminar `Product` → se eliminan sus `Variant`
- Al eliminar `Cart` → se eliminan sus `CartItem`
- Al eliminar `Order` → se eliminan `OrderItem` y `Payment`

---

## 📊 Estadísticas del Seed

| Entidad       | Cantidad |
|---------------|----------|
| Usuarios      | 2        |
| Marcas        | 4        |
| Categorías    | 6        |
| Productos     | 12       |
| Variantes     | 32       |
| **TOTAL**     | **56**   |

---

## 🎨 Tipos de Datos Especiales

### Decimal
Usado para precios y montos monetarios con precisión de 10 dígitos y 2 decimales.

```typescript
price: Decimal @db.Decimal(10, 2)
// Ejemplo: 12500.00
```

### String[]
Array de strings usado para múltiples imágenes.

```typescript
images: String[]
// Ejemplo: ["url1.jpg", "url2.jpg", "url3.jpg"]
```

### Json
Tipo JSON usado para almacenar datos del webhook.

```typescript
webhookData: Json?
// Ejemplo: { "status": "approved", "payment_id": "123" }
```

---

## 🔗 Referencias

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

