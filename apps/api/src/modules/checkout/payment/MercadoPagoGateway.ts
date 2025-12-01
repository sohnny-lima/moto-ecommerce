import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import { env } from '../../../config/env';
import {
  PaymentGateway,
  PaymentPreferenceData,
  PaymentPreferenceResult,
  WebhookVerificationResult,
} from './PaymentGateway';

/**
 * Implementación de PaymentGateway para MercadoPago
 * Utiliza Checkout Pro para crear preferencias de pago
 */
export class MercadoPagoGateway implements PaymentGateway {
  private client: AxiosInstance;
  private webhookSecret: string;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.mercadopago.com',
      headers: {
        Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    this.webhookSecret = env.MERCADOPAGO_WEBHOOK_SECRET || '';
  }

  /**
   * Crea una preferencia de pago usando Checkout Pro
   */
  async createPreference(data: PaymentPreferenceData): Promise<PaymentPreferenceResult> {
    try {
      // Validar que STORE_BASE_URL esté configurado
      if (!env.STORE_BASE_URL) {
        throw new Error(
          'STORE_BASE_URL no está configurado en las variables de entorno. ' +
          'Esta variable es requerida para MercadoPago. ' +
          'Ejemplo: STORE_BASE_URL=http://192.168.1.37:3000'
        );
      }

      // Construir back_urls desde el servidor usando STORE_BASE_URL
      const backUrls = {
        success: `${env.STORE_BASE_URL}/checkout/success`,
        failure: `${env.STORE_BASE_URL}/checkout/failure`,
        pending: `${env.STORE_BASE_URL}/checkout/pending`,
      };

      const preference = {
        items: data.items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: data.currency,
        })),
        payer: {
          name: data.payer.firstName,
          surname: data.payer.lastName,
          email: data.payer.email,
          phone: data.payer.phone
            ? {
              number: data.payer.phone,
            }
            : undefined,
        },
        back_urls: backUrls,
        auto_return: 'approved',
        external_reference: data.orderId,
        statement_descriptor: 'MOTO ECOMMERCE',
        notification_url: `${env.NEXT_PUBLIC_API_BASE}/api/webhooks/mercadopago`,
      };

      const response = await this.client.post('/checkout/preferences', preference);

      return {
        preferenceId: response.data.id,
        initPoint: response.data.init_point, // URL para redirigir al usuario
        externalId: response.data.id,
      };
    } catch (error: any) {
      console.error('Error creando preferencia de MercadoPago:', error.response?.data || error.message);
      throw new Error(`MercadoPago error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Verifica la autenticidad de un webhook de MercadoPago
   */
  async verifyWebhook(
    signature: string,
    body: any,
    headers: Record<string, string>
  ): Promise<WebhookVerificationResult> {
    try {
      // MercadoPago envía la firma en el header 'x-signature'
      const xSignature = headers['x-signature'] || signature;
      const xRequestId = headers['x-request-id'] || '';

      if (!xSignature) {
        return {
          isValid: false,
          errorMessage: 'Firma de webhook no encontrada',
        };
      }

      // Verificar firma HMAC
      const parts = xSignature.split(',');
      let ts = '';
      let hash = '';

      parts.forEach((part) => {
        const [key, value] = part.split('=');
        if (key.trim() === 'ts') ts = value;
        if (key.trim() === 'v1') hash = value;
      });

      // Construir el string a verificar
      const dataToVerify = `id:${body.data?.id};request-id:${xRequestId};ts:${ts};`;

      // Calcular HMAC
      const expectedHash = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(dataToVerify)
        .digest('hex');

      const isValid = hash === expectedHash;

      if (!isValid) {
        return {
          isValid: false,
          errorMessage: 'Firma de webhook inválida',
        };
      }

      // Obtener información del pago
      if (body.type === 'payment') {
        const paymentId = body.data?.id;

        if (!paymentId) {
          return {
            isValid: true,
            errorMessage: 'ID de pago no encontrado en webhook',
          };
        }

        // Consultar información del pago
        const paymentInfo = await this.getPaymentStatus(paymentId);

        return {
          isValid: true,
          paymentId: paymentId,
          orderId: body.external_reference,
          status: this.mapMercadoPagoStatus(paymentInfo.status),
          amount: paymentInfo.amount,
        };
      }

      return {
        isValid: true,
        errorMessage: 'Tipo de evento no soportado',
      };
    } catch (error: any) {
      console.error('Error verificando webhook de MercadoPago:', error.message);
      return {
        isValid: false,
        errorMessage: error.message,
      };
    }
  }

  /**
   * Obtiene el estado de un pago
   */
  async getPaymentStatus(paymentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
  }> {
    try {
      const response = await this.client.get(`/v1/payments/${paymentId}`);
      const payment = response.data;

      return {
        status: payment.status,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        paymentMethod: payment.payment_method_id,
      };
    } catch (error: any) {
      console.error('Error obteniendo estado de pago de MercadoPago:', error.message);
      throw new Error(`Error obteniendo estado de pago: ${error.message}`);
    }
  }

  /**
   * Mapea los estados de MercadoPago a estados internos
   */
  private mapMercadoPagoStatus(mpStatus: string): string {
    const statusMap: Record<string, string> = {
      pending: 'PENDING',
      approved: 'APPROVED',
      authorized: 'APPROVED',
      in_process: 'PENDING',
      in_mediation: 'PENDING',
      rejected: 'REJECTED',
      cancelled: 'CANCELLED',
      refunded: 'REFUNDED',
      charged_back: 'REFUNDED',
    };

    return statusMap[mpStatus] || 'PENDING';
  }
}
