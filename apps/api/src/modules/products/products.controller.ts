import { Request, Response } from 'express';
import { ProductsService } from './products.service';
import { z } from 'zod';

const productsService = new ProductsService();

/**
 * Schema de validación para filtros de productos
 */
const getProductsSchema = z.object({
  q: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  min: z.string().transform(Number).optional(),
  max: z.string().transform(Number).optional(),
  page: z.string().transform(Number).optional(),
  size: z.string().transform(Number).optional(),
  sortBy: z.enum(['price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

/**
 * Controlador de Productos
 */
export class ProductsController {
  /**
   * GET /api/products
   * Obtiene productos con filtros, paginación y ordenamiento
   */
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      // Validar query params
      const filters = getProductsSchema.parse(req.query);

      // Obtener productos
      const result = await productsService.getProducts(filters);

      res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Error en getProducts:', error);

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Parámetros de consulta inválidos',
          errors: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener productos',
      });
    }
  }

  /**
   * GET /api/products/:slug
   * Obtiene un producto por slug con productos relacionados
   */
  async getProductBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const result = await productsService.getProductBySlug(slug);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error en getProductBySlug:', error);

      if (error.message === 'Producto no encontrado') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener producto',
      });
    }
  }

  /**
   * GET /api/products/id/:id
   * Obtiene un producto por ID
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await productsService.getProductById(id);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      console.error('Error en getProductById:', error);

      if (error.message === 'Producto no encontrado') {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener producto',
      });
    }
  }

  /**
   * GET /api/products/filters/brands
   * Obtiene todas las marcas disponibles
   */
  async getBrands(_req: Request, res: Response): Promise<void> {
    try {
      const brands = await productsService.getBrands();

      res.status(200).json({
        success: true,
        data: brands,
      });
    } catch (error: any) {
      console.error('Error en getBrands:', error);

      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener marcas',
      });
    }
  }

  /**
   * GET /api/products/filters/categories
   * Obtiene todas las categorías disponibles
   */
  async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await productsService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      console.error('Error en getCategories:', error);

      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener categorías',
      });
    }
  }

  /**
   * GET /api/products/filters/colors
   * Obtiene todos los colores disponibles
   */
  async getColors(_req: Request, res: Response): Promise<void> {
    try {
      const colors = await productsService.getAvailableColors();

      res.status(200).json({
        success: true,
        data: colors,
      });
    } catch (error: any) {
      console.error('Error en getColors:', error);

      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener colores',
      });
    }
  }

  /**
   * GET /api/products/stats
   * Obtiene estadísticas de productos
   */
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await productsService.getProductStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Error en getStats:', error);

      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener estadísticas',
      });
    }
  }
}

