import { getCategoryList } from "@/get-api-data/category";
import { getSiteSettings } from "@/get-api-data/settings";
import Category from "./category";

export default async function CategoryContainer() {
  const [categoryData, settings] = await Promise.all([
    getCategoryList(),
    getSiteSettings(),
  ]);

  if (!categoryData || categoryData.length === 0) {
    return null;
  }

  return (
    <Category
      categoryData={categoryData}
      settings={settings}
    />
  );
}
