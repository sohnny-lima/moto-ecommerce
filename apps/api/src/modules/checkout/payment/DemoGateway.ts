import {
    PaymentGateway,
    PaymentPreferenceData,
    PaymentPreferenceResult,
    WebhookVerificationResult
} from './PaymentGateway';

/**
 * Gateway de pago DEMO para desarrollo y testing
 * No realiza llamadas a APIs externas, solo simula el flujo de pago
 */
export class DemoGateway implements PaymentGateway {
    async createPreference(data: PaymentPreferenceData): Promise<PaymentPreferenceResult> {
        const externalId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        console.log('🎭 [DEMO] Creando preferencia de pago simulada:', {
            orderId: data.orderId,
            amount: data.amount,
            currency: data.currency,
            payer: data.payer.email,
        });

        return {
            preferenceId: externalId,
            externalId,
            initPoint: `http://localhost:3000/demo/payment?order=${data.orderId}&amount=${data.amount}`,
        };
    }

    async verifyWebhook(
        _signature: string,
        body: any,
        _headers: Record<string, string>
    ): Promise<WebhookVerificationResult> {
        console.log('🎭 [DEMO] Verificando webhook simulado');

        return {
            isValid: true,
            paymentId: body.paymentId || `demo-payment-${Date.now()}`,
            status: body.status || 'APPROVED',
        };
    }

    async getPaymentStatus(_paymentId: string): Promise<{
        status: string;
        amount: number;
        currency: string;
        paymentMethod?: string;
    }> {
        console.log('🎭 [DEMO] Obteniendo estado de pago simulado');

        return {
            status: 'APPROVED',
            amount: 0,
            currency: 'PEN',
            paymentMethod: 'demo',
        };
    }
}
