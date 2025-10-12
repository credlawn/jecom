import Image from "next/image";
import { LogoProps } from "@/types/logo";

export const Logo = ({ logoUrl }: LogoProps) => {
  return (
    <div className="h-[36px] w-[120px] relative">
      <Image
        alt="wow-logo"
        fill
        sizes="120px"
        className="object-contain"
        src={logoUrl || "/images/placeholder.png"}
        priority={true}
      />
    </div>
  );
};

export const LogoSidebar = ({ logoUrl }: LogoProps) => (
  <div className="w-[100px] h-[48px] relative">
    <Image
      alt="wow-logo"
      fill
      sizes="100px"
      className="object-contain"
      src={logoUrl || "/images/placeholder.png"}
      priority={false}
    />
  </div>
);

export const LogoMobile = ({ logoUrl }: LogoProps) => (
  <div className="h-[68px] w-[142px] relative">
    <Image
      alt="wow-logo"
      fill
      sizes="142px"
      className="object-contain"
      src={logoUrl || "/images/placeholder.png"}
      priority={false}
    />
  </div>
);