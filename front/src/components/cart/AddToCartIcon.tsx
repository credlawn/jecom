'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { addToCart, selectCartItems } from '@/redux/features/cart-slice';
import { selectSession } from '@/redux/features/session-slice';
import { ShoppingCart } from 'lucide-react'; // Using lucide-react for icons
import { Button } from '@/ui/button'; // Assuming you have a Button component

interface AddToCartIconProps {
  productId: string;
  qty?: number;
  stock?: number;
}

const AddToCartIcon: React.FC<AddToCartIconProps> = ({
  productId,
  qty = 1,
  stock = 0,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const session = useAppSelector(selectSession);

  const isInCart = cartItems.some((item) => item.product === productId);
  const isOutOfStock = stock === 0;

  const identifiers = {
    user: session.isLoggedin ? session.user?.email : undefined,
    guestUid: session.uid,
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 

    if (isInCart || isOutOfStock) {
      return;
    }

    dispatch(addToCart({
      productId,
      qty,
      ...identifiers,
    }));
  };

  return (
    
    <Button
      onClick={handleAddToCart}
      disabled={isInCart || isOutOfStock}
      size="icon"
      className={`h-6 w-6 md:h-9 md:w-9 rounded-md ${!(isInCart || isOutOfStock) ? 'cursor-pointer' : ''} ${
        isInCart
          ? 'bg-green-200 text-green-700 hover:bg-green-200'
          : 'bg-blue-100 text-blue-600 hover:bg-blue-100'
      }`}>
      <ShoppingCart
        className="h-4 w-4" strokeWidth={2.5}
      />
    </Button>
  );
};

export default AddToCartIcon;
