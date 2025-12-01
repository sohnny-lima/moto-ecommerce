import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';

/**
 * Inicializa y configura la aplicación Express
 */
function createApp(): Application {
  const app = express();

  // Middlewares de seguridad
  app.use(helmet());
  app.use(cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como Postman) o desde localhost/IPs locales
      if (!origin) return callback(null, true);

      // Permitir localhost en cualquier puerto
      if (origin.match(/^http:\/\/localhost(:\d+)?$/)) return callback(null, true);

      // Permitir IPs locales (192.168.x.x, 172.x.x.x, 10.x.x.x)
      if (origin.match(/^http:\/\/(192\.168\.\d+\.\d+|172\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/)) {
        return callback(null, true);
      }

      // Rechazar otros orígenes
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));

  // Middlewares de parseo
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logger
  app.use(morgan('dev'));

  // Documentación Swagger
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Moto E-commerce API Docs',
  }));

  // Ruta de health check
  /**
   * @openapi
   * /health:
   *   get:
   *     tags:
   *       - Health
   *     summary: Health check del servidor
   *     description: Verifica que el servidor esté funcionando correctamente
   *     responses:
   *       200:
   *         description: Servidor funcionando correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                 environment:
   *                   type: string
   *                   example: development
   */
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Ruta raíz
  app.get('/', (_req, res) => {
    res.json({
      message: '🏍️ API de Moto E-commerce',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        docs: '/api/docs',
        products: '/api/products',
        checkout: '/api/checkout',
        webhooks: '/api/webhooks',
      },
    });
  });

  // Importar rutas
  const productsRoutes = require('./modules/products/products.routes').default;
  const checkoutRoutes = require('./modules/checkout/checkout.routes').default;
  const webhookRoutes = require('./modules/webhooks/webhook.routes').default;

  // Registrar rutas
  app.use('/api/products', productsRoutes);
  app.use('/api/checkout', checkoutRoutes);
  app.use('/api/webhooks', webhookRoutes);

  return app;
}

/**
 * Inicia el servidor
 */
function startServer() {
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log('🚀 Servidor iniciado correctamente');
    console.log(`📍 URL: http://localhost:${env.PORT}`);
    console.log(`💳 Proveedor de pagos: ${env.PAYMENT_PROVIDER}`);
    console.log(`🗄️  Base de datos configurada`);
    console.log(`⚙️  Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Iniciar servidor si se ejecuta directamente
if (require.main === module) {
  startServer();
}

export { createApp, startServer };

