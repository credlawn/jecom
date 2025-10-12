"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import WishlistIcon from "@/components/wishlist/WishlistIcon";
import AddToCartIcon from "@/components/cart/AddToCartIcon";
import StarRating from "@/components/star-rating/starRating";



interface ProductCardProps {
  product: Product;
  currency?: string;
  btn1Color?: string;
  bt1Color?: string;
  btn2Color?: string;
  bt2Color?: string;
}

const formatInr = (
  num: number,
  { showDecimal = false }: { showDecimal?: boolean } = {},
): string => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: showDecimal ? 2 : 0,
    maximumFractionDigits: showDecimal ? 2 : 0,
    useGrouping: true,
  }).format(num);
};

export default function ProductCard({
  product,
  currency = "₹ ",

}: ProductCardProps) {
  const router = useRouter();
  const priceAsNumber = product.price ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : 0;
  const discountedPriceAsNumber = product.discountedPrice ? parseFloat(product.discountedPrice.replace(/[^0-9.]/g, '')) : 0;

  const p = {
    id: product.name,
    title: product.productName || "Untitled Product",
    rating: Math.max(0, Math.min(5, product.productRating || 0)),
    ratingCount: product.ratingCount || 0,
    discountPercent: product.discountPercent || 0,
    price: discountedPriceAsNumber || priceAsNumber,
    oldPrice: (discountedPriceAsNumber && priceAsNumber && discountedPriceAsNumber < priceAsNumber) ? priceAsNumber : 0,
    imageDefault: product.productImage1 || "/images/placeholder.jpg",
    imageHover: product.productImage2 || product.productImage1 || "/images/placeholder.jpg",
    slug: product.productSlug || "#",
    altText: product.productName || product.productSlug || "Product image",
    ndText: product.ndText || "",
    unitsSold: product.unitsSold || 0,
    shortDescription: product.shortDescription || "",
    stock: product.stock || 0,
  };

  const mobileImageHeight = 140;

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden group block border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] h-[320px] relative flex flex-col">
        <div className="cursor-pointer" onClick={() => router.push(`/products/${p.slug}`)}>
          <div className="relative bg-white pt-4" style={{ height: mobileImageHeight }}>
            <Image
              src={p.imageDefault}
              alt={p.altText}
              fill
              className="object-cover mx-0.5 my-0.5 transition-transform duration-300 group-hover:opacity-0 group-hover:scale-110"
              sizes="50vw"
              style={{ padding: "1px" }}
            />
            <Image
              src={p.imageHover}
              alt={p.altText}
              fill
              className="object-cover absolute inset-0 opacity-0 transition-transform duration-300 group-hover:opacity-100 group-hover:scale-105"
              sizes="50vw"
              style={{ padding: "1px" }}
            />
            </div>          
            <div className="flex flex-col p-2" style={{ height: `calc(100% - ${mobileImageHeight}px)` }}>
            <h3 className="mb-1" style={{ minHeight: "2.8em", lineHeight: "1.4em" }}>
              <span
                className="text-natural-900 text-[14px] font-light tracking-wide capitalize line-clamp-2 group-hover:text-neutral-900 block"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {p.title}
              </span>
            </h3>
            <div className="flex items-center gap-1 mb-1 select-none">
              <span
                className="bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded"
                style={{ fontSize: "13px", lineHeight: 1 }}
              >
                {p.rating.toFixed(1)} ★
              </span>
              <span className="text-sm font-semibold text-gray-500 ml-1">
                ({p.ratingCount})
              </span>
            </div>
            <div className="flex items-center gap-1 text-[14px] text-neutral-900 mt-1">
              <p className="font-bold">
                {currency}
                {formatInr(p.price)}
              </p>
              {p.oldPrice > 0 && p.discountPercent > 0 && (
                <del className="text-gray-400 ml-1">
                  {currency}
                  {formatInr(p.oldPrice)}
                </del>
              )}
            </div>
            <span className="text-green-600 text-sm font-medium mt-1">
              {p.discountPercent > 0
                ? `${p.discountPercent.toFixed(0)}% Instant off`
                : p.ndText}
            </span>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 z-10 flex gap-3">
          <WishlistIcon productId={product.name} />
          <AddToCartIcon productId={product.name} stock={p.stock} />
        </div>
      </div>

      {/* Desktop View */}
      <div 
        className="hidden md:block group flex-shrink-0 rounded-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg relative"
      >
          <div className="cursor-pointer h-full flex flex-col" onClick={() => router.push(`/products/${p.slug}`)}>
              <div className="relative bg-white p-4" style={{ height: "200px" }}>
                  <Image
                      src={p.imageDefault}
                      alt={p.altText}
                      fill
                      className="object-contain transition-transform duration-300"
                      sizes="240px"
                      
                  />
                  <Image
                      src={p.imageHover}
                      alt={p.altText}
                      fill
                      className="object-contain mx-0.5 my-0.5 absolute inset-0 opacity-0 transition-transform duration-300"
                      sizes="240px"
                      
                  />
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <WishlistIcon productId={product.name} />
                  </div>
                  <div className="absolute top-14 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AddToCartIcon productId={product.name} stock={p.stock} />
                  </div>
                  {(p.stock === 0 || (p.stock > 0 && p.stock <= 10)) && (
                    <div className="absolute top-3 left-1 z-10 bg-red-500 text-white text-[12px] font-semibold pt-0.5 pl-1 pr-1 pb-0.5 s rounded-md">
                      {p.stock === 0 ? "Out of Stock" : "Only few left"}
                    </div>
                  )}
              </div>
              <div className="flex flex-col p-4 flex-grow justify-between"> {/* Added justify-between here */}
                  <div> {/* Wrapper for title and rating */}
                      <h2 className="mb-2">
                          <span
                              className="text-[14px] font-medium text-neutral-700 tracking-wide capitalize line-clamp-2 group-hover:text-neutral-900 block w-full"
                              style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  minHeight: "2.8em",
                                  lineHeight: "1.4em",
                              }}
                          >
                              {p.title}
                          </span>
                      </h2>
                      <div className="flex items-center gap-1 mb-2 text-sm text-gray-600 select-none"> 
                          <StarRating rating={p.rating} fullColor="#EF4444" emptyColor="#d1d5db" size={14} gap={3}  />
                          <span className="text-xs font-semibold text-gray-500 ml-2">
                              ({p.ratingCount}) 
                          </span>
                          {p.unitsSold > 0 && ( 
                            <span className="text-sm font-semibold text-gray-500 ml-2">
                              | {p.unitsSold} sold
                            </span>
                          )}
                      </div>
                  </div>

                  
                  <div className="mt-auto relative"> 
                      <div className="flex items-baseline gap-2 mb-2"> 
                          <p className="text-sm font-bold text-gray-900">
                              {currency}
                              {formatInr(p.price)}
                          </p>
                          {p.oldPrice > 0 && p.discountPercent > 0 && (
                              <del className="text-gray-500 text-sm">
                                  {currency}
                                  {formatInr(p.oldPrice)}
                              </del>
                          )}
                          <span className="ml-auto text-sm font-medium">
                            {p.discountPercent > 0 ? (
                              <span className="text-green-600">-{p.discountPercent.toFixed(0)}% Off</span>
                            ) : p.ndText ? (
                              <span className="text-gray-600">{p.ndText}</span>
                            ) : null}
                          </span>
                      </div>
                      {p.shortDescription && ( // Display shortDescription if available
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{p.shortDescription}</p>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}
