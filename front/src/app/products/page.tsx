'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@/redux/useDebounce';
import { Product, ProductFilterData, ProductListFilters } from '@/types/product';
import { FilterControls } from '@/components/products/FilterControls';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SortByDropdown } from '@/components/products/SortByDropdown';
import { Pagination } from '@/components/products/Pagination';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';

const PAGE_SIZE = 9;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filterData, setFilterData] = useState<ProductFilterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<Omit<ProductListFilters, 'pageNum' | 'pageSize'>>({
    sortBy: 'latest',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/products/filter-data');
        const initialFilterData = await response.json();
        setFilterData(initialFilterData);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filterPayload = {
          ...debouncedFilters,
          pageNum: currentPage,
          pageSize: PAGE_SIZE,
        };

        console.log("Fetching products with filters:", filterPayload);

        const response = await fetch('/api/products', {
          method: 'POST',
          body: JSON.stringify(filterPayload),
        });
        const productResponse = await response.json();
        setProducts(productResponse.products);
        setTotalProducts(productResponse.totalProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [debouncedFilters, currentPage]);

  const handleFilterChange = useCallback((newFilters: Partial<Omit<ProductListFilters, 'pageNum' | 'pageSize'>>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handleSortChange = useCallback((sortBy: ProductListFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">Shop</h1>
          <div className="text-sm text-gray-500">
            <span>Home</span> / <span>Shop</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterControls filterData={filterData} onFilterChange={handleFilterChange} />

        <main className="w-full">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {!isLoading && `Showing ${products.length} of ${totalProducts} products`}
            </p>
            <SortByDropdown sortBy={filters.sortBy} setSortBy={handleSortChange} />
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center col-span-full py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h2>
              <p className="text-gray-500">Try adjusting your filters to find what you&apos;re looking for.</p>
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <div className="mt-8">
              <Pagination 
                currentPage={currentPage}
                totalProducts={totalProducts}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
