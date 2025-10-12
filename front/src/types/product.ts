export interface Product {
  name: string;
  productName: string;
  brandName: string;
  unit: string;
  minPurchaseQty: number;
  discountType: string | null;
  discountPercent: number;
  discountAmount: number;
  price: string; // Formatted as string from API
  discountedPrice: string; // Formatted as string from API
  stock: number;
  productSlug: string;
  productTag: string | null;
  productRating: number;
  ratingCount: number;
  ndText: string | null;
  featured: boolean;
  unlisted: boolean;
  productImage1: string;
  productImage2: string;
  productCategory: string[];
  shortDescription?: string;
  unitsSold?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface SingleProduct {
  id: string;
  productName: string;
  brandName: string;
  price: number;
  discountedPrice: number;
  discountType: string | null;
  discountPercent: number;
  discountAmount: number;
  stock: number;
  minPurchaseQty: number;
  productRating: number;
  ratingCount: number;
  reviewCount: number;
  unitsSold: number;
  productSlug: string;
  productImage1: string;
  productImages: string[];
  productTag: string | null;
  shortDescription: string | null;
  description: string | null;
  unit: string | null;
  featured: boolean;
  categories: ProductCategory[];
  currency: string;
}

export interface ProductFilterData {
  brands: string[];
  categories: string[];
  maxPrice: number;
}

export interface PaginatedProductResponse {
  products: Product[];
  totalProducts: number;
}

export interface ProductListFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'latest' | 'price_asc' | 'price_desc';
  pageNum?: number;
  pageSize?: number;
  featured?: number;
}
