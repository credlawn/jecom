import { api } from "@/lib/fetch";
import { Category } from "@/types/category";
import { unstable_cache } from "next/cache";

export const getCategoryList = unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const response = await api("category_list.get_category_list", {
        next: { revalidate: 3600, tags: ['category-data'] }, 
      });

      if (!response.ok) throw new Error("Failed to fetch category list");

      const data = await response.json();
      return data.message || [];

    } catch (error) {
      console.error("Error fetching category list:", error);
      return [];
    }
  },
  
  ['category-list'],
  { tags: ['category-data'] }
);
