
'use client';

import React from 'react';
import { CartItem } from '@/types/cart';

interface OrderSummaryProps {
  cartItems: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = 0; // Replace with actual shipping cost calculation
  const total = subtotal + shipping;

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Order Summary</h2>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.product} className="flex justify-between">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
            </div>
            <p>₹{item.price * item.qty}</p>
          </div>
        ))}
        <div className="pt-4 border-t">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>₹{subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>₹{shipping.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>₹{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
