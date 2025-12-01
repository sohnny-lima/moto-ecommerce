# 🏍️ API de Productos - Moto E-commerce

## 📋 Resumen

API RESTful completa para gestionar productos de motocicletas con **filtros avanzados**, **paginación**, **ordenamiento** y **búsqueda por texto**.

---

## 🛣️ Endpoints Disponibles

### 1. **GET `/api/products`**

Obtiene productos con filtros, paginación y ordenamiento.

#### Query Parameters

| Parámetro  | Tipo   | Descripción                                    | Ejemplo         |
|------------|--------|------------------------------------------------|-----------------|
| `q`        | string | Búsqueda por nombre o descripción             | `yamaha`        |
| `brand`    | string | ID de marca para filtrar                      | `clx123abc`     |
| `category` | string | ID de categoría para filtrar                  | `clx456def`     |
| `color`    | string | Color de variante para filtrar                | `rojo`          |
| `min`      | number | Precio mínimo                                  | `5000`          |
| `max`      | number | Precio máximo                                  | `15000`         |
| `page`     | number | Número de página (default: 1)                 | `2`             |
| `size`     | number | Tamaño de página (default: 12)                | `20`            |
| `sortBy`   | string | Campo para ordenar: `price` o `createdAt`     | `price`         |
| `sortOrder`| string | Dirección: `asc` o `desc` (default: `desc`)   | `asc`           |

#### Ejemplo de Request

```bash
GET /api/products?q=yamaha&category=clx123&min=8000&max=20000&sortBy=price&sortOrder=asc&page=1&size=12
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "clx789ghi",
      "name": "Yamaha R15 V4",
      "description": "Moto deportiva con motor de 155cc...",
      "price": 15800.00,
      "brandId": "clx123abc",
      "categoryId": "clx456def",
      "images": [
        "https://images.unsplash.com/photo-1.jpg",
        "https://images.unsplash.com/photo-2.jpg"
      ],
      "isActive": true,
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z",
      "brand": {
        "id": "clx123abc",
        "name": "Yamaha",
        "logoUrl": "https://..."
      },
      "category": {
        "id": "clx456def",
        "name": "Deportiva",
        "imageUrl": "https://..."
      },
      "variants": [
        {
          "id": "clxvar001",
          "color": "Azul Racing",
          "stock": 10,
          "sku": "R15V4-BLU-001"
        },
        {
          "id": "clxvar002",
          "color": "Negro Mate",
          "stock": 8,
          "sku": "R15V4-BLK-001"
        }
      ],
      "availableColors": ["Azul Racing", "Negro Mate"],
      "totalStock": 18,
      "inStock": true
    }
  ],
  "pagination": {
    "page": 1,
    "size": 12,
    "total": 45,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. **GET `/api/products/:slug`**

Obtiene un producto específico por slug con productos relacionados.

#### Parámetros de Ruta

| Parámetro | Tipo   | Descripción              |
|-----------|--------|--------------------------|
| `slug`    | string | Nombre del producto (URL friendly) |

#### Ejemplo de Request

```bash
GET /api/products/yamaha-r15-v4
```

#### Response

```json
{
  "success": true,
  "data": {
    "product": {
      "id": "clx789ghi",
      "name": "Yamaha R15 V4",
      "description": "Moto deportiva con motor de 155cc, diseño agresivo y tecnología de pista. Perfecta para los amantes de la velocidad.",
      "price": 15800.00,
      "brandId": "clx123abc",
      "categoryId": "clx456def",
      "images": [
        "https://images.unsplash.com/photo-1.jpg",
        "https://images.unsplash.com/photo-2.jpg",
        "https://images.unsplash.com/photo-3.jpg"
      ],
      "isActive": true,
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z",
      "brand": {
        "id": "clx123abc",
        "name": "Yamaha",
        "description": "Motos de alto rendimiento...",
        "logoUrl": "https://..."
      },
      "category": {
        "id": "clx456def",
        "name": "Deportiva",
        "description": "Motos de alta velocidad...",
        "imageUrl": "https://..."
      },
      "variants": [
        {
          "id": "clxvar001",
          "productId": "clx789ghi",
          "color": "Azul Racing",
          "stock": 10,
          "sku": "R15V4-BLU-001",
          "createdAt": "2025-01-10T12:00:00.000Z",
          "updatedAt": "2025-01-10T12:00:00.000Z"
        },
        {
          "id": "clxvar002",
          "productId": "clx789ghi",
          "color": "Negro Mate",
          "stock": 8,
          "sku": "R15V4-BLK-001",
          "createdAt": "2025-01-10T12:00:00.000Z",
          "updatedAt": "2025-01-10T12:00:00.000Z"
        }
      ],
      "availableColors": ["Azul Racing", "Negro Mate"],
      "totalStock": 18,
      "inStock": true
    },
    "relatedProducts": [
      {
        "id": "clx012jkl",
        "name": "Yamaha MT-03",
        "price": 18900.00,
        "images": ["https://..."],
        "brand": { "name": "Yamaha" },
        "category": { "name": "Naked" },
        "availableColors": ["Azul Yamaha", "Negro Icon"],
        "totalStock": 24,
        "inStock": true
      },
      // ... hasta 6 productos relacionados
    ]
  }
}
```

**Productos Relacionados**: Se obtienen hasta 6 productos de la misma categoría o marca (excluyendo el producto actual).

---

### 3. **GET `/api/products/id/:id`**

Obtiene un producto por su ID.

#### Ejemplo de Request

```bash
GET /api/products/id/clx789ghi
```

#### Response

Similar al endpoint de slug, pero solo retorna el producto sin relacionados.

---

### 4. **GET `/api/products/filters/brands`**

Obtiene todas las marcas disponibles.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc",
      "name": "Honda",
      "description": "Líder mundial en motocicletas...",
      "logoUrl": "https://...",
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
    },
    {
      "id": "clx456def",
      "name": "Yamaha",
      "description": "Alto rendimiento y diseño japonés...",
      "logoUrl": "https://...",
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
    }
  ]
}
```

