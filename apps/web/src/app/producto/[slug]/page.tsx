'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productsApi } from '../../../lib/api';
import ProductGallery from '../../../components/ProductGallery';
import ProductInfo from '../../../components/ProductInfo';
import ProductCard from '../../../components/ProductCard';
import Link from 'next/link';
import type { Product } from '../../../lib/api';

export default function ProductoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const response = await productsApi.getBySlug(slug);
        setProduct(response.data.product);
        setRelated(response.data.related || []);
        setError(null);
      } catch (err: any) {
        console.error('Error loading product:', err);
        setError('No se pudo cargar el producto');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Producto no encontrado
          </h1>
          <p className="text-gray-600 mb-8">{error || 'El producto que buscas no existe'}</p>
          <Link href="/catalogo" className="btn btn-primary">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/catalogo" className="hover:text-primary-600">Catálogo</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Info */}
          <div>
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
