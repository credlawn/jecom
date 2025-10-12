'use client';

import React, { useState, useEffect } from 'react';
import { EcomCustomerData } from '@/types/checkout';

const AddressSelection = ({
  ecomCustomerProfiles,
  onAddNewAddress,
  onProceedToPayment,
  isLoading,
}: {
  ecomCustomerProfiles: EcomCustomerData[];
  onAddNewAddress: () => void;
  onProceedToPayment: (selectedProfileName: string) => void;
  isLoading: boolean;
}) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  useEffect(() => {
    if (ecomCustomerProfiles.length > 0 && !selectedProfile) {
      setSelectedProfile(ecomCustomerProfiles[0].name || null);
    }
  }, [ecomCustomerProfiles, selectedProfile]);

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Select Shipping Address</h2>
      {ecomCustomerProfiles.length > 0 ? (
        <div className="space-y-3">
          {ecomCustomerProfiles.map(profile => (
            <div
              key={profile.name}
              className={`p-4 border rounded-md cursor-pointer ${selectedProfile === profile.name ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
              onClick={() => setSelectedProfile(profile.name || null)}
            >
              <p className="font-semibold">{profile.full_name}</p>
              <p className="font-medium">{profile.address}</p>
              <p className="text-sm text-gray-600">{profile.city}, {profile.state} - {profile.pin_code}</p>
              <p className="text-sm text-gray-600">Mobile: {profile.mobile_no}</p>
            </div>
          ))}
          <button
            onClick={onAddNewAddress}
            className="w-full px-4 py-2 font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Add New Address
          </button>
          <button
            onClick={() => selectedProfile && onProceedToPayment(selectedProfile)}
            disabled={!selectedProfile || isLoading}
            className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">No addresses found. Please add one.</p>
          <button
            onClick={onAddNewAddress}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add New Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSelection;