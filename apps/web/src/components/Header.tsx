'use client';

import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
    // Verificar si hay usuario logueado
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Blog', href: '/blog' },
    { name: 'Servicio Técnico', href: '/servicio' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MotoShop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              href="/carrito"
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:inline-flex btn btn-primary btn-sm"
              >
                Ingresar
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-secondary btn-sm w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ingresar
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
