import { PrismaClient, PaymentProvider, OrderStatus, PaymentStatus } from '@prisma/client';
import { getGateway } from './payment';

const prisma = new PrismaClient();

export interface CreateCheckoutData {
  userId: string;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  shippingCost: number;
  backUrls?: {
    success: string;
    failure: string;
    pending: string;
  };
}

export interface CheckoutResult {
  order: any;
  payment: any;
  checkoutUrl: string;
}

/**
 * Servicio de Checkout
 * Maneja la creación de órdenes y la integración con pasarelas de pago
 */
export class CheckoutService {
  /**
   * Crea una orden y genera el checkout de pago
   */
  async createCheckout(data: CreateCheckoutData): Promise<CheckoutResult> {
    // 1. Obtener el usuario
    // Intentar buscar por ID primero, si falla o parece un email, buscar por email
    let user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    // Si no se encuentra por ID y el userId parece un email, buscar por email
    if (!user && data.userId.includes('@')) {
      user = await prisma.user.findUnique({
        where: { email: data.userId },
      });
    }

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // 2. Validar y obtener las variantes con sus productos
    const variants = await prisma.variant.findMany({
      where: {
        id: {
          in: data.items.map((item) => item.variantId),
        },
      },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
    });

    if (variants.length !== data.items.length) {
      throw new Error('Algunas variantes no fueron encontradas');
    }

    // 3. Validar stock
    for (const item of data.items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new Error(`Variante ${item.variantId} no encontrada`);
      }
      if (variant.stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para ${variant.product.name} (${variant.color}). Disponible: ${variant.stock}`
        );
      }
    }

    // 4. Calcular totales
    let subtotal = 0;
    const orderItems = data.items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      const unitPrice = Number(variant.product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      return {
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
      };
    });

    const shippingCost = data.shippingCost;
    const tax = subtotal * 0.18; // IGV 18%
    const total = subtotal + shippingCost + tax;

    // 5. Crear la orden
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: OrderStatus.PENDING,
        subtotal: subtotal,
        shippingCost: shippingCost,
        tax: tax,
        total: total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    // 6. Crear el registro de pago
    const gateway = getGateway();
    const paymentProvider = process.env.PAYMENT_PROVIDER as PaymentProvider;

    // 7. Crear preferencia de pago en el gateway
    const preference = await gateway.createPreference({
      orderId: order.id,
      amount: Number(total),
      currency: 'PEN',
      description: `Orden #${order.id.substring(0, 8)}`,
      payer: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || undefined,
      },
      items: order.items.map((item) => ({
        title: `${item.variant.product.name} - ${item.variant.color}`,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
      backUrls: data.backUrls,
    });

    // 8. Guardar el pago en la base de datos
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: paymentProvider,
        status: PaymentStatus.PENDING,
        amount: total,
        currency: 'PEN',
        externalId: preference.externalId,
      },
    });

    return {
      order: order,
      payment: payment,
      checkoutUrl: preference.initPoint,
    };
  }

  /**
   * Procesa un webhook de pago
   */
  async processWebhook(
    provider: string,
    signature: string,
    body: any,
    headers: Record<string, string>
  ): Promise<void> {
    const gateway = getGateway(provider);

    // Verificar el webhook
    const verification = await gateway.verifyWebhook(signature, body, headers);

    if (!verification.isValid) {
      throw new Error(`Webhook inválido: ${verification.errorMessage}`);
    }

    if (!verification.paymentId) {
      console.log('Webhook válido pero sin información de pago');
      return;
    }

    // Buscar el pago por externalId
    const payment = await prisma.payment.findFirst({
      where: {
        externalId: verification.paymentId,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      console.log(`Pago no encontrado para externalId: ${verification.paymentId}`);
      return;
    }

    // Actualizar el pago
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: this.mapStatusToPaymentStatus(verification.status || 'PENDING'),
        externalStatus: verification.status,
        webhookData: body,
      },
    });

    // Actualizar el estado de la orden según el estado del pago
    if (verification.status === 'APPROVED') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: OrderStatus.PAID,
        },
      });

      // Descontar stock
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: payment.orderId },
      });

      for (const item of orderItems) {
        await prisma.variant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    } else if (verification.status === 'REJECTED' || verification.status === 'CANCELLED') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });
    }

    console.log(`Webhook procesado correctamente para orden ${payment.orderId}`);
  }

  /**
   * Mapea estados de pago a PaymentStatus
   */
  private mapStatusToPaymentStatus(status: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      PENDING: PaymentStatus.PENDING,
      APPROVED: PaymentStatus.APPROVED,
      REJECTED: PaymentStatus.REJECTED,
      CANCELLED: PaymentStatus.CANCELLED,
      REFUNDED: PaymentStatus.REFUNDED,
    };

    return statusMap[status] || PaymentStatus.PENDING;
  }

  /**
   * Obtiene una orden por ID
   */
  async getOrder(orderId: string, userId?: string): Promise<any> {
    const where: any = { id: orderId };
    if (userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findUnique({
      where,
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
          },
        },
        payment: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Orden no encontrada');
    }

    return order;
  }
}

