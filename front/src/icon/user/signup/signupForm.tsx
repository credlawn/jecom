'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserRequest } from '@/auth/signup';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SignupForm({ onSignupSuccess, onLoginClick }: { onSignupSuccess: () => void, onLoginClick: () => void }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setEmailError('');
    setMobileError('');
    setPasswordError('');

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    try {
      const result = await createUserRequest({
        full_name: formData.full_name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });
      
      if (result.success) {
        setMessage(result.message || 'User request submitted successfully!');
        if (onSignupSuccess) {
          onSignupSuccess();
        }
        setTimeout(() => {
          router.refresh();
        }, 200);
      } else {
        const errorMessage = result.error || 'Failed to submit request';
        if (errorMessage.includes('Email')) {
          setEmailError(errorMessage);
        } else if (errorMessage.includes('Mobile')) {
          setMobileError(errorMessage);
        } else {
          setError(errorMessage);
        }
      }
      
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Create a new account
      </h2>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label className="sr-only" htmlFor="full_name">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Full Name"
          />
        </div>
        
        <div>
          <label className="sr-only" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Email address"
          />
          {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
        </div>
        
        <div>
          <label className="sr-only" htmlFor="mobile">
            Mobile Number
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Mobile Number"
          />
          {mobileError && <p className="text-xs text-red-600 mt-1">{mobileError}</p>}
        </div>
        
        <div>
          <label className="sr-only" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Password"
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Confirm Password"
          />
          {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}