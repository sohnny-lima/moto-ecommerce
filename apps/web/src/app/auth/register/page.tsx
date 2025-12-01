'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    // TODO: Implement registration
    setTimeout(() => {
      alert('Funcionalidad de registro pendiente de implementar');
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Regístrate en MotoShop
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
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
                Email
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={8}
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={8}
                className="input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
              />
              <span className="ml-2 text-sm text-gray-600">
                Acepto los{' '}
                <Link href="#" className="text-primary-600 hover:text-primary-700">
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link href="#" className="text-primary-600 hover:text-primary-700">
                  Política de Privacidad
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
