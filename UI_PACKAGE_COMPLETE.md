# ✅ Package UI Completado - @repo/ui

## 🎉 Resumen

Se ha creado el package `@repo/ui` con todos los componentes UI compartidos usando **React 19** y **Tailwind CSS**.

---

## 📦 Estructura del Package

```
packages/
├── ui/
│   ├── src/
│   │   ├── Button.tsx           ✅
│   │   ├── ProductCard.tsx      ✅
│   │   ├── PriceBadge.tsx       ✅
│   │   ├── FilterWidget.tsx     ✅
│   │   ├── Header.tsx           ✅
│   │   ├── Footer.tsx           ✅
│   │   ├── HeroSlider.tsx       ✅
│   │   └── index.ts             ✅ (exporta todo)
│   ├── package.json             ✅
│   └── tsconfig.json            ✅
│
└── config/
    ├── package.json             ✅
    ├── tsconfig.package.json    ✅
    └── eslint.base.cjs          ✅
```

---

## 🎨 Componentes Implementados

### 1. **Button** ✅

Botón reutilizable con múltiples variantes y tamaños.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `loading`: boolean (muestra spinner)

**Ejemplo:**
```tsx
import { Button } from '@repo/ui';

<Button variant="primary" size="md" loading={false}>
  Agregar al carrito
</Button>
```

---

### 2. **PriceBadge** ✅

Badge de precio con cálculo automático de descuento.

**Props:**
- `price`: number (precio actual)
- `originalPrice?`: number (precio original, opcional)
- `currency`: string (default: 'S/')
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `showDiscount`: boolean (muestra badge de descuento)

**Características:**
- ✅ Calcula descuento automáticamente
- ✅ Muestra precio original tachado
- ✅ Badge con porcentaje de descuento
- ✅ Formato de moneda localizado

**Ejemplo:**
```tsx
import { PriceBadge } from '@repo/ui';

<PriceBadge 
  price={15800} 
  originalPrice={18000} 
  size="lg" 
  showDiscount={true}
/>
// Muestra: S/ 15,800.00  S/ 18,000.00  -12%
```

---

### 3. **ProductCard** ✅

Tarjeta de producto completa con imagen, precio, colores y acciones.

**Props:**
- `id`, `name`, `brand`, `price`, `originalPrice?`
- `image`: string (imagen principal)
- `images?`: string[] (galería)
- `colors?`: string[] (colores disponibles)
- `inStock?`: boolean
- `rating?`: number (1-5)
- `reviewCount?`: number
- `onAddToCart?`: () => void
- `onViewDetails?`: () => void
- `href?`: string (link del producto)

**Características:**
- ✅ Hover effects (escala imagen, muestra botones)
- ✅ Badge de descuento automático
- ✅ Badge de "Agotado" si no hay stock
- ✅ Rating con estrellas
- ✅ Colores disponibles (chips)
- ✅ PriceBadge integrado
- ✅ Responsive

**Ejemplo:**
```tsx
import { ProductCard } from '@repo/ui';

<ProductCard
  id="1"
  name="Yamaha R15 V4"
  brand="Yamaha"
  price={15800}
  originalPrice={18000}
  image="https://..."
  colors={['Azul Racing', 'Negro Mate']}
  inStock={true}
  rating={4.5}
  reviewCount={120}
  onAddToCart={() => console.log('Agregar')}
  onViewDetails={() => console.log('Ver')}
/>
```

---

### 4. **FilterWidget** ✅

Widget de filtros con múltiples tipos (checkbox, radio, range, color).

**Props:**
- `sections`: FilterSection[] (secciones de filtros)
- `onFilterChange?`: (filters) => void
- `onReset?`: () => void

**Tipos de Filtros:**
- ✅ **Checkbox**: Múltiple selección
- ✅ **Radio**: Selección única
- ✅ **Range**: Slider de rango (precio)
- ✅ **Color**: Chips de colores

**Características:**
- ✅ Secciones colapsables
- ✅ Contador de items por opción
- ✅ Botón de limpiar filtros
- ✅ Botón de aplicar
- ✅ Estado interno manejado

**Ejemplo:**
```tsx
import { FilterWidget } from '@repo/ui';

const sections = [
  {
    title: 'Marca',
    type: 'checkbox',
    options: [
      { id: '1', label: 'Honda', count: 12 },
      { id: '2', label: 'Yamaha', count: 8 },
    ]
  },
  {
    title: 'Precio',
    type: 'range',
    min: 5000,
    max: 30000,
  }
];

<FilterWidget 
  sections={sections}
  onFilterChange={(filters) => console.log(filters)}
  onReset={() => console.log('Reset')}
/>
```

---

### 5. **Header** ✅

Header sticky con navegación, búsqueda, carrito y login.

**Props:**
- `logo?`: string | ReactNode
- `cartItemCount?`: number (badge del carrito)
- `onCartClick?`: () => void
- `onSearchClick?`: () => void
- `onLoginClick?`: () => void

**Características:**
- ✅ Sticky header
- ✅ Logo personalizable
- ✅ Navegación responsive
- ✅ Badge de carrito con contador
- ✅ Iconos de búsqueda y carrito
- ✅ Botón de login
- ✅ Menú móvil (hamburger)

**Ejemplo:**
```tsx
import { Header } from '@repo/ui';

<Header
  logo="🏍️ MotoShop"
  cartItemCount={3}
  onCartClick={() => router.push('/carrito')}
  onSearchClick={() => setShowSearch(true)}
  onLoginClick={() => router.push('/auth/login')}
/>
```

---

### 6. **Footer** ✅

Footer completo con enlaces, redes sociales y copyright.

**Props:**
- `logo?`: string | ReactNode

