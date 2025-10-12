import { getProductPageData } from "@/get-api-data/product";
import Product from "./product";
import { ProductListFilters } from "@/types/product";

interface ProductContainerProps {
  filter: ProductListFilters;
  title: string;
}

export default async function ProductContainer({
  filter,
  title,
}: ProductContainerProps) {
  const { productData, settings } = await getProductPageData(filter);

  if (!productData || productData.length === 0) {
    return null;
  }

  return <Product productData={productData} settings={settings} title={title} />;
}
