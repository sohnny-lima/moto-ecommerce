# 📚 Ejemplos de Uso de la API

Esta guía proporciona ejemplos prácticos de cómo usar cada endpoint de la API.

## 🔗 Base URL

```
http://localhost:3001
```

---

## 📦 Products

### 1. Listar todos los productos

```bash
curl -X GET "http://localhost:3001/api/products"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx789ghi",
      "name": "Yamaha R15 V4",
      "slug": "yamaha-r15-v4",
      "description": "Deportiva de alto rendimiento",
      "price": 15800.00,
      "images": [
        "https://example.com/r15-1.jpg",
        "https://example.com/r15-2.jpg"
      ],
      "brand": {
        "id": "clx123abc",
        "name": "Yamaha"
      },
      "category": {
        "id": "clx456def",
        "name": "Deportiva"
      },
      "availableColors": ["Azul Racing", "Negro Mate", "Rojo"],
      "totalStock": 18,
      "inStock": true
    }
  ],
  "pagination": {
    "page": 1,
    "size": 12,
    "total": 12,
    "totalPages": 1
  }
}
```

### 2. Buscar productos por nombre

```bash
curl -X GET "http://localhost:3001/api/products?q=yamaha"
```

### 3. Filtrar por marca y categoría

```bash
curl -X GET "http://localhost:3001/api/products?brand=clx123abc&category=clx456def"
```

### 4. Filtrar por rango de precio

```bash
curl -X GET "http://localhost:3001/api/products?min=10000&max=20000"
```

### 5. Filtrar por color

```bash
curl -X GET "http://localhost:3001/api/products?color=Azul%20Racing"
```

### 6. Ordenar por precio (ascendente)

```bash
curl -X GET "http://localhost:3001/api/products?sortBy=price&sortOrder=asc"
```

### 7. Paginación

```bash
curl -X GET "http://localhost:3001/api/products?page=2&size=6"
```

### 8. Combinación de filtros

```bash
curl -X GET "http://localhost:3001/api/products?brand=clx123abc&min=10000&max=30000&sortBy=price&sortOrder=desc&page=1&size=12"
```

### 9. Obtener producto por slug

```bash
curl -X GET "http://localhost:3001/api/products/yamaha-r15-v4"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "clx789ghi",
      "name": "Yamaha R15 V4",
      "slug": "yamaha-r15-v4",
      "description": "Deportiva de alto rendimiento con motor de 155cc",
      "price": 15800.00,
      "images": [
        "https://example.com/r15-1.jpg",
        "https://example.com/r15-2.jpg"
      ],
      "brand": {
        "id": "clx123abc",
        "name": "Yamaha",
        "description": "Marca japonesa líder",
        "logoUrl": "https://example.com/yamaha-logo.png"
      },
      "category": {
        "id": "clx456def",
        "name": "Deportiva",
        "description": "Motos de alto rendimiento"
      },
      "variants": [
        {
          "id": "clxvar001",
          "color": "Azul Racing",
          "stock": 8,
          "sku": "R15V4-BLU-001"
        },
        {
          "id": "clxvar002",
          "color": "Negro Mate",
          "stock": 5,
          "sku": "R15V4-BLK-001"
        },
        {
          "id": "clxvar003",
          "color": "Rojo",
          "stock": 5,
          "sku": "R15V4-RED-001"
        }
      ],
      "availableColors": ["Azul Racing", "Negro Mate", "Rojo"],
      "totalStock": 18,
      "inStock": true
    },
    "related": [
      {
        "id": "clx789xyz",
        "name": "Yamaha MT-15",
        "slug": "yamaha-mt-15",
        "price": 14500.00,
        "images": ["https://example.com/mt15.jpg"]
      }
    ]
  }
}
```

### 10. Obtener producto por ID

```bash
curl -X GET "http://localhost:3001/api/products/id/clx789ghi"
```

---

## 🏷️ Brands

### Listar todas las marcas

```bash
curl -X GET "http://localhost:3001/api/products/filters/brands"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc",
      "name": "Yamaha",
      "description": "Marca japonesa líder en motocicletas",
      "logoUrl": "https://example.com/yamaha-logo.png"
    },
    {
      "id": "clx123def",
      "name": "Honda",
      "description": "Innovación y calidad japonesa",
      "logoUrl": "https://example.com/honda-logo.png"
    }
  ]
}
```

---

## 📂 Categories

### Listar todas las categorías

```bash
curl -X GET "http://localhost:3001/api/products/filters/categories"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx456abc",
      "name": "Scooter",
      "description": "Motos urbanas prácticas",
      "imageUrl": "https://example.com/scooter.jpg"
    },
    {
      "id": "clx456def",
      "name": "Deportiva",
      "description": "Motos de alto rendimiento",
      "imageUrl": "https://example.com/deportiva.jpg"
    }
  ]
}
```

---

## 🎨 Colors

### Listar todos los colores disponibles

```bash
curl -X GET "http://localhost:3001/api/products/filters/colors"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    "Azul Racing",
    "Negro Mate",
    "Rojo",
    "Blanco",
    "Gris Metálico",
    "Verde Lima"
  ]
}
```

