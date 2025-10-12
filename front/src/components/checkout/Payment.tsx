
'use client';

import React from 'react';
import { CartItem } from '@/types/cart';
import OrderSummary from './OrderSummary';

interface PaymentProps {
  cartItems: CartItem[];
  onConfirmOrder: () => void;
  isLoading: boolean;
}

const Payment: React.FC<PaymentProps> = ({ cartItems, onConfirmOrder, isLoading }) => {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Payment</h2>
      <OrderSummary cartItems={cartItems} />
      <div className="pt-6">
        <button
          onClick={onConfirmOrder}
          disabled={isLoading}
          className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Placing Order...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
