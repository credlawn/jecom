import { ProductFilterData, ProductListFilters } from "@/types/product";
import { useState, useEffect } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FilterControlsSkeleton } from './FilterControlsSkeleton'; // Added import

interface FilterControlsProps {
  filterData: ProductFilterData | null;
  onFilterChange: (filters: Partial<Omit<ProductListFilters, 'pageNum' | 'pageSize'>>) => void;
}

export function FilterControls({ filterData, onFilterChange }: FilterControlsProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [brandSearchTerm, setBrandSearchTerm] = useState('');

  useEffect(() => {
    if (filterData) {
      setPriceRange({ min: 0, max: filterData.maxPrice });
    }
  }, [filterData]);

  useEffect(() => {
    onFilterChange({
      category: selectedCategories.join(",") || undefined,
      brand: selectedBrands.join(",") || undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  }, [selectedCategories, selectedBrands, priceRange, onFilterChange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange({ min: value[0], max: value[1] });
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    if (filterData) {
      setPriceRange({ min: 0, max: filterData.maxPrice });
    }
  };

  if (!filterData) {
    return <FilterControlsSkeleton />;
  }
  const filteredBrands = filterData.brands.filter(brand =>
    brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-1/4 p-4 bg-white rounded-lg shadow-md self-start">
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">Clear All</button>
      </div>

      <div className="pb-4 mb-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {filterData.categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer hover:text-gray-900 transition-colors duration-200">
              <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-3 text-gray-700 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pb-4 mb-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-3">Brand</h3>
        <input
          type="text"
          placeholder="Search brands..."
          className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          onChange={(e) => setBrandSearchTerm(e.target.value)}
        />
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {filteredBrands.map((brand) => (
            <label key={brand} className="flex items-center cursor-pointer hover:text-gray-900 transition-colors duration-200">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-3 text-gray-700 text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="px-2">
        <h3 className="font-semibold text-gray-700 mb-3">Price</h3>
        <Slider
          range
          min={0}
          max={filterData.maxPrice}
          value={[priceRange.min, priceRange.max]}
          onChange={handlePriceChange}
          allowCross={false}
          trackStyle={[{ backgroundColor: '#3B82F6' }]} // blue-500
          handleStyle={[{ borderColor: '#3B82F6' }, { borderColor: '#3B82F6' }]}
          railStyle={{ backgroundColor: '#E5E7EB' }} // gray-200
        />
        <div className="flex justify-between text-gray-700 text-sm mt-3 font-medium">
          <span>${priceRange.min.toFixed(0)}</span>
          <span>${priceRange.max.toFixed(0)}</span>
        </div>
      </div>
    </aside>
  );
}
