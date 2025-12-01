import { Calendar, User, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'Guía Completa: Cómo Elegir tu Primera Motocicleta',
      excerpt: 'Todo lo que necesitas saber antes de comprar tu primera moto. Desde el tipo de licencia hasta el estilo que mejor se adapta a ti.',
      author: 'Carlos Rodríguez',
      date: '15 de Noviembre, 2024',
      image: '/placeholder.png',
      category: 'Guías',
    },
    {
      id: 2,
      title: 'Mantenimiento Preventivo: 10 Tips Esenciales',
      excerpt: 'Mantén tu motocicleta en perfectas condiciones con estos consejos de mantenimiento preventivo que todo motociclista debe conocer.',
      author: 'Ana Martínez',
      date: '10 de Noviembre, 2024',
      image: '/placeholder.png',
      category: 'Mantenimiento',
    },
    {
      id: 3,
      title: 'Las Mejores Rutas para Motociclistas en Perú',
      excerpt: 'Descubre los caminos más espectaculares del país para disfrutar en dos ruedas. Paisajes increíbles te esperan.',
      author: 'Luis Torres',
      date: '5 de Noviembre, 2024',
      image: '/placeholder.png',
      category: 'Viajes',
    },
    {
      id: 4,
      title: 'Equipamiento de Seguridad: Lo que Debes Saber',
      excerpt: 'La seguridad es primero. Conoce el equipamiento esencial que todo motociclista debe tener para protegerse en la carretera.',
      author: 'María González',
      date: '1 de Noviembre, 2024',
      image: '/placeholder.png',
      category: 'Seguridad',
    },
    {
      id: 5,
      title: 'Motos Eléctricas: El Futuro de la Movilidad',
      excerpt: 'Las motocicletas eléctricas están revolucionando el mercado. Descubre sus ventajas, desventajas y modelos destacados.',
      author: 'Pedro Sánchez',
      date: '28 de Octubre, 2024',
      image: '/placeholder.png',
      category: 'Tecnología',
    },
    {
      id: 6,
      title: 'Conducción en Lluvia: Técnicas y Precauciones',
      excerpt: 'Aprende las técnicas correctas para conducir tu moto de forma segura cuando las condiciones climáticas no son las ideales.',
      author: 'Carmen Ruiz',
      date: '25 de Octubre, 2024',
      image: '/placeholder.png',
      category: 'Seguridad',
    },
  ];

  const categories = ['Todas', 'Guías', 'Mantenimiento', 'Viajes', 'Seguridad', 'Tecnología'];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog de MotoShop
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Consejos, guías y noticias del mundo de las motocicletas
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'Todas'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="card overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{post.date}</span>
                </div>

                {/* Read More */}
                <a
                  href="#"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Leer más
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn btn-primary btn-lg">
            Cargar Más Artículos
          </button>
        </div>
      </div>
    </div>
  );
}
