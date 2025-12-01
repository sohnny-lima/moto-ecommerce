import { Router, type Router as RouterType } from 'express';
import { CheckoutController } from '../checkout/checkout.controller';

const router: RouterType = Router();
const checkoutController = new CheckoutController();

/**
 * @openapi
 * /api/webhooks/mercadopago:
 *   post:
 *     tags:
 *       - Webhooks
 *     summary: Webhook de MercadoPago
 *     description: Recibe notificaciones de cambios de estado de pago desde MercadoPago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 example: payment.updated
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del pago en MercadoPago
 *     responses:
 *       200:
 *         description: Webhook procesado correctamente
 *       400:
 *         description: Webhook inválido o firma incorrecta
 */
router.post('/mercadopago', (req, res) => checkoutController.handleMercadoPagoWebhook(req, res));

/**
 * @openapi
 * /api/webhooks/culqi:
 *   post:
 *     tags:
 *       - Webhooks
 *     summary: Webhook de Culqi
 *     description: Recibe notificaciones de cambios de estado de pago desde Culqi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 example: charge.succeeded
 *               data:
 *                 type: object
 *                 properties:
 *                   object:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID del cargo en Culqi
 *     responses:
 *       200:
 *         description: Webhook procesado correctamente
 *       400:
 *         description: Webhook inválido o firma incorrecta
 */
router.post('/culqi', (req, res) => checkoutController.handleCulqiWebhook(req, res));

export default router;