---

## 🛒 Checkout

### 1. Crear orden y checkout

```bash
curl -X POST "http://localhost:3001/api/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "variantId": "clxvar001",
        "quantity": 1
      },
      {
        "variantId": "clxvar005",
        "quantity": 2
      }
    ],
    "customer": {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+51987654321"
    },
    "shippingAddress": {
      "street": "Av. Arequipa 1234",
      "city": "Lima",
      "state": "Lima",
      "zipCode": "15001"
    }
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "orderId": "clxord001",
    "init_point": "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=123456789-abc123"
  }
}
```

**Flujo:**
1. El cliente recibe el `init_point`
2. Redirige al usuario a esa URL
3. El usuario completa el pago en MercadoPago
4. MercadoPago envía un webhook a tu servidor
5. Tu servidor actualiza el estado de la orden

### 2. Obtener información de una orden

```bash
curl -X GET "http://localhost:3001/api/checkout/clxord001"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "clxord001",
    "userId": null,
    "status": "PAID",
    "subtotal": 15800.00,
    "shippingCost": 50.00,
    "tax": 2847.00,
    "total": 18697.00,
    "customerName": "Juan Pérez",
    "customerEmail": "juan@example.com",
    "customerPhone": "+51987654321",
    "shippingAddress": {
      "street": "Av. Arequipa 1234",
      "city": "Lima",
      "state": "Lima",
      "zipCode": "15001"
    },
    "items": [
      {
        "id": "clxitem001",
        "variantId": "clxvar001",
        "quantity": 1,
        "price": 15800.00,
        "variant": {
          "color": "Azul Racing",
          "sku": "R15V4-BLU-001",
          "product": {
            "name": "Yamaha R15 V4",
            "slug": "yamaha-r15-v4",
            "images": ["https://example.com/r15-1.jpg"]
          }
        }
      }
    ],
    "payment": {
      "id": "clxpay001",
      "provider": "MERCADOPAGO",
      "status": "COMPLETED",
      "amount": 18697.00,
      "transactionId": "123456789",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "createdAt": "2024-01-15T10:25:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🔔 Webhooks

### 1. Webhook de MercadoPago

**Endpoint:** `POST /api/webhooks/mercadopago`

**Payload de ejemplo:**
```json
{
  "action": "payment.updated",
  "api_version": "v1",
  "data": {
    "id": "123456789"
  },
  "date_created": "2024-01-15T10:30:00.000-04:00",
  "id": 12345,
  "live_mode": false,
  "type": "payment",
  "user_id": "987654321"
}
```

**Headers requeridos:**
```
x-signature: <firma_hmac>
x-request-id: <request_id>
```

**Proceso:**
1. MercadoPago envía el webhook cuando cambia el estado del pago
2. Tu servidor verifica la firma HMAC
3. Consulta el pago en la API de MercadoPago
4. Actualiza el estado de la orden y el pago en tu base de datos

### 2. Webhook de Culqi

**Endpoint:** `POST /api/webhooks/culqi`

**Payload de ejemplo:**
```json
{
  "event": "charge.succeeded",
  "data": {
    "object": {
      "id": "chr_test_abc123",
      "amount": 1869700,
      "currency_code": "PEN",
      "email": "juan@example.com",
      "outcome": {
        "type": "venta_exitosa"
      }
    }
  }
}
```

**Headers requeridos:**
```
x-culqi-signature: <firma_hmac>
```

---

## 📊 Statistics

### Obtener estadísticas del catálogo

```bash
curl -X GET "http://localhost:3001/api/products/stats"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 12,
    "totalBrands": 4,
    "totalCategories": 6,
    "totalVariants": 36,
    "totalStock": 180,
    "averagePrice": 12500.00,
    "minPrice": 3500.00,
    "maxPrice": 28000.00
  }
}
```

---

## ❤️ Health Check

```bash
curl -X GET "http://localhost:3001/health"
```

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🔐 Autenticación (Próximamente)

Los siguientes endpoints requerirán autenticación JWT:

```bash
# Login
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "admin123"
  }'

# Usar el token
curl -X GET "http://localhost:3001/api/admin/orders" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🧪 Testing con Postman

Puedes importar la colección de Postman desde Swagger:

1. Ve a http://localhost:3001/api/docs
2. Haz clic en "Export" → "OpenAPI JSON"
3. Importa el archivo en Postman

---

## 🐛 Manejo de Errores

Todos los errores siguen este formato:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

### Códigos de estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request (datos inválidos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error

---

## 💡 Tips

1. **Paginación**: Siempre usa `page` y `size` para grandes conjuntos de datos
2. **Filtros**: Combina múltiples filtros para búsquedas precisas
3. **Webhooks**: Usa ngrok en desarrollo para probar webhooks
4. **Rate Limiting**: En producción, implementa rate limiting
5. **Caché**: Considera cachear respuestas de productos y categorías

---

**¡Feliz desarrollo! 🚀**

