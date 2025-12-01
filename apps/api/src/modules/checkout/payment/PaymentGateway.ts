/**
 * Interfaz común para todos los proveedores de pago
 * Implementa el patrón Adapter para abstraer las diferencias entre MercadoPago y Culqi
 */

export interface PaymentPreferenceData {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  payer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  backUrls?: {
    success: string;
    failure: string;
    pending: string;
  };
}

export interface PaymentPreferenceResult {
  preferenceId: string;
  initPoint: string; // URL para redirigir al usuario
  externalId: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  paymentId?: string;
  orderId?: string;
  status?: string;
  amount?: number;
  errorMessage?: string;
}

export interface PaymentGateway {
  /**
   * Crea una preferencia de pago (checkout)
   * @param data Datos de la orden y cliente
   * @returns Datos de la preferencia incluyendo init_point
   */
  createPreference(data: PaymentPreferenceData): Promise<PaymentPreferenceResult>;

  /**
   * Verifica la autenticidad de un webhook
   * @param signature Firma del webhook
   * @param body Cuerpo del webhook
   * @param headers Headers del webhook
   * @returns Resultado de la verificación
   */
  verifyWebhook(
    signature: string,
    body: any,
    headers: Record<string, string>
  ): Promise<WebhookVerificationResult>;

  /**
   * Obtiene el estado de un pago
   * @param paymentId ID del pago en el proveedor
   * @returns Estado actual del pago
   */
  getPaymentStatus(paymentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    paymentMethod?: string;
  }>;
}
