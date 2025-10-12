
'use client';

import React, { useState } from 'react';

// --- Sub-Components for Checkout Flow ---

const CustomerDetailsForm = ({ onSubmit, initialData, isLoading }: {
  onSubmit: (data: { full_name: string; mobile: string }) => void;
  initialData?: { full_name?: string; mobile?: string };
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    mobile: initialData?.mobile || '',
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
      <h2 className="text-2xl font-bold text-center text-gray-800">Your Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name</label>
          <input id="full_name" type="text" value={formData.full_name} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
        </div>
        <div>
          <label htmlFor="mobile" className="text-sm font-medium text-gray-700">Mobile Number</label>
          <input id="mobile" type="text" value={formData.mobile} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
        </div>
        <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          {isLoading ? 'Saving...' : 'Save Details'}
        </button>
      </form>
    </div>
  );
};

export default CustomerDetailsForm;