---

### 5. **GET `/api/products/filters/categories`**

Obtiene todas las categorías disponibles.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "clxcat001",
      "name": "Scooter",
      "description": "Motocicletas urbanas...",
      "imageUrl": "https://...",
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
    },
    {
      "id": "clxcat002",
      "name": "Deportiva",
      "description": "Motos de alta velocidad...",
      "imageUrl": "https://...",
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
    }
  ]
}
```

---

### 6. **GET `/api/products/filters/colors`**

Obtiene todos los colores disponibles (únicos).

#### Response

```json
{
  "success": true,
  "data": [
    "Amarillo Campeón",
    "Azul",
    "Azul Canyon",
    "Azul MotoGP",
    "Azul Racing",
    "Azul Yamaha",
    "Negro",
    "Negro Brillante",
    "Negro Icon",
    "Negro Mate",
    "Rojo",
    "Rojo HRC",
    "Rojo Racing",
    "Rojo Rally",
    "Rojo Vine"
  ]
}
```

---

### 7. **GET `/api/products/stats`**

Obtiene estadísticas generales de productos.

#### Response

```json
{
  "success": true,
  "data": {
    "totalProducts": 12,
    "totalBrands": 4,
    "totalCategories": 6,
    "totalVariants": 32,
    "priceRange": {
      "min": 7500.00,
      "max": 28500.00
    }
  }
}
```

---

## 🔍 Ejemplos de Uso

### Búsqueda Simple

```bash
# Buscar productos que contengan "yamaha"
GET /api/products?q=yamaha
```

### Filtro por Marca

```bash
# Productos de Honda
GET /api/products?brand=clx123abc
```

### Filtro por Categoría

```bash
# Motos deportivas
GET /api/products?category=clxcat002
```

### Filtro por Color

```bash
# Motos con variante roja
GET /api/products?color=rojo
```

### Filtro por Rango de Precio

```bash
# Motos entre S/10,000 y S/20,000
GET /api/products?min=10000&max=20000
```

### Combinación de Filtros

```bash
# Motos Yamaha, deportivas, rojas, entre S/10,000 y S/20,000, ordenadas por precio
GET /api/products?brand=clx456&category=clxcat002&color=rojo&min=10000&max=20000&sortBy=price&sortOrder=asc
```

### Paginación

```bash
# Segunda página con 20 productos por página
GET /api/products?page=2&size=20
```

### Ordenamiento

```bash
# Productos más recientes primero
GET /api/products?sortBy=createdAt&sortOrder=desc

