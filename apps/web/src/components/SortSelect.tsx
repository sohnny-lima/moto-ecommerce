'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  defaultValue?: string;
}

export default function SortSelect({ defaultValue = 'createdAt-desc' }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    router.push(`/catalogo?${params.toString()}`);
  };

  return (
    <select
      className="input py-2 text-sm"
      defaultValue={defaultValue}
      onChange={handleChange}
    >
      <option value="createdAt-desc">Más recientes</option>
      <option value="createdAt-asc">Más antiguos</option>
      <option value="price-asc">Precio: Menor a Mayor</option>
      <option value="price-desc">Precio: Mayor a Menor</option>
    </select>
  );
}

