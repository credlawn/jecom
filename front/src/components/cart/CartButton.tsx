'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { addToCart, selectCartItems } from '@/redux/features/cart-slice';
import { selectSession } from '@/redux/features/session-slice';
import { Button } from '@/ui/button';

interface CartButtonProps { productId: string; qty?: number; className?: string; stock?: number; }
  
const CartButton: React.FC<CartButtonProps> = ({ productId, qty = 1, className, stock = 0, }) => {
  
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
    <Button onClick={handleAddToCart} disabled={isInCart || isOutOfStock} className={`${className} rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer`}>
      {isOutOfStock ? "Out of Stock" : isInCart ? "Added to Cart" : "Add to Cart"}
    </Button>
  );
};

export default CartButton;

