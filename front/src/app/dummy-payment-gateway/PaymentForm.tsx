'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const sales_order_id = searchParams.get('order_id');
  const amount = searchParams.get('amount');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing delay
    setTimeout(() => {
      const transaction_id = `txn_${Date.now()}`;
      const payment_method = 'Demo Card';
      
      // Redirect to the confirmation page
      router.push(`/payment-confirmation?order_id=${sales_order_id}&txn_id=${transaction_id}&method=${payment_method}`);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Dummy Payment Gateway</h1>
        <p className="text-center text-gray-600">Order ID: {sales_order_id}</p>
        <p className="text-center text-2xl font-bold text-gray-800">Amount: ${amount}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="card_number" className="text-sm font-medium text-gray-700">Card Number</label>
            <input id="card_number" type="text" defaultValue="4242 4242 4242 4242" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="expiry" className="text-sm font-medium text-gray-700">Expiry</label>
              <input id="expiry" type="text" defaultValue="12/25" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
            </div>
            <div className="w-1/2">
              <label htmlFor="cvv" className="text-sm font-medium text-gray-700">CVV</label>
              <input id="cvv" type="text" defaultValue="123" className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {isLoading ? 'Processing...' : `Pay $${amount}`}
          </button>
        </form>
      </div>
    </div>
  );
}
