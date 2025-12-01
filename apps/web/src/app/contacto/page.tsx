'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';

export default function ContactoPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement contact form submission
    setTimeout(() => {
      alert('Mensaje enviado correctamente. Te contactaremos pronto.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Address */}
            <div className="card p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                  <p className="text-gray-600">
                    Av. Principal 123<br />
                    Lima, Perú 15001
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="card p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                  <p className="text-gray-600">
                    +51 987 654 321<br />
                    +51 123 456 789
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="card p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">
                    info@motoshop.com<br />
                    ventas@motoshop.com
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="card p-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Horario</h3>
                  <p className="text-gray-600">
                    Lun - Vie: 8:00 AM - 6:00 PM<br />
                    Sábado: 9:00 AM - 2:00 PM<br />
                    Domingo: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envíanos un Mensaje
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="input"
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="input"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="input"
                      placeholder="+51 987 654 321"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="input"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="ventas">Consulta de Ventas</option>
                      <option value="servicio">Servicio Técnico</option>
                      <option value="garantia">Garantía</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="input resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12">
          <div className="card overflow-hidden">
            <div className="bg-gray-200 h-96 flex items-center justify-center">
              <p className="text-gray-500">
                [Aquí iría el mapa de Google Maps con la ubicación]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
