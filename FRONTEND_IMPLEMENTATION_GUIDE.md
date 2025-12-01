# 🎨 Guía de Implementación del Frontend - Moto E-commerce

## 📋 Resumen

Esta guía proporciona la estructura completa y el código base para implementar el frontend del e-commerce en Next.js 16 con React 19.

---

## ✅ Lo que ya está Configurado

### 1. **Variables de Entorno** ✅

```env
# apps/web/.env.local
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

### 2. **Dependencias Instaladas** ✅

```json
{
  "dependencies": {
    "zustand": "^5.0.8",    // State management para carrito
    "axios": "^1.13.2"       // HTTP client
  }
}
```

### 3. **API Client** ✅

**Archivo**: `apps/web/src/lib/api.ts`

```typescript
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
export const api = axios.create({ baseURL: API_BASE });

export const productsApi = {
  getAll: async (params) => { /* ... */ },
  getBySlug: async (slug) => { /* ... */ },
  getBrands: async () => { /* ... */ },
  getCategories: async () => { /* ... */ },
};

export const checkoutApi = {
  create: async (data) => { /* ... */ },
  getOrder: async (id) => { /* ... */ },
};
```

### 4. **Store de Carrito (Zustand)** ✅

**Archivo**: `apps/web/src/store/cartStore.ts`

```typescript
export const useCartStore = create(persist(
  (set, get) => ({
    items: [],
    addItem: (item) => { /* ... */ },
    removeItem: (variantId) => { /* ... */ },
    updateQuantity: (variantId, quantity) => { /* ... */ },
    clearCart: () => { /* ... */ },
    getTotal: () => { /* ... */ },
    getItemCount: () => { /* ... */ },
  }),
  { name: 'cart-storage' }
));
```

---

## 📁 Estructura de Archivos Propuesta

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Layout principal
│   │   ├── page.tsx                      # Home
│   │   ├── catalogo/
│   │   │   └── page.tsx                  # Catálogo con filtros
│   │   ├── producto/
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Detalle de producto
│   │   ├── carrito/
│   │   │   └── page.tsx                  # Carrito de compras
│   │   ├── checkout/
│   │   │   └── page.tsx                  # Checkout
│   │   ├── blog/
│   │   │   └── page.tsx                  # Blog
│   │   ├── servicio/
│   │   │   └── page.tsx                  # Servicio técnico
│   │   ├── contacto/
│   │   │   └── page.tsx                  # Contacto
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx              # Login
│   │       └── register/
│   │           └── page.tsx              # Registro
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx                # Header con nav y carrito
│   │   │   └── Footer.tsx                # Footer
│   │   ├── home/
│   │   │   ├── HeroSlider.tsx            # Hero slider
│   │   │   ├── QuickFilters.tsx          # Filtros rápidos
│   │   │   ├── FeaturedProducts.tsx      # Productos destacados
│   │   │   ├── Categories.tsx            # Grid de categorías
│   │   │   └── Testimonials.tsx          # Testimonios
│   │   ├── products/
│   │   │   ├── ProductCard.tsx           # Tarjeta de producto
│   │   │   ├── ProductGrid.tsx           # Grid de productos
│   │   │   ├── FilterWidget.tsx          # Widget de filtros
│   │   │   └── PriceBadge.tsx            # Badge de precio
│   │   ├── cart/
│   │   │   ├── CartItem.tsx              # Item del carrito
│   │   │   └── CartSummary.tsx           # Resumen del carrito
│   │   └── common/
│   │       ├── Button.tsx                # Botón reutilizable
│   │       ├── Input.tsx                 # Input reutilizable
│   │       └── Loading.tsx               # Loading spinner
│   ├── lib/
│   │   ├── api.ts                        # ✅ API client
│   │   └── utils.ts                      # Utilidades
│   └── store/
│       └── cartStore.ts                  # ✅ Zustand store
├── public/
│   └── images/                           # Imágenes estáticas
└── .env.local                            # ✅ Variables de entorno
```

---

## 🎨 Componentes UI Principales

### 1. **Header.tsx**

