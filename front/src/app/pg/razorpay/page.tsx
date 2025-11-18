'use client';

import { Suspense } from 'react';
import RazorpayCheckout from './RazorpayCheckout';

export default function RazorpayPaymentPage() {
  return (
    <Suspense fallback={<div>Loading Payment...</div>}>
      <RazorpayCheckout />
    </Suspense>
  );
}
