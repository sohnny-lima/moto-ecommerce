import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // ============================================
  // 1. LIMPIAR BASE DE DATOS
  // ============================================
  console.log("🧹 Limpiando base de datos...");
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  // ============================================
  // 2. CREAR USUARIOS
  // ============================================
  console.log("👤 Creando usuarios...");

  const hashedPasswordAdmin = await bcrypt.hash("Admin123!", 10);
  const hashedPasswordCustomer = await bcrypt.hash("Customer123!", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@demo.com",
      password: hashedPasswordAdmin,
      firstName: "Admin",
      lastName: "Sistema",
      phone: "+51999888777",
      role: UserRole.ADMIN,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: "customer@demo.com",
      password: hashedPasswordCustomer,
      firstName: "Juan",
      lastName: "Pérez",
      phone: "+51987654321",
      role: UserRole.CUSTOMER,
    },
  });

  console.log("✅ Usuarios creados:");
  console.log(`   - ${adminUser.email}`);
  console.log(`   - ${customerUser.email}`);

  // ============================================
  // 3. CREAR MARCAS
  // ============================================
  console.log("🏷️  Creando marcas...");

  const honda = await prisma.brand.create({
    data: {
      name: "Honda",
      description:
        "Líder mundial en motocicletas con tecnología innovadora y confiabilidad excepcional",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/79/Honda_Logo.svg",
    },
  });

  const yamaha = await prisma.brand.create({
    data: {
      name: "Yamaha",
      description:
        "Motos de alto rendimiento con diseño japonés y calidad superior",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7b/Yamaha_Motor_Company_logo.svg",
    },
  });

  const bajaj = await prisma.brand.create({
    data: {
      name: "Bajaj",
      description:
        "Marca india reconocida por su eficiencia y excelente relación precio-calidad",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/8/8e/Bajaj_Auto_Logo.svg",
    },
  });

  const suzuki = await prisma.brand.create({
    data: {
      name: "Suzuki",
      description:
        "Innovación y rendimiento en motocicletas deportivas y urbanas",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg",
    },
  });

  console.log("✅ Marcas creadas: Honda, Yamaha, Bajaj, Suzuki");

  // ============================================
  // 4. CREAR CATEGORÍAS
  // ============================================
  console.log("📂 Creando categorías...");

  const scooter = await prisma.category.create({
    data: {
      name: "Scooter",
      description:
        "Motocicletas urbanas ideales para la ciudad, cómodas y económicas",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    },
  });

  const deportiva = await prisma.category.create({
    data: {
      name: "Deportiva",
      description:
        "Motos de alta velocidad y rendimiento para los amantes de la adrenalina",
      imageUrl: "https://images.unsplash.com/photo-1558981852-426c6c22a060",
    },
  });

  const chopper = await prisma.category.create({
    data: {
      name: "Chopper",
      description:
        "Estilo clásico americano con diseño robusto y asientos cómodos",
      imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87",
    },
  });

  const touring = await prisma.category.create({
    data: {
      name: "Touring",
      description:
        "Perfectas para viajes largos con comodidad y gran capacidad de carga",
      imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65",
    },
  });

  const naked = await prisma.category.create({
    data: {
      name: "Naked",
      description:
        "Diseño minimalista y ágil, perfectas para ciudad y carretera",
      imageUrl: "https://images.unsplash.com/photo-1599819177411-8c5e782e5bb3",
    },
  });

  const offroad = await prisma.category.create({
    data: {
      name: "Off-Road",
      description: "Diseñadas para aventuras todo terreno y caminos difíciles",
      imageUrl: "https://images.unsplash.com/photo-1568772784584-68bd0e0fdf6e",
    },
  });

  console.log("✅ Categorías creadas: 6 categorías");

  // ============================================
  // 5. CREAR PRODUCTOS CON VARIANTES
  // ============================================
  console.log("🏍️  Creando productos con variantes...");

  // NOTA: no necesitamos guardar cada producto en const,
  // solo usamos los IDs de marca/categoría ya creados.

  // Producto 1: Honda PCX 160
  await prisma.product.create({
    data: {
      name: "Honda PCX 160",
      description:
        "Scooter urbano con motor de 160cc, diseño moderno y tecnología Honda SMART Key. Ideal para el tráfico de la ciudad.",
      price: 12500.0,
      brandId: honda.id,
      categoryId: scooter.id,
      images: ["/images/motos/Honda PCX 160.png"],
      variants: {
        create: [
          { color: "Rojo", stock: 15, sku: "PCX160-RED-001" },
          { color: "Azul", stock: 12, sku: "PCX160-BLU-001" },
          { color: "Negro", stock: 20, sku: "PCX160-BLK-001" },
        ],
      },
    },
  });

  // Producto 2: Yamaha R15
  await prisma.product.create({
    data: {
      name: "Yamaha R15 V4",
      description:
        "Moto deportiva con motor de 155cc, diseño agresivo y tecnología de pista. Perfecta para los amantes de la velocidad.",
      price: 15800.0,
      brandId: yamaha.id,
      categoryId: deportiva.id,
      images: ["/images/motos/Yamaha R15 V4.png"],
      variants: {
        create: [
          { color: "Azul Racing", stock: 10, sku: "R15V4-BLU-001" },
          { color: "Negro Mate", stock: 8, sku: "R15V4-BLK-001" },
          { color: "Rojo Racing", stock: 5, sku: "R15V4-RED-001" },
        ],
      },
    },
  });

  // Producto 3: Bajaj Pulsar NS200
  await prisma.product.create({
    data: {
      name: "Bajaj Pulsar NS200",
      description:
        "Naked bike con motor de 200cc, suspensión de alto rendimiento y diseño muscular. Excelente relación precio-calidad.",
      price: 9500.0,
      brandId: bajaj.id,
      categoryId: naked.id,
      images: ["/images/motos/Bajaj Pulsar NS200.webp"],
      variants: {
        create: [
          { color: "Rojo", stock: 18, sku: "NS200-RED-001" },
          { color: "Negro", stock: 22, sku: "NS200-BLK-001" },
          { color: "Azul", stock: 14, sku: "NS200-BLU-001" },
        ],
      },
    },
  });

  // Producto 4: Suzuki Gixxer SF 250
  await prisma.product.create({
    data: {
      name: "Suzuki Gixxer SF 250",
      description:
        "Moto deportiva con carenado completo, motor de 250cc, frenos ABS y panel digital. Ideal para ciudad y carretera.",
      price: 14200.0,
      brandId: suzuki.id,
      categoryId: deportiva.id,
      images: ["/images/motos/Suzuki Gixxer SF 250.webp"],
      variants: {
        create: [
          { color: "Azul MotoGP", stock: 9, sku: "GIXXER250-BLU-001" },
          { color: "Negro Brillante", stock: 12, sku: "GIXXER250-BLK-001" },
          { color: "Rojo", stock: 7, sku: "GIXXER250-RED-001" },
        ],
      },
    },
  });

  // Producto 5: Honda CRF 250L
  await prisma.product.create({
    data: {
      name: "Honda CRF 250L",
      description:
        "Moto de aventura todo terreno con motor de 250cc, suspensión de largo recorrido y neumáticos mixtos.",
      price: 16500.0,
      brandId: honda.id,
      categoryId: offroad.id,
      images: ["/images/motos/Honda CRF 250L.webp"],
      variants: {
        create: [
          { color: "Rojo Rally", stock: 6, sku: "CRF250L-RED-001" },
          { color: "Negro", stock: 8, sku: "CRF250L-BLK-001" },
        ],
      },
    },
  });

  // Producto 6: Yamaha MT-03
  await prisma.product.create({
    data: {
      name: "Yamaha MT-03",
      description:
        "Naked deportiva con motor bicilíndrico de 321cc, chasis ligero y diseño agresivo. Perfecta para el día a día.",
      price: 18900.0,
      brandId: yamaha.id,
      categoryId: naked.id,
      images: ["/images/motos/Yamaha MT-03.png"],
      variants: {
        create: [
          { color: "Azul Yamaha", stock: 11, sku: "MT03-BLU-001" },
          { color: "Negro Icon", stock: 13, sku: "MT03-BLK-001" },
        ],
      },
    },
  });

  // Producto 7: Bajaj Avenger Cruise 220
  await prisma.product.create({
    data: {
      name: "Bajaj Avenger Cruise 220",
      description:
        "Chopper cruiser con motor de 220cc, asiento bajo y cómodo, ideal para viajes largos con estilo relajado.",
      price: 10200.0,
      brandId: bajaj.id,
      categoryId: chopper.id,
      images: ["/images/motos/Bajaj Avenger Cruise 220.webp"],
      variants: {
        create: [
          { color: "Negro Mate", stock: 16, sku: "AVGCR220-BLK-001" },
          { color: "Azul", stock: 10, sku: "AVGCR220-BLU-001" },
        ],
      },
    },
  });

  // Producto 8: Suzuki V-Strom 650
  await prisma.product.create({
    data: {
      name: "Suzuki V-Strom 650 XT",
      description:
        "Moto touring de aventura con motor bicilíndrico de 645cc, ideal para viajes largos y rutas mixtas.",
      price: 28500.0,
      brandId: suzuki.id,
      categoryId: touring.id,
      images: ["/images/motos/Suzuki V-Strom 650 XT.webp"],
      variants: {
        create: [
          { color: "Amarillo Campeón", stock: 4, sku: "VSTROM650-YLW-001" },
          { color: "Negro", stock: 5, sku: "VSTROM650-BLK-001" },
          { color: "Rojo", stock: 3, sku: "VSTROM650-RED-001" },
        ],
      },
    },
  });

  // Producto 9: Honda CBR 500R
  await prisma.product.create({
    data: {
      name: "Honda CBR 500R",
      description:
        "Deportiva de media cilindrada con motor de 471cc, carenado completo y sistema ABS. Perfecta para iniciarse en deportivas.",
      price: 24500.0,
      brandId: honda.id,
      categoryId: deportiva.id,
      images: ["/images/motos/Honda CBR 500R.jpg"],
      variants: {
        create: [
          { color: "Rojo HRC", stock: 7, sku: "CBR500R-RED-001" },
          { color: "Negro", stock: 9, sku: "CBR500R-BLK-001" },
          { color: "Azul", stock: 6, sku: "CBR500R-BLU-001" },
        ],
      },
    },
  });

  // Producto 10: Yamaha FZ-15
  await prisma.product.create({
    data: {
      name: "Yamaha FZ-15",
      description:
        "Naked urbana con motor de 149cc, diseño musculoso y excelente maniobrabilidad para la ciudad.",
      price: 8200.0,
      brandId: yamaha.id,
      categoryId: naked.id,
      images: ["/images/motos/Yamaha FZ-15.webp"],
      variants: {
        create: [
          { color: "Azul Yamaha", stock: 25, sku: "FZ15-BLU-001" },
          { color: "Negro", stock: 30, sku: "FZ15-BLK-001" },
          { color: "Rojo", stock: 20, sku: "FZ15-RED-001" },
        ],
      },
    },
  });

  // Producto 11: Bajaj Dominar 400
  await prisma.product.create({
    data: {
      name: "Bajaj Dominar 400",
      description:
        "Touring de alto rendimiento con motor de 373cc, suspensión de largo recorrido y equipamiento completo.",
      price: 13800.0,
      brandId: bajaj.id,
      categoryId: touring.id,
      images: ["/images/motos/Bajaj Dominar 400.avif"],
      variants: {
        create: [
          { color: "Negro Mate", stock: 12, sku: "DOM400-BLK-001" },
          { color: "Azul Canyon", stock: 8, sku: "DOM400-BLU-001" },
          { color: "Rojo Vine", stock: 6, sku: "DOM400-RED-001" },
        ],
      },
    },
  });

  // Producto 12: Suzuki Intruder 150
  await prisma.product.create({
    data: {
      name: "Suzuki Intruder 150",
      description:
        "Cruiser compacta con motor de 155cc, diseño chopper y posición de manejo relajada. Perfecta para ciudad.",
      price: 7500.0,
      brandId: suzuki.id,
      categoryId: chopper.id,
      images: ["/images/motos/Suzuki Intruder 150.jpg"],
      variants: {
        create: [
          { color: "Negro Mate", stock: 19, sku: "INTR150-BLK-001" },
          { color: "Rojo", stock: 14, sku: "INTR150-RED-001" },
        ],
      },
    },
  });

  console.log("✅ 12 productos creados con sus variantes (colores)");

  // ============================================
  // 6. ESTADÍSTICAS
  // ============================================
  const brandCount = await prisma.brand.count();
  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();
  const variantCount = await prisma.variant.count();
  const userCount = await prisma.user.count();

  console.log("\n📊 Resumen del seed:");
  console.log("==========================================");
  console.log(`👥 Usuarios creados: ${userCount}`);
  console.log(`   - Admin: admin@demo.com (Admin123!)`);
  console.log(`   - Customer: customer@demo.com (Customer123!)`);
  console.log(`🏷️  Marcas creadas: ${brandCount}`);
  console.log(`📂 Categorías creadas: ${categoryCount}`);
  console.log(`🏍️  Productos creados: ${productCount}`);
  console.log(`🎨 Variantes creadas: ${variantCount}`);
  console.log("==========================================");
  console.log("✅ Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