```typescript
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            🏍️ MotoShop
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/catalogo" className="hover:text-blue-600">Catálogo</Link>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <Link href="/servicio" className="hover:text-blue-600">Servicio</Link>
            <Link href="/contacto" className="hover:text-blue-600">Contacto</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            
            <Link href="/carrito" className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link href="/auth/login" className="btn-primary">
              Ingresar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### 2. **ProductCard.tsx**

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api';
import PriceBadge from './PriceBadge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link href={`/producto/${slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
        {/* Image */}
        <div className="relative h-64 bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Agotado</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-500">{product.brand.name}</p>
          <h3 className="font-semibold text-lg mt-1 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Colors */}
          <div className="flex gap-1 mt-2">
            {product.availableColors.slice(0, 3).map((color) => (
              <span key={color} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {color}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center justify-between">
            <PriceBadge price={product.price} />
            <button className="btn-primary btn-sm">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### 3. **PriceBadge.tsx**

```typescript
interface PriceBadgeProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceBadge({ price, size = 'md' }: PriceBadgeProps) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-gray-500">S/</span>
      <span className={`font-bold text-gray-900 ${sizes[size]}`}>
        {price.toFixed(2)}
      </span>
    </div>
  );
}
```

### 4. **FilterWidget.tsx**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/api';

interface FilterWidgetProps {
  onFilterChange: (filters: any) => void;
}

export default function FilterWidget({ onFilterChange }: FilterWidgetProps) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });

  useEffect(() => {
    Promise.all([
      productsApi.getBrands(),
      productsApi.getCategories(),
      productsApi.getStats()
    ]).then(([brandsData, categoriesData, stats]) => {
      setBrands(brandsData);
      setCategories(categoriesData);
      setPriceRange({ min: stats.priceRange.min, max: stats.priceRange.max });
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h3 className="font-bold text-lg">Filtros</h3>

      {/* Marcas */}
      <div>
        <h4 className="font-semibold mb-2">Marca</h4>
        {brands.map((brand: any) => (
          <label key={brand.id} className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="rounded" />
            <span>{brand.name}</span>
          </label>
        ))}
      </div>

      {/* Categorías */}
      <div>
        <h4 className="font-semibold mb-2">Categoría</h4>
        {categories.map((category: any) => (
          <label key={category.id} className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="rounded" />
            <span>{category.name}</span>
          </label>
        ))}
      </div>

      {/* Precio */}
      <div>
        <h4 className="font-semibold mb-2">Precio</h4>
        <div className="space-y-2">
          <input type="range" min={priceRange.min} max={priceRange.max} className="w-full" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>S/ {priceRange.min}</span>
            <span>S/ {priceRange.max}</span>
          </div>
        </div>
      </div>

      <button className="btn-primary w-full">Aplicar filtros</button>
    </div>
  );
}
```

---

## 📄 Páginas Principales

### 1. **Home Page** (`app/page.tsx`)

```typescript
import HeroSlider from '@/components/home/HeroSlider';
import QuickFilters from '@/components/home/QuickFilters';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import Testimonials from '@/components/home/Testimonials';

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <QuickFilters />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
    </main>
  );
}
```

### 2. **Catálogo** (`app/catalogo/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import FilterWidget from '@/components/products/FilterWidget';

export default function CatalogoPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    productsApi.getAll(filters).then((data) => {
      setProducts(data.data);
      setLoading(false);
    });
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtros */}
        <aside className="lg:col-span-1">
          <FilterWidget onFilterChange={setFilters} />
        </aside>

        {/* Productos */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. **Producto** (`app/producto/[slug]/page.tsx`)

```typescript
import { productsApi } from '@/lib/api';
import ProductGallery from '@/components/products/ProductGallery';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductCard from '@/components/products/ProductCard';

export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const { product, relatedProducts } = await productsApi.getBySlug(params.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Detalle del producto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductGallery images={product.images} />
        
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.brand.name}</p>
          
          <div className="mt-6">
            <PriceBadge price={product.price} size="lg" />
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Colores disponibles:</h3>
            <div className="flex gap-2">
              {product.variants.map((variant) => (
                <button key={variant.id} className="btn-outline">
                  {variant.color}
                </button>
              ))}
            </div>
          </div>

          <AddToCartButton product={product} />

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 4. **Carrito** (`app/carrito/page.tsx`)

```typescript
'use client';

import { useCartStore } from '@/store/cartStore';
import CartItem from '@/components/cart/CartItem';
import Link from 'next/link';

export default function CarritoPage() {
  const { items, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <Link href="/catalogo" className="btn-primary">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.variantId} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>S/ {getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>S/ 50.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>S/ {(getTotal() + 50).toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary w-full block text-center">
            Proceder al pago
          </Link>

          <button onClick={clearCart} className="btn-outline w-full mt-2">
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 5. **Checkout** (`app/checkout/page.tsx`)

```typescript
'use client';

import { useState } from 'use';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { checkoutApi } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const checkoutData = {
        userId: 'temp-user-id', // TODO: Get from auth
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        shippingCost: 50.00,
        backUrls: {
          success: `${window.location.origin}/checkout/success`,
          failure: `${window.location.origin}/checkout/failure`,
          pending: `${window.location.origin}/checkout/pending`,
        }
      };

      const response = await checkoutApi.create(checkoutData);
      
      // Redirigir a MercadoPago/Culqi
      window.location.href = response.data.checkoutUrl;
      
      clearCart();
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Resumen de orden */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Resumen de tu orden</h2>
        {items.map((item) => (
          <div key={item.variantId} className="flex justify-between py-2">
            <span>{item.productName} ({item.color}) x{item.quantity}</span>
            <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>S/ {(getTotal() + 50).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Procesando...' : 'Ir a pagar'}
      </button>
    </div>
  );
}
```

---

## 🎨 Estilos Tailwind

Agregar a `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium;
  }

  .btn-outline {
    @apply border-2 border-gray-300 px-6 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors;
  }

  .btn-sm {
    @apply px-4 py-1 text-sm;
  }
}
```

---

## 🚀 Comandos para Desarrollo

```bash
# Instalar dependencias
cd apps/web && pnpm install

# Desarrollo
pnpm dev

# Build
pnpm build

# Start producción
pnpm start
```

---

## ✅ Estado Actual

- ✅ API client configurado
- ✅ Store de carrito (Zustand) con persistencia
- ✅ Variables de entorno
- ✅ Estructura de archivos definida
- ✅ Componentes base implementados
- ✅ Páginas principales definidas

---

## 📝 Notas Importantes

1. **Auth**: Implementar autenticación real con JWT
2. **SSR/SSG**: Usar `generateStaticParams` para productos
3. **Imágenes**: Optimizar con Next.js Image
4. **SEO**: Agregar metadata a cada página
5. **Loading States**: Implementar Suspense boundaries
6. **Error Handling**: Agregar error boundaries

---

**Frontend está 80% estructurado. Faltan detalles de UI y páginas secundarias (blog, servicio, contacto, auth).**

