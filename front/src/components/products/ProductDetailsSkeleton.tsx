import React from 'react';

export function ProductDetailsSkeleton() {
  return (
    <div className="main-container max-w-6xl mx-auto p-4 pb-20 lg:pb-4 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="breadcrumb-section mb-6 hidden lg:block">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-0">
        {/* Image Gallery Skeleton */}
        <div className="lg:w-1/2">
          <div className="relative bg-gray-200 h-96 rounded-lg"></div>
          <div className="flex gap-2 mt-4">
            <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
            <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="lg:w-1/2 flex flex-col items-start">
          {/* Product Name */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>

          {/* Rating & Reviews */}
          <div className="h-5 bg-gray-200 rounded w-2/5 mb-6"></div>

          {/* Units Sold */}
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>

          {/* CheckPin Skeleton (simplified) */}
          <div className="w-full mt-0 mb-0">
            <div className="mt-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-full lg:max-w-sm p-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>

          {/* Wishlist & Compare Buttons */}
          <div className="flex flex-wrap gap-4 mt-6 w-full">
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Brand & Seller Info */}
          <div className="flex flex-col gap-3 mt-6 w-full bg-gray-100 p-4 rounded-lg">
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          </div>

          {/* Price Details */}
          <div className="flex items-center gap-3 mt-6 w-full bg-gray-100 p-4 rounded-lg">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/5"></div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-6 w-full bg-gray-100 p-4 rounded-lg">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Total Price */}
          <div className="flex items-center gap-4 mt-6 w-full bg-gray-100 p-4 rounded-lg">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Mobile Buttons Skeleton */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-100 border-t p-3 flex gap-3 z-40 shadow-lg">
        <div className="h-12 w-1/2 bg-gray-200 rounded-lg"></div>
        <div className="h-12 w-1/2 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
