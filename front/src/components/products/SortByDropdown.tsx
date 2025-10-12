import { ProductListFilters } from "@/types/product";

interface SortByDropdownProps {
  sortBy: ProductListFilters['sortBy'];
  setSortBy: (value: ProductListFilters['sortBy']) => void;
}

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function SortByDropdown({ sortBy, setSortBy }: SortByDropdownProps) {
  return (
    <div className="flex items-center">
      <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
      <select
        id="sort-by"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as ProductListFilters['sortBy'])}        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
