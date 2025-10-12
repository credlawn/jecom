import Hero from "./hero";
import { getHeroDetails } from "@/get-api-data/hero";
import { getSiteSettings } from "@/get-api-data/settings";

export default async function HeroContainer() {
  const [heroData, settings] = await Promise.all([
    getHeroDetails(),
    getSiteSettings(),
  ]);

  return (
    <Hero
      heroData={heroData}
      settings={settings}
    />
  );
}
