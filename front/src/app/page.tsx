

import HeroContainer from "@/components/header/hero-section";
import CategoryContainer from "@/components/home/category";
import ProductContainer from "@/components/home/product";

export default function Page() {
  return (
    <div>
      <HeroContainer />
      <CategoryContainer />
      <ProductContainer filter={{ featured: 1, pageSize: 20, sortBy: 'latest' }} title="Featured Products" />
      <ProductContainer filter={{ featured: 0, pageSize: 20, sortBy: 'latest' }} title="New Arrivals" />
    </div>
  );
}
