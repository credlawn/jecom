import { api } from "@/lib/fetch";
import { unstable_cache } from "next/cache";

export const getSiteSettings = unstable_cache(
  async () => {
    try {
      const response = await api("site_settings.get_site_settings", {
        next: { revalidate: 3600, tags: ['site-settings'] }, 
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data?.message || {};
    } catch (error) {
      console.error("Error fetching site settings:", error);
      return {};
    }
  },
  ["site-settings"],
  { tags: ['site-settings'] }
);