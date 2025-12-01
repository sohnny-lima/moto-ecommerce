'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/cartStore';
import type { Product, Variant } from '../lib/api';
import { Check, ShoppingCart } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;

    addItem(product, selectedVariant, quantity);
    router.push('/carrito');
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      <div>
        <p className="text-sm text-gray-500">{product.brand.name}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
          {product.name}
        </h1>
        <p className="text-sm text-gray-500 mt-2">{product.category.name}</p>
      </div>

      {/* Price */}
      <div className="border-t border-b py-4">
        <p className="text-4xl font-bold text-gray-900">
          S/ {product.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 mt-1">Precio incluye IGV</p>
      </div>

      {/* Stock Status */}
      <div>
        {product.inStock ? (
          <div className="flex items-center text-green-600">
            <Check className="w-5 h-5 mr-2" />
            <span className="font-medium">
              {product.totalStock} {product.totalStock === 1 ? 'unidad disponible' : 'unidades disponibles'}
            </span>
          </div>
        ) : (
          <div className="text-red-600 font-medium">Agotado</div>
        )}
      </div>

      {/* Color Selection */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color: <span className="text-gray-900">{selectedVariant?.color}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock === 0}
                className={`px-4 py-2 rounded-md border-2 font-medium transition-all ${
                  selectedVariant?.id === variant.id
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : variant.stock === 0
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {variant.color}
                {variant.stock === 0 && ' (Agotado)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      {product.inStock && selectedVariant && (
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={selectedVariant.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(selectedVariant.stock, parseInt(e.target.value) || 1)))}
            className="input w-24"
          />
          <p className="text-xs text-gray-500 mt-1">
            Máximo: {selectedVariant.stock} unidades
          </p>
        </div>
      )}

      {/* Actions */}
      {product.inStock && selectedVariant && (
        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-lg w-full"
            disabled={!selectedVariant || selectedVariant.stock === 0}
          >
            {added ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Agregado al Carrito
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            className="btn btn-secondary btn-lg w-full"
            disabled={!selectedVariant || selectedVariant.stock === 0}
          >
            Comprar Ahora
          </button>
        </div>
      )}

      {/* Description */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
        <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
      </div>

      {/* SKU */}
      {selectedVariant && (
        <div className="text-sm text-gray-500">
          <span className="font-medium">SKU:</span> {selectedVariant.sku}
        </div>
      )}
    </div>
  );
}
