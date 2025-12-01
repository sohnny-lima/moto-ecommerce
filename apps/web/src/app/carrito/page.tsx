'use client';

import { useCartStore } from '../../store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, getTotal, clear } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              Agrega productos al carrito para continuar con tu compra
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
  const subtotalWithoutTax = total / 1.18;
  const tax = total - subtotalWithoutTax;
  const finalTotal = total + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Carrito de Compras
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.variant.id} className="card p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.images[0] || '/placeholder.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/producto/${item.product.slug}`}
                      className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.product.brand.name} • {item.variant.color}
                    </p>
                    <p className="text-sm text-gray-500">SKU: {item.variant.sku}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      S/ {item.product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.variant.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= item.variant.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-gray-900">
                      S/ {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clear}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Vaciar Carrito
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumen del Pedido
              </h2>

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

              {total < 500 && (
                <p className="text-sm text-gray-600 mb-4">
                  Agrega S/ {(500 - total).toFixed(2)} más para obtener envío gratis
                </p>
              )}

              <Link href="/checkout" className="btn btn-primary btn-lg w-full">
                Proceder al Pago
              </Link>

              <Link
                href="/catalogo"
                className="btn btn-ghost w-full mt-3"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
