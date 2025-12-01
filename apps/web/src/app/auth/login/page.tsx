'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de login (versión demo)
    setTimeout(() => {
      // Guardar sesión en localStorage
      // NOTA: En producción, esto debería hacer una llamada real al API
      // Por ahora usamos un ID fijo que corresponde al usuario demo en la BD
      const user = {
        id: formData.email === 'admin@demo.com' ? 'admin-demo-id' : 'customer-demo-id',
        email: formData.email,
        firstName: formData.email === 'admin@demo.com' ? 'Admin' : 'Usuario',
        lastName: 'Demo',
        phone: '966879306',
        name: formData.email === 'admin@demo.com' ? 'Admin Demo' : 'Usuario Demo',
        role: formData.email === 'admin@demo.com' ? 'ADMIN' : 'CUSTOMER',
      };

      localStorage.setItem('user', JSON.stringify(user));

      // Redirigir según parámetro redirect o al inicio
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      window.location.href = redirect || '/';
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
            Iniciar Sesión
          </h1>
          <p className="text-gray-600">
            Ingresa a tu cuenta de MotoShop
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <Link href="#" className="text-sm text-primary-600 hover:text-primary-700">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Regístrate aquí
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
