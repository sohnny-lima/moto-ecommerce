import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moto E-commerce API',
      version: '1.0.0',
      description: 'API REST para e-commerce de motocicletas con integración de pagos (MercadoPago y Culqi)',
      contact: {
        name: 'API Support',
        email: 'support@motoshop.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.motoshop.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx789ghi' },
            name: { type: 'string', example: 'Yamaha R15 V4' },
            description: { type: 'string' },
            price: { type: 'number', example: 15800.00 },
            images: { type: 'array', items: { type: 'string' } },
            brand: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string', example: 'Yamaha' },
              },
            },
            category: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string', example: 'Deportiva' },
              },
            },
            variants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  color: { type: 'string', example: 'Azul Racing' },
                  stock: { type: 'number', example: 10 },
                  sku: { type: 'string', example: 'R15V4-BLU-001' },
                },
              },
            },
            availableColors: { type: 'array', items: { type: 'string' } },
            totalStock: { type: 'number', example: 18 },
            inStock: { type: 'boolean', example: true },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Honda' },
            description: { type: 'string' },
            logoUrl: { type: 'string' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Scooter' },
            description: { type: 'string' },
            imageUrl: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
            subtotal: { type: 'number' },
            shippingCost: { type: 'number' },
            tax: { type: 'number' },
            total: { type: 'number' },
            items: { type: 'array', items: { type: 'object' } },
            payment: { type: 'object' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
    tags: [
      { name: 'Products', description: 'Gestión de productos' },
      { name: 'Brands', description: 'Gestión de marcas' },
      { name: 'Categories', description: 'Gestión de categorías' },
      { name: 'Checkout', description: 'Proceso de checkout y órdenes' },
      { name: 'Webhooks', description: 'Webhooks de proveedores de pago' },
      { name: 'Health', description: 'Health checks' },
    ],
  },
  apis: ['./src/**/*.ts'], // Path a los archivos con anotaciones JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);

