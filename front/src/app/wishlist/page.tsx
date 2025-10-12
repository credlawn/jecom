'use client';

import React from 'react';
import { useAppSelector } from '@/redux/store';
import { selectWishlistItems } from '@/redux/features/wishlist-slice';
import { WishlistItem } from '@/types/wishlist';
import WishlistButton from '@/components/wishlist/WishlistButton';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/ui/button';

// A self-contained Product Card component for the wishlist page
const WishlistProductCard: React.FC<{ item: WishlistItem }> = ({ item }) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col text-center shadow-sm">
      <div className="relative w-full aspect-square mb-4">
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          className="object-cover rounded"
          priority
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <h3 className="font-semibold text-md mb-2">{item.productName}</h3>
      <p className="text-lg font-bold mb-4">{item.price}</p>
      <WishlistButton 
        productId={item.product}
      />
    </div>
  );
};

const WishlistPage = () => {
  const wishlistItems = useAppSelector(selectWishlistItems);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Wishlist</h1>
      {
        wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map(item => (
              <WishlistProductCard key={item.product} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">Your Wishlist is Empty</p>
            <Link href="/" passHref>
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        )
      }
    </div>
  );
};

export default WishlistPage;
