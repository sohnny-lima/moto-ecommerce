# ✅ Prisma Schema + Seed Completado

## 🎉 Resumen de Implementación

Se ha implementado exitosamente el esquema completo de base de datos con **Prisma ORM** y se ha ejecutado el seed con datos iniciales.

---

## 📋 Lo que se Implementó

### 1. ✅ **Schema Prisma Completo** (`prisma/schema.prisma`)

#### Modelos Implementados (10):
1. **User** - Usuarios del sistema
2. **Brand** - Marcas de motocicletas
3. **Category** - Categorías de productos
4. **Product** - Productos (motocicletas)
5. **Variant** - Variantes de productos (colores)
6. **Cart** - Carrito de compras
7. **CartItem** - Items del carrito
8. **Order** - Órdenes de compra
9. **OrderItem** - Items de órdenes
10. **Payment** - Pagos

#### Enums Implementados (4):
- `UserRole`: ADMIN, CUSTOMER
- `OrderStatus`: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- `PaymentStatus`: PENDING, APPROVED, REJECTED, CANCELLED, REFUNDED
- `PaymentProvider`: MERCADOPAGO, CULQI

#### Relaciones Implementadas:
```
✅ Brand 1──N Product
✅ Category 1──N Product
✅ Product 1──N Variant
✅ User 1──1 Cart
✅ Cart 1──N CartItem
✅ Variant 1──N CartItem
✅ User 1──N Order
✅ Order 1──N OrderItem
✅ Order 1──1 Payment
✅ Variant 1──N OrderItem
```

#### Características Especiales:
- ✅ Decimal para precios (precisión monetaria)
- ✅ String[] para múltiples imágenes
- ✅ Json para webhookData
- ✅ Cascade deletes configurados
- ✅ Unique constraints
- ✅ Default values

---

### 2. ✅ **Seed Completo** (`prisma/seed.ts`)

#### Datos Creados:

##### 👥 **Usuarios (2)**
| Email              | Password     | Role     |
|--------------------|--------------|----------|
| admin@demo.com     | Admin123!    | ADMIN    |
| customer@demo.com  | Customer123! | CUSTOMER |

##### 🏷️ **Marcas (4)**
1. **Honda** - Líder mundial en motocicletas
2. **Yamaha** - Alto rendimiento y diseño japonés
3. **Bajaj** - Eficiencia y excelente relación precio-calidad
4. **Suzuki** - Innovación y rendimiento

##### 📂 **Categorías (6)**
1. **Scooter** - Urbanas y económicas
2. **Deportiva** - Alta velocidad
3. **Chopper** - Estilo clásico
4. **Touring** - Viajes largos
5. **Naked** - Diseño minimalista
6. **Off-Road** - Todo terreno

##### 🏍️ **Productos (12)**

| #  | Producto                  | Marca   | Categoría | Precio    | Variantes |
|----|---------------------------|---------|-----------|-----------|-----------|
| 1  | Honda PCX 160             | Honda   | Scooter   | S/12,500  | 3         |
| 2  | Yamaha R15 V4             | Yamaha  | Deportiva | S/15,800  | 3         |
| 3  | Bajaj Pulsar NS200        | Bajaj   | Naked     | S/9,500   | 3         |
| 4  | Suzuki Gixxer SF 250      | Suzuki  | Deportiva | S/14,200  | 3         |
| 5  | Honda CRF 250L            | Honda   | Off-Road  | S/16,500  | 2         |
| 6  | Yamaha MT-03              | Yamaha  | Naked     | S/18,900  | 2         |
| 7  | Bajaj Avenger Cruise 220  | Bajaj   | Chopper   | S/10,200  | 2         |
| 8  | Suzuki V-Strom 650 XT     | Suzuki  | Touring   | S/28,500  | 3         |
| 9  | Honda CBR 500R            | Honda   | Deportiva | S/24,500  | 3         |
| 10 | Yamaha FZ-15              | Yamaha  | Naked     | S/8,200   | 3         |
| 11 | Bajaj Dominar 400         | Bajaj   | Touring   | S/13,800  | 3         |
| 12 | Suzuki Intruder 150       | Suzuki  | Chopper   | S/7,500   | 2         |

##### 🎨 **Variantes (32 total)**

Cada producto tiene variantes de colores:
- **Colores disponibles**: Rojo, Azul, Negro, Negro Mate, Azul Racing, Rojo Racing, Amarillo Campeón, etc.
- **SKUs únicos**: Cada variante tiene su propio SKU (ej: `PCX160-RED-001`)
- **Stock inicial**: Entre 3 y 30 unidades por variante

---

## 📊 Estadísticas Finales

```
👥 Usuarios:      2
🏷️  Marcas:        4
📂 Categorías:    6
🏍️  Productos:     12
🎨 Variantes:     32
━━━━━━━━━━━━━━━━━━━━━
📦 Total:         56 registros
```

---

## 🚀 Cómo Usar

### Ver los Datos con Prisma Studio

```bash
pnpm db:studio
```

Esto abrirá un explorador visual en el navegador donde puedes ver y editar todos los datos.

### Acceder desde el Código

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los productos con marca y categoría
const products = await prisma.product.findMany({
  include: {
    brand: true,
    category: true,
    variants: true,
  },
});

// Obtener productos por categoría
const sportBikes = await prisma.product.findMany({
  where: {
    category: {
      name: 'Deportiva',
    },
  },
});

// Obtener variantes de un producto con stock
const variants = await prisma.variant.findMany({
  where: {
    productId: 'some-product-id',
    stock: {
      gt: 0, // Mayor que 0
    },
  },
});
```

---

## 🔄 Comandos Disponibles

### Base de Datos

```bash
# Sincronizar schema (desarrollo)
pnpm db:push

