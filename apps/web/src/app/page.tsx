import Link from 'next/link';
import Image from 'next/image';
import { productsApi } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Bike, Wrench, Shield, TruckIcon } from 'lucide-react';

export default async function Home() {
  // Fetch featured products
  const productsResponse = await productsApi.getAll({ page: 1, size: 8, sortBy: 'createdAt', sortOrder: 'desc' });
  const featuredProducts = productsResponse.data;

  // Fetch categories
  const categoriesResponse = await productsApi.getCategories();
  const categories = categoriesResponse.data;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden min-h-[90vh] lg:min-h-screen flex items-center">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>
        
        <div className="container-custom py-8 md:py-12 lg:py-16 xl:py-20 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center">
            <div className="space-y-4 md:space-y-5 lg:space-y-8">
              <div className="inline-block">
                <span className="bg-primary-600/20 text-primary-400 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-primary-600/30">
                  ⚡ Promoción Especial
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Encuentra tu
                <span className="block text-primary-500 mt-1 sm:mt-2 bg-gradient-to-r from-primary-500 to-red-500 bg-clip-text text-transparent">
                  Moto Ideal
                </span>
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
                Las mejores marcas y modelos de motocicletas al mejor precio. 
                <span className="text-white font-semibold"> Calidad garantizada</span> y servicio técnico especializado.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 md:pt-3">
                <Link href="/catalogo" className="btn btn-primary btn-lg group shadow-lg shadow-primary-600/50 hover:shadow-xl hover:shadow-primary-600/70 transition-all text-sm sm:text-base">
                  Ver Catálogo
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/servicio" className="btn btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm text-sm sm:text-base">
                  Servicio Técnico
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6 pt-4 md:pt-5 lg:pt-8 border-t border-white/10">
                <div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-500">500+</div>
                  <div className="text-xs md:text-sm text-gray-400">Motos vendidas</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-500">98%</div>
                  <div className="text-xs md:text-sm text-gray-400">Satisfacción</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-500">12</div>
                  <div className="text-xs md:text-sm text-gray-400">Modelos</div>
                </div>
              </div>
            </div>
            
            <div className="relative h-[280px] md:h-[350px] lg:h-[420px] xl:h-[500px] hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent rounded-2xl lg:rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/hero/moto-hero.jpg"
                  alt="MotoShop Hero"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Scroll Down Indicator */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block">
            <div className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer">
              <span className="text-sm font-medium">Explora más</span>
              <ChevronRight className="w-6 h-6 rotate-90" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TruckIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Envío Gratis</h3>
                <p className="text-sm text-gray-500">En compras mayores a S/ 500</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Garantía</h3>
                <p className="text-sm text-gray-500">1 año en todos los productos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Servicio Técnico</h3>
                <p className="text-sm text-gray-500">Mantenimiento especializado</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bike className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Asesoría</h3>
                <p className="text-sm text-gray-500">Expertos en motocicletas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Categorías</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-2">
              Explora por Categoría
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encuentra la moto perfecta para tu estilo de vida y necesidades
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/catalogo?category=${category.id}`}
                className="group"
              >
                <div className="card p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-primary-200 bg-white">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300 group-hover:scale-110">
                    <Bike className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-16">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Lo Más Vendido</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 mt-2">
                Productos Destacados
              </h2>
              <p className="text-lg text-gray-600">
                Las últimas novedades y motos más populares
              </p>
            </div>
            <Link
              href="/catalogo"
              className="btn btn-secondary hidden md:inline-flex group hover:bg-primary-600 hover:text-white transition-colors"
            >
              Ver Todos
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link href="/catalogo" className="btn btn-primary btn-lg w-full sm:w-auto">
              Ver Todos los Productos
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-red-600 text-white overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30 backdrop-blur-sm">
                🎯 Asesoría Gratuita
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              ¿Necesitas Asesoría Personalizada?
            </h2>
            
            <p className="text-xl mb-10 text-white/90 leading-relaxed">
              Nuestros expertos están listos para ayudarte a encontrar la moto perfecta 
              que se adapte a tus necesidades y presupuesto
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contacto" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all group w-full sm:w-auto">
                Contáctanos Ahora
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/catalogo" className="btn btn-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all w-full sm:w-auto">
                Ver Catálogo
              </Link>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Garantía de 1 año</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                <span className="text-sm">Servicio técnico</span>
              </div>
              <div className="flex items-center gap-2">
                <TruckIcon className="w-5 h-5" />
                <span className="text-sm">Envío gratis</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
