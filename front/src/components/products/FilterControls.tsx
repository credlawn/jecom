import { ProductFilterData, ProductListFilters } from "@/types/product";
import { useState, useEffect } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
    return <aside className="w-full lg:w-1/4 p-4"><div className="animate-pulse">Loading filters...</div></aside>;
  }

  const filteredBrands = filterData.brands.filter(brand =>
    brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-1/4 p-4 bg-gray-50 rounded-lg self-start">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-indigo-600">Clear All</button>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Category</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filterData.categories.map((category) => (
            <label key={category} className="flex items-center">
              <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="ml-3 text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Brand</h3>
        <input
          type="text"
          placeholder="Search brands..."
          className="w-full p-2 mb-2 border rounded"
          onChange={(e) => setBrandSearchTerm(e.target.value)}
        />
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredBrands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="ml-3 text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6 px-2">
        <h3 className="font-semibold mb-2">Price</h3>
        <Slider
          range
          min={0}
          max={filterData.maxPrice}
          value={[priceRange.min, priceRange.max]}
          onChange={handlePriceChange}
          allowCross={false}
        />
        <div className="flex justify-between text-gray-500 text-sm mt-2">
          <span>${priceRange.min}</span>
          <span>${priceRange.max}</span>
        </div>
      </div>
    </aside>
  );
}
