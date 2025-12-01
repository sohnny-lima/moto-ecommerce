import { Request, Response } from 'express';
import { CheckoutService } from './checkout.service';
import { z } from 'zod';

const checkoutService = new CheckoutService();

/**
 * Schema de validación para crear checkout
 */
const createCheckoutSchema = z.object({
  userId: z.string().min(1, 'userId es requerido'),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1, 'variantId es requerido'),
        quantity: z.number().int().positive('quantity debe ser mayor a 0'),
      })
    )
    .min(1, 'Debe incluir al menos un item'),
  shippingCost: z.number().nonnegative('shippingCost debe ser mayor o igual a 0'),
  backUrls: z
    .object({
      success: z.string().url('success debe ser una URL válida'),
      failure: z.string().url('failure debe ser una URL válida'),
      pending: z.string().url('pending debe ser una URL válida'),
    })
    .optional(),
});

/**
 * Controlador de Checkout
 */
export class CheckoutController {
  /**
   * POST /api/checkout
   * Crea una orden y retorna la URL de pago
   */
  async createCheckout(req: Request, res: Response): Promise<void> {
    try {
      // Validar datos de entrada
      const validatedData = createCheckoutSchema.parse(req.body);

      // Crear checkout
      const result = await checkoutService.createCheckout(validatedData);

      res.status(201).json({
        success: true,
        message: 'Checkout creado exitosamente',
        data: {
          orderId: result.order.id,
          paymentId: result.payment.id,
          checkoutUrl: result.checkoutUrl,
          total: result.order.total,
          status: result.order.status,
        },
      });
    } catch (error: any) {
      console.error('Error en createCheckout:', error);

      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Error al crear checkout',
      });
    }
  }

  /**
   * GET /api/checkout/:orderId
   * Obtiene información de una orden
   */
  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const userId = req.query.userId as string | undefined;

      const order = await checkoutService.getOrder(orderId, userId);

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      console.error('Error en getOrder:', error);

      res.status(404).json({
        success: false,
        message: error.message || 'Orden no encontrada',
      });
    }
  }

  /**
   * POST /api/webhooks/mercadopago
   * Procesa webhooks de MercadoPago
   */
  async handleMercadoPagoWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-signature'] as string;
      const body = req.body;
      const headers = req.headers as Record<string, string>;

      await checkoutService.processWebhook('MERCADOPAGO', signature, body, headers);

      res.status(200).json({
        success: true,
        message: 'Webhook procesado',
      });
    } catch (error: any) {
      console.error('Error en handleMercadoPagoWebhook:', error);

      // Siempre retornar 200 para evitar reintentos del webhook
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/webhooks/culqi
   * Procesa webhooks de Culqi
   */
  async handleCulqiWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-culqi-signature'] as string;
      const body = req.body;
      const headers = req.headers as Record<string, string>;

      await checkoutService.processWebhook('CULQI', signature, body, headers);

      res.status(200).json({
        success: true,
        message: 'Webhook procesado',
      });
    } catch (error: any) {
      console.error('Error en handleCulqiWebhook:', error);

      // Siempre retornar 200 para evitar reintentos del webhook
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  }
}

