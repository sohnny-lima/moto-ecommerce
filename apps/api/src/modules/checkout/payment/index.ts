import { env } from '../../../config/env';
import { PaymentGateway } from './PaymentGateway';
import { MercadoPagoGateway } from './MercadoPagoGateway';
import { CulqiGateway } from './CulqiGateway';
import { DemoGateway } from './DemoGateway';

/**
 * Factory function que retorna el gateway de pago apropiado
 * según el proveedor configurado en las variables de entorno
 * 
 * @param provider - Proveedor de pago opcional. Si no se especifica, usa el de las variables de entorno
 * @returns Instancia del gateway de pago
 * @throws Error si el proveedor no es válido
 */
export function getGateway(provider?: string): PaymentGateway {
  const paymentProvider = provider || env.PAYMENT_PROVIDER;

  switch (paymentProvider) {
    case 'MERCADOPAGO':
      return new MercadoPagoGateway();

    case 'CULQI':
      return new CulqiGateway();

    case 'DEMO':
      return new DemoGateway();

    default:
      throw new Error(`Proveedor de pago no soportado: ${paymentProvider}`);
  }
}

/**
 * Obtiene una instancia del gateway configurado por defecto
 */
export function getDefaultGateway(): PaymentGateway {
  return getGateway();
}

/**
 * Verifica si un proveedor es válido
 */
export function isValidProvider(provider: string): boolean {
  return ['MERCADOPAGO', 'CULQI', 'DEMO'].includes(provider);
}

// Exportar tipos e interfaces
export * from './PaymentGateway';
export { MercadoPagoGateway } from './MercadoPagoGateway';
export { CulqiGateway } from './CulqiGateway';
export { DemoGateway } from './DemoGateway';
