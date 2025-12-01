import React from 'react';

export interface PriceBadgeProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscount?: boolean;
  className?: string;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  price,
  originalPrice,
  currency = 'S/',
  size = 'md',
  showDiscount = true,
  className = '',
}) => {
  // Calcular descuento
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizes = {
    sm: {
      price: 'text-base',
      original: 'text-xs',
      currency: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      price: 'text-xl',
      original: 'text-sm',
      currency: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      price: 'text-2xl',
      original: 'text-base',
      currency: 'text-base',
      badge: 'text-sm px-2 py-1',
    },
    xl: {
      price: 'text-4xl',
      original: 'text-lg',
      currency: 'text-lg',
      badge: 'text-base px-3 py-1',
    },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Precio actual */}
      <div className="flex items-baseline gap-1">
        <span className={`text-gray-600 font-medium ${sizes[size].currency}`}>
          {currency}
        </span>
        <span className={`font-bold text-gray-900 ${sizes[size].price}`}>
          {price.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Precio original (tachado) */}
      {hasDiscount && (
        <div className="flex items-baseline gap-1">
          <span className={`text-gray-400 line-through ${sizes[size].original}`}>
            {currency} {originalPrice.toLocaleString('es-PE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      )}

      {/* Badge de descuento */}
      {hasDiscount && showDiscount && (
        <span className={`
          bg-red-500 text-white font-bold rounded-full
          ${sizes[size].badge}
        `}>
          -{discountPercentage}%
        </span>
      )}
    </div>
  );
};

export default PriceBadge;

