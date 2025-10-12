import TopBanner from "./topBanner";
import { getBannerMessages } from "@/get-api-data/topbanner";
import { getSiteSettings } from "@/get-api-data/settings";

export default async function TopBannerContainer() {
  const [messages, settings] = await Promise.all([
    getBannerMessages(),
    getSiteSettings(),
  ]);

  if (!settings.showTopBanner) {
    return null;
  }

  return (
    <TopBanner
      background={settings.bgColor}
      url={settings.bannerUrl}
      banAnimation={settings.bannerAnimation}
      messages={messages}
      heightMobile={settings.mobHeight}
      fontWeightMobile={settings.mobFtWeight}
      fontSizeMobile={settings.mobFtSize}
      fontColorMobile={settings.mobFontColor}
      heightDesktop={settings.lapHeight}
      fontWeightDesktop={settings.lapFtWeight}
      fontSizeDesktop={settings.lapFtSize}
      fontColorDesktop={settings.lapFontColor}
      boxShadowColor={settings.bgShadowColor}
    />
  );
}
