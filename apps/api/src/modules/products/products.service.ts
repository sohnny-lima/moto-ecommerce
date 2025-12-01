import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface ProductFilters {
  q?: string; // Búsqueda por nombre o descripción
  brand?: string; // ID de marca
  category?: string; // ID de categoría
  color?: string; // Color de variante
  min?: number; // Precio mínimo
  max?: number; // Precio máximo
  page?: number; // Página actual
  size?: number; // Tamaño de página
  sortBy?: 'price' | 'createdAt'; // Campo de ordenamiento
  sortOrder?: 'asc' | 'desc'; // Dirección de ordenamiento
}

export interface PaginatedProducts {
  products: any[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Servicio de Productos
 * Maneja la lógica de negocio para productos
 */
export class ProductsService {
  /**
   * Obtiene productos con filtros, paginación y ordenamiento
   */
  async getProducts(filters: ProductFilters): Promise<PaginatedProducts> {
    const {
      q,
      brand,
      category,
      color,
      min,
      max,
      page = 1,
      size = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Construir el where de Prisma
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Filtro de búsqueda por texto
    if (q) {
      where.OR = [
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Filtro por marca
    if (brand) {
      where.brandId = brand;
    }

    // Filtro por categoría
    if (category) {
      where.categoryId = category;
    }

    // Filtro por color (en variantes)
    if (color) {
      where.variants = {
        some: {
          color: {
            contains: color,
            mode: 'insensitive',
          },
        },
      };
    }

    // Filtro por rango de precio
    if (min !== undefined || max !== undefined) {
      where.price = {};
      if (min !== undefined) {
        where.price.gte = min;
      }
      if (max !== undefined) {
        where.price.lte = max;
      }
    }

    // Configurar ordenamiento
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    }

    // Calcular skip para paginación
    const skip = (page - 1) * size;

    // Ejecutar consulta con paginación
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          variants: {
            select: {
              id: true,
              color: true,
              stock: true,
              sku: true,
            },
          },
        },
        orderBy,
        skip,
        take: size,
      }),
      prisma.product.count({ where }),
    ]);

    // Calcular información de paginación
    const totalPages = Math.ceil(total / size);

    // Transformar productos para incluir información útil
    const transformedProducts = products.map((product) => ({
      ...product,
      slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      price: Number(product.price),
      availableColors: [...new Set(product.variants.map((v) => v.color))],
      totalStock: product.variants.reduce((sum, v) => sum + v.stock, 0),
      inStock: product.variants.some((v) => v.stock > 0),
    }));

    return {
      products: transformedProducts,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Obtiene un producto por su slug con variantes y productos relacionados
   */
  async getProductBySlug(slug: string): Promise<any> {
    // Obtener todos los productos activos y buscar por slug generado
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        brand: true,
        category: true,
        variants: {
          orderBy: {
            color: 'asc',
          },
        },
      },
    });

    // Buscar el producto cuyo slug generado coincida
    const product = products.find(p => {
      const generatedSlug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return generatedSlug === slug;
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Obtener productos relacionados (misma categoría o marca)
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: {
          not: product.id,
        },
        isActive: true,
        OR: [
          {
            categoryId: product.categoryId,
          },
          {
            brandId: product.brandId,
          },
        ],
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        variants: {
          select: {
            id: true,
            color: true,
            stock: true,
          },
        },
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transformar productos relacionados
    const transformedRelated = relatedProducts.map((p) => ({
      ...p,
      slug: p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      price: Number(p.price),
      availableColors: [...new Set(p.variants.map((v) => v.color))],
      totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0),
      inStock: p.variants.some((v) => v.stock > 0),
    }));

    // Transformar producto principal
    const transformedProduct = {
      ...product,
      slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      price: Number(product.price),
      availableColors: [...new Set(product.variants.map((v) => v.color))],
      totalStock: product.variants.reduce((sum, v) => sum + v.stock, 0),
      inStock: product.variants.some((v) => v.stock > 0),
    };

    return {
      product: transformedProduct,
      relatedProducts: transformedRelated,
    };
  }

  /**
   * Obtiene un producto por ID
   */
  async getProductById(id: string): Promise<any> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    return {
      ...product,
      slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      price: Number(product.price),
      availableColors: [...new Set(product.variants.map((v) => v.color))],
      totalStock: product.variants.reduce((sum, v) => sum + v.stock, 0),
      inStock: product.variants.some((v) => v.stock > 0),
    };
  }

  /**
   * Obtiene todas las marcas
   */
  async getBrands(): Promise<any[]> {
    return prisma.brand.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obtiene todas las categorías
   */
  async getCategories(): Promise<any[]> {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obtiene todos los colores disponibles (únicos)
   */
  async getAvailableColors(): Promise<string[]> {
    const variants = await prisma.variant.findMany({
      select: {
        color: true,
      },
      distinct: ['color'],
      orderBy: {
        color: 'asc',
      },
    });

    return variants.map((v) => v.color);
  }

  /**
   * Obtiene estadísticas de productos
   */
  async getProductStats(): Promise<any> {
    const [totalProducts, totalBrands, totalCategories, totalVariants] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.brand.count(),
      prisma.category.count(),
      prisma.variant.count(),
    ]);

    const priceRange = await prisma.product.aggregate({
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
      where: {
        isActive: true,
      },
    });

    return {
      totalProducts,
      totalBrands,
      totalCategories,
      totalVariants,
      priceRange: {
        min: Number(priceRange._min.price) || 0,
        max: Number(priceRange._max.price) || 0,
      },
    };
  }
}