# Crear migración (producción)
pnpm db:migrate

# Ejecutar seed
pnpm db:seed

# Abrir Prisma Studio
pnpm db:studio

# Generar cliente de Prisma
npx prisma generate
```

### Re-ejecutar el Seed

Si necesitas resetear los datos:

```bash
# Sincronizar y ejecutar seed
pnpm db:push --accept-data-loss && pnpm db:seed
```

---

## 📁 Archivos Creados

```
prisma/
├── schema.prisma       ✅ Schema completo con 10 modelos
└── seed.ts             ✅ Seed con 56 registros

docs/
└── DATABASE_SCHEMA.md  ✅ Documentación detallada
```

---

## 🎯 Flujo de Compra Implementado

### 1. Usuario Navega y Agrega al Carrito
```typescript
// El usuario ve productos
const products = await prisma.product.findMany();

// Selecciona una variante (color)
const variant = await prisma.variant.findFirst({
  where: { productId, color: 'Rojo' }
});

// Agrega al carrito
const cartItem = await prisma.cartItem.create({
  data: {
    cartId: user.cart.id,
    variantId: variant.id,
    quantity: 1,
  },
});
```

### 2. Usuario Hace Checkout
```typescript
// Crea la orden
const order = await prisma.order.create({
  data: {
    userId: user.id,
    status: 'PENDING',
    subtotal: 12500,
    shippingCost: 50,
    tax: 2250,
    total: 14800,
    items: {
      create: cartItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.variant.product.price,
        totalPrice: item.variant.product.price * item.quantity,
      })),
    },
  },
});
```

### 3. Pago
```typescript
// Crea el registro de pago
const payment = await prisma.payment.create({
  data: {
    orderId: order.id,
    provider: 'MERCADOPAGO',
    status: 'PENDING',
    amount: order.total,
    currency: 'PEN',
  },
});

// Webhook actualiza el pago
const updatedPayment = await prisma.payment.update({
  where: { id: payment.id },
  data: {
    status: 'APPROVED',
    externalId: 'MP-123456',
    transactionDate: new Date(),
    webhookData: webhookPayload,
  },
});

// Actualiza la orden
await prisma.order.update({
  where: { id: order.id },
  data: { status: 'PAID' },
});
```

---

## 🔐 Credenciales de Prueba

### Usuario Administrador
```
Email:    admin@demo.com
Password: Admin123!
Role:     ADMIN
```

### Usuario Cliente
```
Email:    customer@demo.com
Password: Customer123!
Role:     CUSTOMER
```

---

## 📝 Ejemplos de Consultas

### Productos más Vendidos (placeholder)
```typescript
const topProducts = await prisma.product.findMany({
  include: {
    variants: {
      include: {
        orderItems: true,
      },
    },
  },
  orderBy: {
    // Implementar lógica de ordenamiento
  },
  take: 10,
});
```

### Stock Bajo
```typescript
const lowStock = await prisma.variant.findMany({
  where: {
    stock: {
      lt: 5, // Menor que 5
    },
  },
  include: {
    product: {
      include: {
        brand: true,
      },
    },
  },
});
```

### Órdenes Pendientes
```typescript
const pendingOrders = await prisma.order.findMany({
  where: {
    status: {
      in: ['PENDING', 'PAID', 'PROCESSING'],
    },
  },
  include: {
    user: true,
    items: {
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    },
    payment: true,
  },
});
```

---

## ✨ Características Implementadas

### Cascade Deletes
- ✅ Al eliminar un usuario, se eliminan su carrito y órdenes
- ✅ Al eliminar una marca, se eliminan sus productos
- ✅ Al eliminar un producto, se eliminan sus variantes
- ✅ Al eliminar un carrito, se eliminan sus items

### Unique Constraints
- ✅ Email único por usuario
- ✅ SKU único por variante
- ✅ Una variante por carrito (no duplicados)
- ✅ Un carrito por usuario

### Default Values
- ✅ UserRole = CUSTOMER
- ✅ OrderStatus = PENDING
- ✅ PaymentStatus = PENDING
- ✅ isActive = true
- ✅ currency = "PEN"

---

## 🐛 Troubleshooting

### Error: "Column does not exist"
```bash
# Regenerar el cliente de Prisma
npx prisma generate
```

### Error: "Database is not in sync"
```bash
# Sincronizar schema
pnpm db:push
```

### Quiero empezar de cero
```bash
# Borrar y recrear todo
pnpm db:push --accept-data-loss
pnpm db:seed
```

---

## 📚 Documentación Adicional

- 📖 **Schema completo**: Ver `docs/DATABASE_SCHEMA.md`
- 🔐 **Variables de entorno**: Ver `docs/ENVIRONMENT_VARIABLES.md`
- 📘 **README**: Ver `README.md`

---

## 🎊 ¡Completado!

El esquema de base de datos está **100% funcional** y listo para ser usado en el desarrollo del e-commerce.

### Próximos Pasos Sugeridos:

1. ✅ **Abrir Prisma Studio** para explorar los datos
   ```bash
   pnpm db:studio
   ```

2. ✅ **Iniciar el backend** para probar las APIs
   ```bash
   cd apps/api && pnpm dev
   ```

3. 📝 **Implementar endpoints REST** (productos, carrito, órdenes)

4. 💳 **Integrar pasarelas de pago** (MercadoPago/Culqi)

5. 🎨 **Desarrollar el frontend** con Next.js

---

**¡Base de datos lista para producción!** 🚀

