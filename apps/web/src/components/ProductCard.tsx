'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '../lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = imageError ? '/placeholder.png' : (product.images[0] || '/placeholder.png');

  return (
    <Link href={`/producto/${product.slug}`} className="group">
      <div className="card overflow-hidden transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-sm text-gray-500 mb-1">{product.brand.name}</p>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Category */}
          <p className="text-xs text-gray-400 mb-3">{product.category.name}</p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                S/ {product.price.toFixed(2)}
              </p>
            </div>

            {/* Colors */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">
                  {product.availableColors.length} {product.availableColors.length === 1 ? 'color' : 'colores'}
                </span>
              </div>
            )}
          </div>

          {/* Stock Info */}
          {product.inStock && product.totalStock && (
            <p className="text-xs text-gray-500 mt-2">
              {product.totalStock} {product.totalStock === 1 ? 'unidad' : 'unidades'} disponibles
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
