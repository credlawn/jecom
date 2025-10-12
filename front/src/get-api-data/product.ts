import { api } from "@/lib/fetch";
import {
  PaginatedProductResponse,
  ProductFilterData,
  ProductListFilters,
  SingleProduct,
  Product
} from "@/types/product";
import { getSiteSettings } from "./settings";

export const getProductList = async (
  filters: ProductListFilters = {}
): Promise<PaginatedProductResponse> => {
  try {
    const response = await api("product_list.get_product_list", {
      method: "POST",
      body: JSON.stringify(filters),
      next: { revalidate: 3600, tags: ["product-data"] },
    });

    if (!response.ok) throw new Error("Failed to fetch product list");

    const data = await response.json();
    return data.message || { products: [], totalProducts: 0 };
  } catch (error) {
    console.error("Error fetching product list:", error);
    return { products: [], totalProducts: 0 };
  }
};

export const getFilterData = async (): Promise<ProductFilterData | null> => {
  try {
    const response = await api("product_filters.get_filter_data", {
      next: { tags: ["product-data"] },
    });
    if (!response.ok) throw new Error("Failed to fetch filter data");
    const data = await response.json();
    return data.message || null;
  } catch (error) {
    console.error("Error fetching filter data:", error);
    return null;
  }
};

export const getProductBySlug = async (
  slug: string
): Promise<SingleProduct | object> => {
  if (!slug) return {};
  try {
    const response = await api(
      `single_product.get_product_by_slug?slug=${slug}`,
      {
        next: { revalidate: 3600, tags: [`product-data`, `product-${slug}`] },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.message || {};
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return {};
  }
};

export const getProductPageData = async (filter: ProductListFilters = {}) => {
  const [productResponse, settings] = await Promise.all([
    getProductList(filter),
    getSiteSettings(),
  ]);
  
  return { productData: productResponse.products, settings };
}

export const getProductSlugs = async (limit: number = 1000): Promise<{ slug: string }[]> => {
  try {
    const response = await api("product_list.get_product_list", {
      method: "POST",
      body: JSON.stringify({ limit }),
      next: { revalidate: 3600, tags: ["product-data"] },
    });

    if (!response.ok) throw new Error("Failed to fetch product slugs");

    const data = await response.json();
    return (data.message?.products || []).map((p: Product) => ({ slug: p.productSlug }));
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
};
