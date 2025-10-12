import { Suspense } from 'react';
import ConfirmationStatus from './ConfirmationStatus';

export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={<div>Verifying Payment...</div>}>
      <ConfirmationStatus />
    </Suspense>
  );
}
