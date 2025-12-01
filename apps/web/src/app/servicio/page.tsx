import { Wrench, Clock, Shield, Award, CheckCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ServicioPage() {
  const services = [
    {
      icon: Wrench,
      title: 'Mantenimiento Preventivo',
      description: 'Revisión completa de tu motocicleta para prevenir problemas futuros',
      price: 'Desde S/ 150',
    },
    {
      icon: Shield,
      title: 'Reparaciones Generales',
      description: 'Solución de problemas mecánicos y eléctricos con garantía',
      price: 'Según diagnóstico',
    },
    {
      icon: Award,
      title: 'Cambio de Aceite',
      description: 'Cambio de aceite y filtro con productos de primera calidad',
      price: 'Desde S/ 80',
    },
    {
      icon: CheckCircle,
      title: 'Revisión Pre-ITV',
      description: 'Preparamos tu moto para pasar la inspección técnica',
      price: 'S/ 120',
    },
  ];

  const benefits = [
    'Técnicos certificados y especializados',
    'Repuestos originales garantizados',
    'Diagnóstico gratuito',
    'Garantía de 6 meses en reparaciones',
    'Servicio de recojo y entrega',
    'Precios competitivos',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-dark-900 to-dark-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Servicio Técnico Especializado
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Mantén tu motocicleta en perfectas condiciones con nuestro servicio técnico profesional
          </p>
          <Link href="/contacto" className="btn btn-primary btn-lg">
            Agendar Cita
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-gray-600">
              Ofrecemos una amplia gama de servicios para tu motocicleta
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <p className="text-primary-600 font-bold">
                    {service.price}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                ¿Por Qué Elegirnos?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Horarios de Atención
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Lunes a Viernes</p>
                    <p className="text-gray-600">8:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Sábados</p>
                    <p className="text-gray-600">9:00 AM - 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Domingos</p>
                    <p className="text-gray-600">Cerrado</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-primary-600 mr-3" />
                  <p className="font-semibold text-gray-900">Agenda tu Cita</p>
                </div>
                <Link href="/contacto" className="btn btn-primary w-full">
                  Contactar Ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas Ayuda con tu Moto?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Nuestros expertos están listos para atenderte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
              Agendar Cita
            </Link>
            <a href="tel:+51987654321" className="btn btn-lg btn-ghost bg-white/10 hover:bg-white/20 text-white">
              Llamar: +51 987 654 321
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
