'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { checkoutApi } from '../../lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Check if user is logged in
  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || '',
      }));
    }
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No hay productos en el carrito
            </h1>
            <p className="text-gray-600 mb-8">
              Agrega productos al carrito antes de proceder al checkout
            </p>
            <Link href="/catalogo" className="btn btn-primary btn-lg">
              Ir al Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const shippingCost = total > 500 ? 0 : 50;
  // Los precios ya incluyen IGV (18%), así que extraemos el IGV del total
  // Fórmula: Subtotal sin IGV = Total con IGV / 1.18
  const subtotalWithoutTax = total / 1.18;
  const tax = total - subtotalWithoutTax;
  const finalTotal = total + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!user) {
      setError('Debes iniciar sesión para completar la compra');
      setTimeout(() => {
        router.push('/auth/login?redirect=/checkout');
      }, 2000);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkoutData = {
        userId: user.email, // Enviar email, el backend lo buscará en la BD
        items: items.map((item) => ({
          variantId: item.variant.id,
          quantity: item.quantity,
        })),
        shippingCost: shippingCost,
        backUrls: {
          success: `${window.location.origin}/checkout/success`,
          failure: `${window.location.origin}/checkout/failure`,
          pending: `${window.location.origin}/checkout/pending`,
        },
      };

      const response = await checkoutApi.create(checkoutData);

      if (response.success) {
        // Clear cart
        clear();
        // Redirect to payment
        window.location.href = response.data.checkoutUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        {!user && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Inicio de sesión requerido.</span> Debes{' '}
                  <Link href="/auth/login?redirect=/checkout" className="font-semibold underline hover:text-yellow-800">
                    iniciar sesión
                  </Link>{' '}
                  para completar tu compra.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Información Personal
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
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
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="input"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Dirección de Envío
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      required
                      className="input"
                      value={formData.street}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="input"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        className="input"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        required
                        className="input"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Resumen del Pedido
                </h2>

                {/* Items */}
                <div className="space-y-3 border-b pb-4 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.variant.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.images[0] || '/placeholder.png'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">{item.variant.color}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x S/ {item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-b pb-4 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>S/ {subtotalWithoutTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">Gratis</span>
                      ) : (
                        `S/ ${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IGV (18%)</span>
                    <span>S/ {tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>S/ {finalTotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Proceder al Pago'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Serás redirigido a MercadoPago para completar tu pago de forma segura
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
