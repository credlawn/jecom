'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createRazorpayOrderAction, verifyRazorpayPaymentAction } from '@/get-api-data/razorpay';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

interface RazorpayOrder {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  status: string;
  sales_order_id: string;
}

export default function RazorpayCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<RazorpayOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const handlePaymentSuccess = useCallback(async (response: RazorpayResponse) => {
    try {
      // Use Server Action instead of direct fetch - follows your existing pattern
      console.log('Verifying payment:', response.razorpay_payment_id); // Debug log

      await verifyRazorpayPaymentAction(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature,
        orderDetails?.sales_order_id || ''
      );

      console.log('Payment verified successfully'); // Debug log
      router.push(`/payment-confirmation?order_id=${orderDetails?.sales_order_id}&txn_id=${response.razorpay_payment_id}&method=Razorpay`);

    } catch (err: unknown) {
      console.error('Payment verification error:', err);
      setError('Payment verification failed. Please contact support.');
    }
  }, [orderDetails, router]);

  const initializePayment = useCallback(async () => {
    const salesOrderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');

    if (!salesOrderId || !amount) {
      setError('Invalid payment parameters');
      setLoading(false);
      return;
    }

    try {
      // Use Server Action instead of direct fetch - follows your existing pattern
      console.log('Creating Razorpay order for:', salesOrderId); // Debug log

      const orderData = await createRazorpayOrderAction(salesOrderId, parseFloat(amount));
      console.log('Order created successfully:', orderData); // Debug log

      setOrderDetails(orderData);

    } catch (err: unknown) {
      console.error('Payment initialization error:', err);
      setError(`Failed to initialize payment: ${(err as Error).message}`);
      setLoading(false);
    }
  }, [searchParams]);

  // Initialize payment when component mounts
  useEffect(() => {
    initializePayment();
  }, [initializePayment]);

  const initializeRazorpayCheckout = useCallback(() => {
    console.log('Initializing Razorpay checkout...'); // Debug log
    if (!orderDetails) {
      console.error('No order details available!'); // Debug log
      return;
    }

    console.log('Order details:', orderDetails); // Debug log

    const options = {
      key: orderDetails.key_id,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      order_id: orderDetails.order_id,
      name: 'MyEcom Test Store',
      description: 'Purchase Payment',
      image: '/your-logo.png', // Optional

      handler: (response: RazorpayResponse) => {
        handlePaymentSuccess(response);
      },

      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },

      notes: {
        sales_order_id: orderDetails.sales_order_id
      },

      theme: {
        color: '#3399cc'
      },

      modal: {
        ondismiss: () => {
          router.push('/checkout');
        }
      }
    };

    console.log('Razorpay options:', options); // Debug log

    try {
      console.log('Creating Razorpay instance...'); // Debug log
      const rzp = new window.Razorpay(options);
      console.log('Razorpay instance created, opening...'); // Debug log
      rzp.open();
      console.log('Razorpay popup opened successfully'); // Debug log
      setLoading(false);
    } catch (err) {
      console.error('Razorpay initialization error:', err);
      setError('Failed to initialize payment gateway');
      setLoading(false);
    }
  }, [orderDetails, handlePaymentSuccess, router]);

  const loadRazorpayScript = useCallback(() => {
    console.log('Checking if Razorpay is already loaded...'); // Debug log
    if (window.Razorpay) {
      console.log('Razorpay already loaded, initializing checkout...'); // Debug log
      // Small delay to ensure React state has updated
      setTimeout(() => initializeRazorpayCheckout(), 100);
      return;
    }

    console.log('Loading Razorpay script...'); // Debug log
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded successfully, initializing checkout...'); // Debug log
      // Small delay to ensure React state has updated
      setTimeout(() => initializeRazorpayCheckout(), 100);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script'); // Debug log
      setError('Failed to load payment gateway');
      setLoading(false);
    };
    document.body.appendChild(script);
  }, [initializeRazorpayCheckout]);

  // Watch for orderDetails changes and initialize Razorpay when ready
  useEffect(() => {
    if (orderDetails) {
      loadRazorpayScript();
    }
  }, [orderDetails, loadRazorpayScript]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Initializing payment...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your payment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-800">Payment Error</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <svg className="h-6 w-6 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-yellow-800">Payment Gateway</h2>
        </div>
        <p className="text-yellow-700 mb-4">
          Opening Razorpay Test Payment Gateway...
        </p>
        <p className="text-sm text-yellow-600 mb-4">
          🔧 <strong>TEST MODE ACTIVE</strong> - No real money will be charged
        </p>
        <div className="text-sm text-gray-600">
          <p>• Popup window will open shortly</p>
          <p>• Use test card: 4111 1111 1111 1111</p>
          <p>• Any future expiry and CVV</p>
        </div>
      </div>
    </div>
  );
}
