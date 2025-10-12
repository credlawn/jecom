'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { selectCartItems } from '@/redux/features/cart-slice';
import { cn } from '@/lib/utils';

interface CartIconProps {
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ className }) => {
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <div
      className={cn(
        "relative p-2 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out cursor-pointer",
        "hover:scale-110 active:scale-95",
        className
      )}
      aria-label="View cart"
    >
      <ShoppingCart
        className={cn(
          "h-5 w-5 transition-colors",
          cartCount > 0 ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
        )}
        fill={cartCount > 0 ? 'currentColor' : 'none'}
      />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
