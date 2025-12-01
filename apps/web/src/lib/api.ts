import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Variant {
  id: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  brand: Brand;
  category: Category;
  variants?: Variant[];
  availableColors?: string[];
  totalStock?: number;
  inStock?: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  success: boolean;
  data: {
    product: Product;
    related: Product[];
  };
}

export interface CheckoutRequest {
  userId: string;
  items: {
    variantId: string;
    quantity: number;
  }[];
  shippingCost: number;
  backUrls?: {
    success: string;
    failure: string;
    pending: string;
  };
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    orderId: string;
    paymentId: string;
    checkoutUrl: string;
    total: number;
    status: string;
  };
}

// API Functions
export const productsApi = {
  getAll: async (params?: {
    q?: string;
    brand?: string;
    category?: string;
    color?: string;
    min?: number;
    max?: number;
    page?: number;
    size?: number;
    sortBy?: 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get<ProductsResponse>('/api/products', { params });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<ProductDetailResponse>(`/api/products/${slug}`);
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get<{ success: boolean; data: Brand[] }>('/api/products/filters/brands');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<{ success: boolean; data: Category[] }>('/api/products/filters/categories');
    return response.data;
  },

  getColors: async () => {
    const response = await api.get<{ success: boolean; data: string[] }>('/api/products/filters/colors');
    return response.data;
  },
};

export const checkoutApi = {
  create: async (data: CheckoutRequest) => {
    const response = await api.post<CheckoutResponse>('/api/checkout', data);
    return response.data;
  },
};
