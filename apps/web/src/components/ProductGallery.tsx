'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const displayImages = images.length > 0 ? images : ['/placeholder.png'];

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (index: number) => {
    return imageErrors[index] ? '/placeholder.png' : displayImages[index];
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={getImageSrc(selectedImage)}
          alt={`${productName} - Imagen ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
          loading="eager"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => handleImageError(selectedImage)}
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                ? 'border-primary-600'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <Image
                src={getImageSrc(index)}
                alt={`${productName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
