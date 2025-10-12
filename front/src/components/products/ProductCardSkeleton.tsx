export function ProductCardSkeleton() {
  return (
    <div className="group flex-shrink-0 rounded-md border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-full flex flex-col">
        {/* Image Skeleton */}
        <div className="relative bg-gray-300" style={{ height: "200px" }}></div>
        
        <div className="flex flex-col p-4 flex-grow justify-between">
          <div>
            {/* Title Skeleton (2 lines) */}
            <div className="h-5 bg-gray-300 rounded w-4/5 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-3/5 mb-4"></div>

            {/* Rating & Review Count Skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-4 w-12 bg-gray-300 rounded"></div>
            </div>
          </div>

          <div className="mt-auto">
            {/* Short Description Skeleton (2 lines) */}
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6 mb-4"></div>

            {/* Price Skeleton */}
            <div className="flex items-baseline gap-2">
              <div className="h-6 w-24 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
