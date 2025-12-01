import { Suspense } from 'react';
import { productsApi } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';
import SortSelect from '../../components/SortSelect';

interface SearchParams {
  q?: string;
  brand?: string;
  category?: string;
  color?: string;
  min?: string;
  max?: string;
  page?: string;
  sortBy?: 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const size = 12;

  // Fetch products with filters
  const productsResponse = await productsApi.getAll({
    q: params.q,
    brand: params.brand,
    category: params.category,
    color: params.color,
    min: params.min ? parseFloat(params.min) : undefined,
    max: params.max ? parseFloat(params.max) : undefined,
    page,
    size,
    sortBy: params.sortBy || 'createdAt',
    sortOrder: params.sortOrder || 'desc',
  });

  const { data: products, pagination } = productsResponse;

  // Fetch filter options
  const [brandsResponse, categoriesResponse, colorsResponse] = await Promise.all([
    productsApi.getBrands(),
    productsApi.getCategories(),
    productsApi.getColors(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Catálogo de Motocicletas
          </h1>
          <p className="text-gray-600">
            {pagination.total} {pagination.total === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div>Cargando filtros...</div>}>
              <FilterSidebar
                brands={brandsResponse.data}
                categories={categoriesResponse.data}
                colors={colorsResponse.data}
                currentFilters={params}
              />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Página {pagination.page} de {pagination.totalPages}
              </p>
              <SortSelect
                defaultValue={`${params.sortBy || 'createdAt'}-${params.sortOrder || 'desc'}`}
              />
            </div>

            {/* Products */}
            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-4">
                  No se encontraron productos con los filtros seleccionados
                </p>
                <a href="/catalogo" className="btn btn-primary">
                  Ver Todos los Productos
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    {/* Previous */}
                    {pagination.page > 1 && (
                      <a
                        href={`/catalogo?${new URLSearchParams({ ...params, page: String(pagination.page - 1) }).toString()}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Anterior
                      </a>
                    )}

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <a
                          key={pageNum}
                          href={`/catalogo?${new URLSearchParams({ ...params, page: String(pageNum) }).toString()}`}
                          className={`btn btn-sm ${
                            pageNum === pagination.page
                              ? 'btn-primary'
                              : 'btn-secondary'
                          }`}
                        >
                          {pageNum}
                        </a>
                      );
                    })}

                    {/* Next */}
                    {pagination.page < pagination.totalPages && (
                      <a
                        href={`/catalogo?${new URLSearchParams({ ...params, page: String(pagination.page + 1) }).toString()}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Siguiente
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
