import { api } from "@/lib/fetch";
import { HeroItem } from "@/types/hero";
import { unstable_cache } from "next/cache";

export const getHeroDetails = unstable_cache(
  async (): Promise<HeroItem[]> => {
    try {
      const response = await api("hero_section.get_hero_details", {
        next: { revalidate: 3600, tags: ['hero-data'] }, 
      });

      if (!response.ok) throw new Error("Failed to fetch hero details");

      const data = await response.json();
      const messages: HeroItem[] = data.message || [];

      return messages;
    } catch (error) {
      console.error("Error fetching hero details:", error);
      return [];
    }
  },
  ['hero-details'],
  { tags: ['hero-data'] }
);