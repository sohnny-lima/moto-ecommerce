import React from 'react';
import { Button } from './Button';

export interface HeaderProps {
  logo?: string | React.ReactNode;
  cartItemCount?: number;
  onCartClick?: () => void;
  onSearchClick?: () => void;
  onLoginClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo = '🏍️ MotoShop',
  cartItemCount = 0,
  onCartClick,
  onSearchClick,
  onLoginClick,
  className = '',
}) => {
  return (
    <header className={`sticky top-0 z-50 bg-white shadow-md ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            {typeof logo === 'string' ? (
              <a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {logo}
              </a>
            ) : (
              logo
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/catalogo" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Catálogo
            </a>
            <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Blog
            </a>
            <a href="/servicio" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Servicio
            </a>
            <a href="/contacto" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contacto
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={onSearchClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Buscar"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Carrito"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Login */}
            <Button size="sm" onClick={onLoginClick}>
              Ingresar
            </Button>

            {/* Mobile Menu */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

