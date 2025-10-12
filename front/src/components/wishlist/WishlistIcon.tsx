'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '@/redux/features/wishlist-slice';
import { selectSession } from '@/redux/features/session-slice';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';

interface WishlistIconProps {
  productId: string;
}

const WishlistIcon: React.FC<WishlistIconProps> = ({ productId }) => {
  const dispatch: AppDispatch = useDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const session = useAppSelector(selectSession);

  const isInWishlist = wishlistItems.some((item) => item.product === productId);

  const identifiers = {
    user: session.isLoggedin ? session.user?.email : undefined,
    guestUid: session.uid,
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId, ...identifiers }));
    } else {
      dispatch(addToWishlist({ productId, ...identifiers }));
    }
  };

  return (
    <div className="relative group/tooltip flex items-center">
      <Button
        onClick={handleToggle}
        size="icon"
        className={cn(
          "h-6 w-6 md:h-9 md:w-9 rounded-md cursor-pointer",
          isInWishlist
            ? 'bg-green-200 text-green-700 hover:bg-green-200'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-100'
        )}
        aria-label={isInWishlist ? 'Added' : 'Add to wishlist'}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-colors",
            isInWishlist ? 'text-green-700' : 'text-blue-600'
          )}
          fill={isInWishlist ? 'currentColor' : 'none'}
          strokeWidth={2.5}
        />
      </Button>
      
    </div>
  );
};


export default WishlistIcon;
