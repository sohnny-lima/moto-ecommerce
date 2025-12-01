import { Router, type Router as RouterType } from 'express';
import { ProductsController } from './products.controller';

const router: RouterType = Router();
const productsController = new ProductsController();

/**
 * @openapi
 * /api/products/filters/brands:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Obtener todas las marcas
 *     description: Retorna la lista de todas las marcas disponibles
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 */
router.get('/filters/brands', (req, res) => productsController.getBrands(req, res));

/**
 * @openapi
 * /api/products/filters/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Obtener todas las categorías
 *     description: Retorna la lista de todas las categorías disponibles
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/filters/categories', (req, res) => productsController.getCategories(req, res));

/**
 * @openapi
 * /api/products/filters/colors:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener todos los colores disponibles
 *     description: Retorna la lista de colores únicos de todas las variantes
 *     responses:
 *       200:
 *         description: Lista de colores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/filters/colors', (req, res) => productsController.getColors(req, res));

/**
 * @openapi
 * /api/products/stats:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener estadísticas de productos
 *     description: Retorna estadísticas generales del catálogo
 *     responses:
 *       200:
 *         description: Estadísticas del catálogo
 */
router.get('/stats', (req, res) => productsController.getStats(req, res));

/**
 * @openapi
 * /api/products/id/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/id/:id', (req, res) => productsController.getProductById(req, res));

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Listar productos con filtros
 *     description: Obtiene productos con filtros, paginación y ordenamiento
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o descripción
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filtrar por ID de marca
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filtrar por color
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Productos por página
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, createdAt]
 *           default: createdAt
 *         description: Campo para ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', (req, res) => productsController.getProducts(req, res));

/**
 * @openapi
 * /api/products/{slug}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener producto por slug
 *     description: Retorna un producto con sus variantes y productos relacionados
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug del producto (ej. yamaha-r15-v4)
 *     responses:
 *       200:
 *         description: Producto encontrado con relacionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                     related:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:slug', (req, res) => productsController.getProductBySlug(req, res));

export default router;