**Características:**
- ✅ Grid responsive (4 columnas)
- ✅ Logo y descripción
- ✅ Redes sociales (Facebook, Twitter, Instagram)
- ✅ Enlaces rápidos
- ✅ Información legal
- ✅ Copyright dinámico (año actual)

**Ejemplo:**
```tsx
import { Footer } from '@repo/ui';

<Footer logo="🏍️ MotoShop" />
```

---

### 7. **HeroSlider** ✅

Slider de hero con autoplay, navegación y transiciones suaves.

**Props:**
- `slides`: HeroSlide[] (array de slides)
- `autoplay?`: boolean (default: true)
- `interval?`: number (ms, default: 5000)

**HeroSlide:**
- `id`, `title`, `subtitle?`, `description?`
- `image`: string (background)
- `ctaText?`: string (texto del botón)
- `ctaLink?`: string
- `onCtaClick?`: () => void

**Características:**
- ✅ Autoplay configurable
- ✅ Navegación con flechas
- ✅ Indicadores (dots)
- ✅ Transiciones suaves (fade)
- ✅ Overlay oscuro sobre imagen
- ✅ Contenido centrado
- ✅ CTA button integrado
- ✅ Responsive

**Ejemplo:**
```tsx
import { HeroSlider } from '@repo/ui';

const slides = [
  {
    id: '1',
    title: 'Nuevas Yamaha 2025',
    subtitle: 'Lanzamiento',
    description: 'Descubre la nueva línea de motos deportivas',
    image: 'https://...',
    ctaText: 'Ver catálogo',
    onCtaClick: () => router.push('/catalogo')
  },
  // ... más slides
];

<HeroSlider slides={slides} autoplay={true} interval={5000} />
```

---

## 📋 Configuración

### tsconfig.base.json ✅

Configuración base de TypeScript para todo el monorepo.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### packages/config/tsconfig.package.json ✅

Configuración extendida para packages.

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  }
}
```

### packages/config/eslint.base.cjs ✅

Reglas compartidas de ESLint.

**Incluye:**
- ✅ TypeScript rules
- ✅ React rules
- ✅ React Hooks rules
- ✅ Configuración optimizada

---

## 🎨 Estilos Tailwind

Todos los componentes usan **Tailwind CSS** puro:

- ✅ Utility-first approach
- ✅ Responsive design
- ✅ Hover states
- ✅ Transitions y animaciones
- ✅ Dark mode ready (algunos componentes)

**Clases comunes:**
- `transition-all duration-300`
- `hover:scale-110`
- `rounded-lg shadow-md`
- `bg-blue-600 hover:bg-blue-700`

---

## 📦 Cómo Usar en apps/web

### 1. Instalar el package

```bash
cd apps/web
pnpm add @repo/ui
```

### 2. Importar componentes

```tsx
import { 
  Button, 
  ProductCard, 
  PriceBadge,
  FilterWidget,
  Header,
  Footer,
  HeroSlider
} from '@repo/ui';
```

### 3. Usar en páginas

```tsx
// app/page.tsx
import { HeroSlider, ProductCard } from '@repo/ui';

export default function Home() {
  return (
    <>
      <HeroSlider slides={slides} />
      <div className="grid grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
}
```

---

## ✨ Características Destacadas

### Button
- ✅ 5 variantes (primary, secondary, outline, ghost, danger)
- ✅ 3 tamaños (sm, md, lg)
- ✅ Loading state con spinner
- ✅ Full width option

### PriceBadge
- ✅ **Cálculo automático de descuento**
- ✅ Precio original tachado
- ✅ Badge de porcentaje
- ✅ 4 tamaños

### ProductCard
- ✅ Hover effects profesionales
- ✅ Rating con estrellas
- ✅ Colores disponibles
- ✅ Botones en overlay
- ✅ Badge de stock

### FilterWidget
- ✅ 4 tipos de filtros
- ✅ Secciones colapsables
- ✅ Estado interno
- ✅ Contador de items

### Header
- ✅ Sticky positioning
- ✅ Badge de carrito animado
- ✅ Responsive menu
- ✅ Iconos SVG

### Footer
- ✅ Grid responsive
- ✅ Redes sociales
- ✅ Enlaces organizados
- ✅ Copyright dinámico

### HeroSlider
- ✅ Autoplay
- ✅ Navegación completa
- ✅ Transiciones suaves
- ✅ Overlay profesional

---

## 🚀 Estado Final

| Componente    | Estado | Características |
|---------------|--------|-----------------|
| Button        | ✅     | 5 variantes, loading state |
| PriceBadge    | ✅     | Cálculo de descuento |
| ProductCard   | ✅     | Completo con hover effects |
| FilterWidget  | ✅     | 4 tipos de filtros |
| Header        | ✅     | Sticky, responsive |
| Footer        | ✅     | Completo con redes sociales |
| HeroSlider    | ✅     | Autoplay, navegación |
| index.ts      | ✅     | Exports centralizados |
| Config        | ✅     | tsconfig + eslint |

---

## 📝 Próximos Pasos

1. **Instalar en apps/web**:
   ```bash
   cd apps/web
   pnpm add @repo/ui
   ```

2. **Configurar Tailwind** en apps/web para usar los componentes

3. **Importar y usar** en las páginas

4. **Personalizar** según necesidades del proyecto

---

## 💯 Resumen

✅ **7 componentes UI** completamente funcionales  
✅ **Tailwind CSS** puro  
✅ **TypeScript** con tipado completo  
✅ **React 19** compatible  
✅ **Exports centralizados** en index.ts  
✅ **Configuración compartida** (tsconfig + eslint)  
✅ **Responsive design**  
✅ **Hover effects** y transiciones  
✅ **Listo para producción**  

**Package @repo/ui 100% Completado** 🎉

