export interface BannerMessage {
  bannerMessage: string;
}

export interface TopBannerProps {
  messages?: string[];
  showBanner?: number;
  url?: string;
  background?: string;
  boxShadowColor?: string;
  banAnimation?: string;
  heightMobile?: string;
  heightDesktop?: string;
  fontWeightMobile?: number;
  fontWeightDesktop?: number;
  fontSizeMobile?: number;
  fontSizeDesktop?: number;
  fontColorMobile?: string;
  fontColorDesktop?: string;
}