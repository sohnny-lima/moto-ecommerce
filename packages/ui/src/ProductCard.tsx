import React from 'react';
import { PriceBadge } from './PriceBadge';
import { Button } from './Button';

export interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  colors?: string[];
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  href?: string;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  brand,
  price,
  originalPrice,
  image,
  colors = [],
  inStock = true,
  rating,
  reviewCount,
  onAddToCart,
  onViewDetails,
  href,
  className = '',
}) => {
  const CardWrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className={`
        group relative bg-white rounded-xl shadow-md hover:shadow-2xl
        transition-all duration-300 overflow-hidden cursor-pointer
        ${className}
      `}
    >
      {/* Imagen */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badge de descuento */}
        {originalPrice && originalPrice > price && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </div>
        )}

        {/* Badge de stock */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-gray-900 px-4 py-2 rounded-lg">
              Agotado
            </span>
          </div>
        )}

        {/* Overlay con botones (hover) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {onViewDetails && (
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewDetails();
              }}
            >
              Ver detalles
            </Button>
          )}
          {onAddToCart && inStock && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
            >
              🛒 Agregar
            </Button>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Marca */}
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
          {brand}
        </p>

        {/* Nombre */}
        <h3 className="font-semibold text-lg mt-1 text-gray-900 line-clamp-2 min-h-[3.5rem]">
          {name}
        </h3>

        {/* Rating */}
        {rating !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviewCount !== undefined && (
              <span className="text-sm text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Colores disponibles */}
        {colors.length > 0 && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {colors.slice(0, 4).map((color, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {color}
              </span>
            ))}
            {colors.length > 4 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Precio */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <PriceBadge
            price={price}
            originalPrice={originalPrice}
            size="md"
          />
        </div>
      </div>
    </CardWrapper>
  );
};

export default ProductCard;

