import type { Product } from "@/types/product";
import { SiteSettings } from "@/types/settings";
import ProductCard from "./productCard";

interface ProductGridProps {
  productData: Product[];
  settings: SiteSettings;
  title: string;
}

export default function Product({ productData, settings, title }: ProductGridProps) {
  const {
    currency,
    button1Color: btn1Color,
    button1TextColor: bt1Color,
    button2Color: btn2Color,
    button2TextColor: bt2Color,
  } = settings;

  return (
    <section className="w-full px-0 py-2">
      <div className="border border-gray-200 rounded-md px-0 py-2">
        <h2 className="text-lg font-semibold mb-4 px-4 ">{title}</h2>

        {/* Mobile View: 2-up Grid */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-0.5 w-full px-1">
            {productData.length === 0 ? (
              <p className="text-neutral-900 py-4 col-span-2 text-center">
                No products available.
              </p>
            ) : (
              productData.map((p) => (
                <ProductCard
                  key={p.name}
                  product={p}
                  currency={currency}
                  btn1Color={btn1Color}
                  bt1Color={bt1Color}
                  btn2Color={btn2Color}
                  bt2Color={bt2Color}
                />
              ))
            )}
          </div>
        </div>

        {/* Desktop View: Scrollable Flex */}
        <div className="hidden md:block">
          <div
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          >
            <div className="lg:flex-1 min-w-[50px]" aria-hidden="true"></div>

            {productData.map((p) => (
              <div
                key={p.name}
                className="flex-shrink-0 w-62"
              >
                <ProductCard
                  product={p}
                  currency={currency}
                  btn1Color={btn1Color}
                  bt1Color={bt1Color}
                  btn2Color={btn2Color}
                  bt2Color={bt2Color}
                />
              </div>
            ))}

            <div className="lg:flex-1 min-w-[50px]" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
}