# Productos más baratos primero
GET /api/products?sortBy=price&sortOrder=asc
```

---

## 📊 Campos Calculados

Cada producto incluye campos calculados adicionales:

- **`availableColors`**: Array de colores únicos disponibles
- **`totalStock`**: Suma del stock de todas las variantes
- **`inStock`**: `true` si hay al menos una variante con stock > 0

---

## ⚡ Performance

### Optimizaciones Implementadas

1. **Índices en Base de Datos**:
   - `Product.name`, `Product.price`, `Product.createdAt`
   - `Brand.name`, `Category.name`
   - `Variant.color`

2. **Consultas Eficientes**:
   - `findMany` + `count` en paralelo con `Promise.all`
   - `include` solo los campos necesarios
   - `select` para limitar datos de relaciones

3. **Paginación**:
   - Límite por defecto: 12 productos
   - Skip y Take para paginación eficiente

---

## 🎯 Casos de Uso Frontend

### Página de Listado

```typescript
// Obtener productos con filtros del usuario
const response = await fetch('/api/products?' + new URLSearchParams({
  category: selectedCategory,
  brand: selectedBrand,
  min: priceRange.min.toString(),
  max: priceRange.max.toString(),
  page: currentPage.toString(),
  size: '12',
  sortBy: 'price',
  sortOrder: 'asc'
}));

const { data: products, pagination } = await response.json();
```

### Página de Producto

```typescript
// Obtener producto por slug
const response = await fetch(`/api/products/${slug}`);
const { data } = await response.json();

const { product, relatedProducts } = data;
```

### Filtros de Búsqueda

```typescript
// Obtener opciones para filtros
const [brands, categories, colors] = await Promise.all([
  fetch('/api/products/filters/brands').then(r => r.json()),
  fetch('/api/products/filters/categories').then(r => r.json()),
  fetch('/api/products/filters/colors').then(r => r.json())
]);
```

---

## 🔒 Seguridad

- ✅ Validación de query params con Zod
- ✅ Solo productos activos (`isActive: true`)
- ✅ Sanitización de inputs
- ✅ Límites de paginación

---

## 📝 Notas Técnicas

### Slug vs ID

El endpoint `/api/products/:slug` busca por nombre del producto convertido a URL-friendly. Actualmente usa búsqueda por nombre con coincidencia parcial. Para producción, considera agregar un campo `slug` único en la base de datos.

### Productos Relacionados

Los productos relacionados se obtienen de la misma categoría o marca, excluyendo el producto actual, ordenados por fecha de creación (más recientes primero), limitados a 6 productos.

### Búsqueda por Texto

La búsqueda con el parámetro `q` busca en:
- Nombre del producto
- Descripción del producto

Es case-insensitive y usa `LIKE %query%` en PostgreSQL.

---

## 🧪 Testing

### Comandos cURL

```bash
# Listar productos
curl http://localhost:3001/api/products

# Buscar "yamaha"
curl http://localhost:3001/api/products?q=yamaha

# Filtrar por precio
curl "http://localhost:3001/api/products?min=10000&max=20000"

# Obtener producto por slug
curl http://localhost:3001/api/products/yamaha-r15-v4

# Obtener marcas
curl http://localhost:3001/api/products/filters/brands

# Obtener estadísticas
curl http://localhost:3001/api/products/stats
```

---

## ✅ Checklist de Implementación

✅ GET /api/products con filtros  
✅ Paginación (page, size)  
✅ Ordenamiento (sortBy, sortOrder)  
✅ Filtro por búsqueda de texto (q)  
✅ Filtro por marca (brand)  
✅ Filtro por categoría (category)  
✅ Filtro por color (color)  
✅ Filtro por rango de precio (min, max)  
✅ GET /api/products/:slug  
✅ Productos relacionados (misma categoría/marca, limit 6)  
✅ Endpoints de filtros (brands, categories, colors)  
✅ Endpoint de estadísticas  
✅ Validación con Zod  
✅ Manejo de errores  
✅ Documentación completa  

---

## 🚀 Estado: 100% Completado

El módulo de productos está **completamente implementado** y listo para integrarse con el frontend.

