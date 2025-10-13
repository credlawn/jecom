"use client";

import { useState } from "react";
import Link from "next/link";
import { SingleProduct } from "@/types/product";
import ProductGallery from "./ProductGallery";
import StarRating from "@/components/star-rating/starRating";
import CheckPin from "./checkPin";
import WishlistButton from "@/components/wishlist/WishlistButton";
import CartButton from "@/components/cart/CartButton";
import { motion } from "framer-motion";
import { SiteSettings } from "@/types/settings";
import { Button } from "@/ui/button";

export default function ProductContent({
  product,
  settings,
}: {
  product: SingleProduct;
  settings: SiteSettings; 
}) {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const discountPercent = product.price
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="main-container max-w-7xl mx-auto p-4 pb-20 lg:pb-4"
    >
      {/* Breadcrumb */}
      <div className="breadcrumb-section mb-6 hidden lg:block">
        <nav className="text-sm text-gray-500">
          <ul className="flex gap-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-neutral-900 transition-colors duration-200">
                Home
              </Link>
            </li>

            {product.categories?.slice(0, 2).map((cat) => (
              <li key={cat.id} className="flex items-center gap-2">
                <span className="text-gray-400">{">"}</span>
                <Link
                  href={`/category/${cat.id}`}
                  className="hover:text-neutral-900 transition-colors duration-200"
                >
                  {cat.name}
                </Link>
              </li>
            ))}

            <li>
              <span className="text-gray-400">{">"}</span>
            </li>
            <li className="text-neutral-900 font-medium">{product.productName}</li>
          </ul>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-0">
        {/* Image Gallery Section */}
        <motion.div 
          variants={slideUp} 
          className="lg:w-1/2"
        >
          <ProductGallery
            product={product}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </motion.div>

        {/* Product Info Section */}
        <motion.div 
          variants={slideUp} 
          className="lg:w-1/2 flex flex-col items-start"
          style={{ color: settings.thirdColor || "green" }}
        >
                    <div className="flex flex-col gap-3 border-b border-gray-200 pb-4">
                      <h1 className="text-2xl font-bold text-neutral-900">
                        {product.productName}
                      </h1>
          
                                              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 gap-y-1 sm:gap-x-3">
                                                <div className="flex items-center gap-2">
                                                  <StarRating rating={product.productRating} size={18} fullColor="#facc15" />
                                                  <span>({product.ratingCount} Ratings & {product.reviewCount} Reviews)</span>
                                                </div>
                                                {product.unitsSold > 0 && (
                                                  <>
                                                    <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                                                    <div className="flex items-center">
                                                      <span className="font-semibold text-green-600">{product.unitsSold}+ Units Sold</span>
                                                    </div>
                                                  </>
                                                )}
                                              </div>                                  <div>
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-2xl font-bold text-gray-800">
                                        {settings.currency} {Math.round(product.discountedPrice)}
                                      </span>
                                      <del className="text-base text-gray-500">
                                        {settings.currency} {Math.round(product.price)}
                                      </del>
                                      <span className="text-base font-bold text-green-600">
                                        ({discountPercent}% OFF)
                                      </span>
                                    </div>
                                  </div>
                      
                                              <div className="flex items-center justify-start gap-4">
                                                <WishlistButton productId={product.id} />
                                                <div className="border-l h-4 border-gray-300"></div>
                                                <Button variant="ghost" className="text-gray-600 hover:text-blue-500 px-0">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 h-4 w-4"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                                  Compare
                                                </Button>
                                              </div>                                </div>
                      
                                <div className="w-full mt-6">
                                  <CheckPin />
                                </div>
          
          
          
                    <div className="mt-6 w-full border border-gray-200 rounded-lg bg-white divide-y divide-gray-200">
          
                      {/* Details Section */}
          
                      <div className="p-4">
              <div className="grid grid-cols-3 gap-y-3 text-sm">
                <span className="text-gray-500 col-span-1">Brand</span>
                <span className="text-gray-800 font-medium col-span-2">{product.brandName}</span>

                <span className="text-gray-500 col-span-1">Seller</span>
                <div className="col-span-2">
                  <button className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1.5 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Message Seller
                  </button>
                </div>
              </div>
            </div>

            {/* Quantity & Total */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-9 h-9 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-9 h-9 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">({product.stock} available)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Price</span>
                <span className="text-2xl font-bold text-red-600">
                  {settings.currency} {Math.round(product.discountedPrice * quantity)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Desktop buttons are in ProductGallery.tsx */}
        </motion.div>
      </div>

      {/* Mobile Buttons - Hidden when modal is open */}
      {!isModalOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3 z-40 shadow-lg"
        >
          <CartButton productId={product.id} qty={quantity} stock={product.stock} />
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex-1 transition-colors duration-200">
            Buy Now
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}