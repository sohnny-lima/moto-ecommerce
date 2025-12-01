import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-white">MotoShop</span>
            </div>
            <p className="text-sm text-gray-400">
              Tu tienda online de motocicletas. Las mejores marcas y modelos al mejor precio.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61584002349036"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/wasimotosayacucho/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/51914475858"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalogo" className="text-sm hover:text-primary-500 transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/servicio" className="text-sm hover:text-primary-500 transition-colors">
                  Servicio Técnico
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm hover:text-primary-500 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Política de Devoluciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Av. Principal 123, Lima, Perú</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">+51 987 654 321</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-sm">info@motoshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} MotoShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
