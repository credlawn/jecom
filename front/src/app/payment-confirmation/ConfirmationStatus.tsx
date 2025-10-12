'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createPaymentAction } from '@/get-api-data/checkout';
import { useDispatch } from 'react-redux';
import { useSession } from '@/auth/session';
import { clearCart } from '@/redux/features/cart-slice';
import { AppDispatch } from '@/redux/store';

export default function ConfirmationStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Verifying your payment...');
  const paymentInitiated = useRef(false);

  const dispatch = useDispatch<AppDispatch>();
  const session = useSession();

  useEffect(() => {
    // Prevent double execution in Strict Mode
    if (paymentInitiated.current) {
      return;
    }
    paymentInitiated.current = true;

    const sales_order_id = searchParams.get('order_id');
    const transaction_id = searchParams.get('txn_id');
    const payment_method = searchParams.get('method');

    if (sales_order_id && transaction_id && payment_method) {
      const handlePayment = async () => {
        try {
          const result = await createPaymentAction({
            sales_order_id,
            payment_method,
            transaction_id,
          });
          if (result.message === 'Payment already processed.') {
            setMessage('Your payment has already been confirmed.');
          } else {
            setMessage('Payment successful! Your order is confirmed.');
            // Clear the cart after successful payment
            if (session.isLoggedin && session.user?.email) {
              dispatch(clearCart({ user: session.user.email, silent: true }));
            }
          }
        } catch (error) {
          setMessage('There was an error processing your payment. Please contact support.');
          console.error("Payment confirmation error:", error);
        }
      };
      handlePayment();
    } else {
        setMessage('Invalid payment confirmation URL.');
    }
  }, [searchParams, dispatch, session]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">{message}</h1>
            <button onClick={() => router.push('/')} className="mt-6 px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Continue Shopping
            </button>
        </div>
    </div>
  );
}
