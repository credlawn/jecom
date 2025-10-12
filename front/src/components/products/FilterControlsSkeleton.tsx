import React from 'react';

export function FilterControlsSkeleton() {
  return (
    <aside className="w-full lg:w-1/4 p-4 bg-white rounded-lg shadow-md self-start animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div> {/* Filters title */}
        <div className="h-4 bg-gray-200 rounded w-1/6"></div> {/* Clear All button */}
      </div>

      {/* Category Section */}
      <div className="pb-4 mb-4 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div> {/* Category title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      {/* Brand Section */}
      <div className="pb-4 mb-4 border-b border-gray-200">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div> {/* Brand title */}
        <div className="h-8 bg-gray-200 rounded w-full mb-3"></div> {/* Search input */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      {/* Price Section */}
      <div className="px-2">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div> {/* Price title */}
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div> {/* Slider track */}
        <div className="flex justify-between text-sm mt-3">
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    </aside>
  );
}
