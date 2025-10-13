"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addToWishlist, removeFromWishlist, selectWishlistItems } from "@/redux/features/wishlist-slice";
import { selectSession } from "@/redux/features/session-slice";
import { Button } from "@/ui/button";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;

}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const session = useAppSelector(selectSession);

  const isInWishlist = wishlistItems.some((item) => item.product === productId);

  const identifiers = {
    user: session.isLoggedin ? session.user?.email : undefined,
    guestUid: session.uid,
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId, ...identifiers }));
    } else {
      dispatch(addToWishlist({ productId, ...identifiers }));
    }
  };

  return (
    <Button onClick={handleWishlistToggle} variant="ghost" className="text-gray-600 hover:text-red-500 px-0">
      <Heart className={`mr-1.5 h-4 w-4 transition-all ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
      Wishlist
    </Button>
  );
};

export default WishlistButton;
