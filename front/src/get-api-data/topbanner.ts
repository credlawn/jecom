
import { api } from "@/lib/fetch";
import { BannerMessage } from "@/types/topbanner";
import { unstable_cache } from "next/cache";

export const getBannerMessages = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const response = await api("banner_message.get_banner_message", {
        next: { revalidate: 3600, tags: ['banner-messages'] },
      });

      if (!response.ok) throw new Error("Failed to fetch banner messages");

      const data = await response.json();
      const messagesArray: BannerMessage[] = data?.message || [];

      return messagesArray
        .map((msg) => msg.bannerMessage)
        .filter((msg) => msg && msg.trim() !== "");
    } catch (error) {
      console.error("getBannerMessages failed:", error);
      return [];
    }
  },
  ["banner-messages"],
  { tags: ['banner-messages'] }
);