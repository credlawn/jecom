'use client'

import { AlertCircle } from 'lucide-react';

const PendingMessage = () => {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            You have a pending request. Please wait for the admin to approve it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingMessage;
