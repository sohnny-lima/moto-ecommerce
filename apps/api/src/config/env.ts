import { z } from "zod";

/**
 * Schema de validación para las variables de entorno
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida"),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET es requerida"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET es requerida"),

  // Pagos
  PAYMENT_PROVIDER: z.enum(["MERCADOPAGO", "CULQI", "DEMO"], {
    message: "PAYMENT_PROVIDER debe ser MERCADOPAGO, CULQI o DEMO",
  }),

  // MercadoPago
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),

  // Culqi
  CULQI_PUBLIC_KEY: z.string().optional(),
  CULQI_SECRET_KEY: z.string().optional(),
  CULQI_WEBHOOK_SECRET: z.string().optional(),

  // App
  PORT: z.string().regex(/^\d+$/, "PORT debe ser un número").transform(Number),
  NEXT_PUBLIC_API_BASE: z
    .string()
    .url("NEXT_PUBLIC_API_BASE debe ser una URL válida"),
  STORE_BASE_URL: z.string().url("STORE_BASE_URL debe ser una URL válida"),
});

/**
 * Valida y parsea las variables de entorno
 * @throws {Error} Si alguna variable requerida falta o es inválida
 */
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);

    // Validación condicional: si el proveedor es MercadoPago, validar sus credenciales
    if (parsed.PAYMENT_PROVIDER === "MERCADOPAGO") {
      if (!parsed.MERCADOPAGO_ACCESS_TOKEN) {
        throw new Error(
          "MERCADOPAGO_ACCESS_TOKEN es requerido cuando PAYMENT_PROVIDER es MERCADOPAGO"
        );
      }
      if (!parsed.MERCADOPAGO_WEBHOOK_SECRET) {
        throw new Error(
          "MERCADOPAGO_WEBHOOK_SECRET es requerido cuando PAYMENT_PROVIDER es MERCADOPAGO"
        );
      }
    }

    // Validación condicional: si el proveedor es Culqi, validar sus credenciales
    if (parsed.PAYMENT_PROVIDER === "CULQI") {
      if (!parsed.CULQI_PUBLIC_KEY) {
        throw new Error(
          "CULQI_PUBLIC_KEY es requerido cuando PAYMENT_PROVIDER es CULQI"
        );
      }
      if (!parsed.CULQI_SECRET_KEY) {
        throw new Error(
          "CULQI_SECRET_KEY es requerido cuando PAYMENT_PROVIDER es CULQI"
        );
      }
      if (!parsed.CULQI_WEBHOOK_SECRET) {
        throw new Error(
          "CULQI_WEBHOOK_SECRET es requerido cuando PAYMENT_PROVIDER es CULQI"
        );
      }
    }

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(
        `❌ Error en la configuración de variables de entorno:\n${errorMessages.join("\n")}`
      );
    }
    throw error;
  }
}

/**
 * Variables de entorno validadas y tipadas
 */
export const env = validateEnv();

/**
 * Tipo inferido de las variables de entorno
 */
export type Env = z.infer<typeof envSchema>;
