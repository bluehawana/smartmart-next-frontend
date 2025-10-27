/**
 * Product Type Definitions
 * Updated to support both UUID and numeric_id
 */

export interface Product {
  // Primary identifiers
  id: string; // UUID - keep for backward compatibility
  numeric_id?: number; // New numeric ID (optional during migration)

  // Vendor
  vendor_id: string;

  // Basic info
  name: string;
  description: string;
  sku: string;

  // Pricing
  price: number;
  compare_price?: number;

  // Organization
  category: string;
  tags: string[];

  // Media
  images: string[];

  // Inventory
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;

  // Physical properties
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  // SEO
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ProductListResponse {
  success: boolean;
  message?: string;
  data: {
    data: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface ProductDetailResponse {
  success: boolean;
  message?: string;
  data: Product;
}

export interface ProductCardData {
  id: string;
  numeric_id?: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartProduct {
  id: string;
  numeric_id?: number;
  productId: string | number; // Accept both for backward compatibility
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  comparePrice?: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductApiConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

// Type guards
export function isProduct(obj: any): obj is Product {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number'
  );
}

export function isProductListResponse(obj: any): obj is ProductListResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.success === true &&
    Array.isArray(obj.data?.data)
  );
}

export function isProductDetailResponse(obj: any): obj is ProductDetailResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.success === true &&
    isProduct(obj.data)
  );
}
