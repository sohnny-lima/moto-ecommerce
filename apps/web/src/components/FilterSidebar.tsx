'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Brand, Category } from '../lib/api';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  brands: Brand[];
  categories: Category[];
  colors: string[];
  currentFilters: {
    q?: string;
    brand?: string;
    category?: string;
    color?: string;
    min?: string;
    max?: string;
  };
}

export default function FilterSidebar({
  brands,
  categories,
  colors,
  currentFilters,
}: FilterSidebarProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(currentFilters);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/catalogo?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({});
    router.push('/catalogo');
  };

  const hasActiveFilters = Object.values(currentFilters).some((v) => v);

  return (
    <div className="card p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            id="search"
            className="input text-sm"
            placeholder="Nombre del producto..."
            value={filters.q || ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
          />
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <select
            id="brand"
            className="input text-sm"
            value={filters.brand || ''}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            id="category"
            className="input text-sm"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <select
            id="color"
            className="input text-sm"
            value={filters.color || ''}
            onChange={(e) => handleFilterChange('color', e.target.value)}
          >
            <option value="">Todos los colores</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de Precio
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              className="input text-sm"
              value={filters.min || ''}
              onChange={(e) => handleFilterChange('min', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="input text-sm"
              value={filters.max || ''}
              onChange={(e) => handleFilterChange('max', e.target.value)}
            />
          </div>
        </div>

        {/* Apply Button */}
        <button onClick={applyFilters} className="btn btn-primary w-full">
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}
