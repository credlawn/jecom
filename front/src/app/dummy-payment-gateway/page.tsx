import { Suspense } from 'react';
import PaymentForm from './PaymentForm';

export default function DummyPaymentGatewayPage() {
  return (
    <Suspense fallback={<div>Loading Payment Gateway...</div>}>
      <PaymentForm />
    </Suspense>
  );
}