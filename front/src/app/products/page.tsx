'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@/redux/useDebounce';
import { Product, ProductFilterData, ProductListFilters } from '@/types/product';
import { FilterControls } from '@/components/products/FilterControls';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SortByDropdown } from '@/components/products/SortByDropdown';
import { Pagination } from '@/components/products/Pagination';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import Link from 'next/link'; // Added import

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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 sm:mb-0">Shop All Products</h1>
          <nav className="text-sm font-medium text-gray-600">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-800">Shop</span>
              </li>
            </ol>
          </nav>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterControls filterData={filterData} onFilterChange={handleFilterChange} />

        <main className="w-full">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <p className="text-base text-gray-700 font-medium">
              {!isLoading && totalProducts > 0 && `Showing ${products.length} of ${totalProducts} products`}
              {!isLoading && totalProducts === 0 && `No products found`}
            </p>
            <SortByDropdown sortBy={filters.sortBy} setSortBy={handleSortChange} />
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center col-span-full py-20 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No Products Found</h2>
              <p className="text-lg text-gray-600">We couldn&apos;t find any products matching your criteria.</p>
              <p className="text-md text-gray-500 mt-2">Try adjusting your filters or browse other categories.</p>
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
