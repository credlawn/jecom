'use client';

import React, { useState } from 'react';
import { EcomCustomerData } from '@/types/checkout';

// The form will handle a subset of EcomCustomerData fields
type ProfileFormData = Omit<EcomCustomerData, 'name' | 'user'>;

const AddressForm = ({ onSubmit, initialData, buttonText, isLoading }: {
  onSubmit: (data: ProfileFormData) => void;
  initialData?: ProfileFormData;
  buttonText: string;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData || {
    full_name: '',
    mobile_no: '',
    address: '',
    city: '',
    state: '',
    pin_code: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">{buttonText}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name</label>
          <input id="full_name" type="text" value={formData.full_name} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="mobile_no" className="text-sm font-medium text-gray-700">Mobile Number</label>
          <input id="mobile_no" type="text" value={formData.mobile_no} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
          <input id="address" type="text" value={formData.address} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
          <input id="city" type="text" value={formData.city} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="state" className="text-sm font-medium text-gray-700">State</label>
          <input id="state" type="text" value={formData.state} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="pin_code" className="text-sm font-medium text-gray-700">Pin Code</label>
          <input id="pin_code" type="text" value={formData.pin_code} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
        </div>
        <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          {isLoading ? 'Saving...' : buttonText}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;