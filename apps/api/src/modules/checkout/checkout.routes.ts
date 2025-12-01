import { Router, type Router as RouterType } from 'express';
import { CheckoutController } from './checkout.controller';

const router: RouterType = Router();
const checkoutController = new CheckoutController();

/**
 * @openapi
 * /api/checkout:
 *   post:
 *     tags:
 *       - Checkout
 *     summary: Crear orden y checkout de pago
 *     description: Crea una orden con los items del carrito y genera la preferencia de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - customer
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     variantId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               customer:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phone:
 *                     type: string
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *     responses:
 *       200:
 *         description: Checkout creado exitosamente
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
 *                     orderId:
 *                       type: string
 *                     init_point:
 *                       type: string
 *                       description: URL para redirigir al usuario al checkout
 *       400:
 *         description: Datos inválidos o stock insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res) => checkoutController.createCheckout(req, res));

/**
 * @openapi
 * /api/checkout/{orderId}:
 *   get:
 *     tags:
 *       - Checkout
 *     summary: Obtener información de una orden
 *     description: Retorna los detalles completos de una orden incluyendo items y estado de pago
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:orderId', (req, res) => checkoutController.getOrder(req, res));

export default router;

