import { SiteSettings } from "./settings";

export interface HeroItem {
  heroTitle: string;
  heroSubtitle: string;
  priceText: string;
  price: string;
  heroImage: string;
  imageAlt: string;
  heroUrl: string;
  buttonText: string;
}

export interface HeroProps {
  heroData: HeroItem[];
  settings: SiteSettings;
}