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
 * Implementación de PaymentGateway para Culqi
 * Utiliza la API de cargos para procesar pagos
 */
export class CulqiGateway implements PaymentGateway {
  private client: AxiosInstance;
  private webhookSecret: string;
  private publicKey: string;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.culqi.com/v2',
      headers: {
        Authorization: `Bearer ${env.CULQI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    this.webhookSecret = env.CULQI_WEBHOOK_SECRET || '';
    this.publicKey = env.CULQI_PUBLIC_KEY || '';
  }

  /**
   * Crea una orden de pago en Culqi
   * Nota: En Culqi, primero el frontend crea un token con la tarjeta,
   * luego el backend crea el cargo con ese token.
   * Esta función crea una "orden" que el frontend usará.
   */
  async createPreference(data: PaymentPreferenceData): Promise<PaymentPreferenceResult> {
    try {
      // Crear una orden en Culqi
      const order = {
        amount: Math.round(data.amount * 100), // Culqi usa centavos
        currency_code: data.currency,
        description: data.description,
        order_number: data.orderId,
        client_details: {
          first_name: data.payer.firstName,
          last_name: data.payer.lastName,
          email: data.payer.email,
          phone_number: data.payer.phone || '',
        },
        expiration_date: Math.floor(Date.now() / 1000) + 86400, // 24 horas
        confirm: false,
      };

      const response = await this.client.post('/orders', order);

      // Culqi no tiene un "init_point" directo como MercadoPago
      // Devolvemos la URL de checkout personalizada
      const initPoint = `${env.NEXT_PUBLIC_API_BASE}/checkout/culqi?order=${response.data.id}`;

      return {
        preferenceId: response.data.id,
        initPoint: initPoint,
        externalId: response.data.id,
      };
    } catch (error: any) {
      console.error('Error creando orden de Culqi:', error.response?.data || error.message);
      throw new Error(`Culqi error: ${error.response?.data?.merchant_message || error.message}`);
    }
  }

  /**
   * Crea un cargo en Culqi usando un token de tarjeta
   * Esta función se llama después de que el frontend obtiene el token
   */
  async createCharge(
    tokenId: string,
    amount: number,
    currency: string,
    email: string,
    orderId: string
  ): Promise<{
    chargeId: string;
    status: string;
    amount: number;
  }> {
    try {
      const charge = {
        amount: Math.round(amount * 100), // Centavos
        currency_code: currency,
        email: email,
        source_id: tokenId,
        description: `Orden ${orderId}`,
        metadata: {
          order_id: orderId,
        },
      };

      const response = await this.client.post('/charges', charge);

      return {
        chargeId: response.data.id,
        status: this.mapCulqiStatus(response.data.outcome.type),
        amount: response.data.amount / 100,
      };
    } catch (error: any) {
      console.error('Error creando cargo en Culqi:', error.response?.data || error.message);
      throw new Error(`Culqi charge error: ${error.response?.data?.user_message || error.message}`);
    }
  }

  /**
   * Verifica la autenticidad de un webhook de Culqi
   */
  async verifyWebhook(
    signature: string,
    body: any,
    headers: Record<string, string>
  ): Promise<WebhookVerificationResult> {
    try {
      // Culqi envía la firma en el header 'x-culqi-signature'
      const culqiSignature = headers['x-culqi-signature'] || signature;

      if (!culqiSignature) {
        return {
          isValid: false,
          errorMessage: 'Firma de webhook no encontrada',
        };
      }

      // Verificar firma HMAC SHA256
      const bodyString = JSON.stringify(body);
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(bodyString)
        .digest('hex');

      const isValid = culqiSignature === expectedSignature;

      if (!isValid) {
        return {
          isValid: false,
          errorMessage: 'Firma de webhook inválida',
        };
      }

      // Procesar evento
      const eventType = body.type;

      if (eventType === 'charge.succeeded' || eventType === 'charge.failed') {
        const chargeData = body.data;
        const orderId = chargeData.metadata?.order_id;

        return {
          isValid: true,
          paymentId: chargeData.id,
          orderId: orderId,
          status: this.mapCulqiStatus(chargeData.outcome?.type || 'pending'),
          amount: chargeData.amount / 100,
        };
      }

      if (eventType === 'order.status.changed') {
        const orderData = body.data;

        return {
          isValid: true,
          orderId: orderData.order_number,
          status: this.mapCulqiOrderStatus(orderData.state),
        };
      }

      return {
        isValid: true,
        errorMessage: 'Tipo de evento no soportado',
      };
    } catch (error: any) {
      console.error('Error verificando webhook de Culqi:', error.message);
      return {
        isValid: false,
        errorMessage: error.message,
      };
    }
  }

  /**
   * Obtiene el estado de un cargo
   */
  async getPaymentStatus(paymentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
  }> {
    try {
      const response = await this.client.get(`/charges/${paymentId}`);
      const charge = response.data;

      return {
        status: this.mapCulqiStatus(charge.outcome.type),
        amount: charge.amount / 100,
        currency: charge.currency_code,
        paymentMethod: charge.source.iin?.card_brand || 'card',
      };
    } catch (error: any) {
      console.error('Error obteniendo estado de pago de Culqi:', error.message);
      throw new Error(`Error obteniendo estado de pago: ${error.message}`);
    }
  }

  /**
   * Mapea los estados de cargo de Culqi a estados internos
   */
  private mapCulqiStatus(culqiStatus: string): string {
    const statusMap: Record<string, string> = {
      venta_exitosa: 'APPROVED',
      pending: 'PENDING',
      rejected: 'REJECTED',
      expired: 'CANCELLED',
    };

    return statusMap[culqiStatus] || 'PENDING';
  }

  /**
   * Mapea los estados de orden de Culqi a estados internos
   */
  private mapCulqiOrderStatus(culqiOrderStatus: string): string {
    const statusMap: Record<string, string> = {
      paid: 'APPROVED',
      pending: 'PENDING',
      expired: 'CANCELLED',
      deleted: 'CANCELLED',
    };

    return statusMap[culqiOrderStatus] || 'PENDING';
  }

  /**
   * Obtiene la llave pública de Culqi (para el frontend)
   */
  getPublicKey(): string {
    return this.publicKey;
  }
}
