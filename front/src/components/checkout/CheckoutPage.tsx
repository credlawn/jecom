'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/auth/session';
import LoginModal from '@/icon/user/login/LoginModal';
import SignupModal from '@/icon/user/signup/SignupModal';
import SignupForm from '@/icon/user/signup/signupForm';
import { createSalesOrderAction, getEcomCustomersAction, createEcomCustomerAction } from '@/get-api-data/checkout';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { selectCartItems } from '@/redux/features/cart-slice';
import { EcomCustomerData } from '@/types/checkout';
import AddressForm from './AddressForm';
import AddressSelection from './AddressSelection';
import Payment from './Payment';

export default function CheckoutPage() {
  const session = useSession();
  const { user } = session;
  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('initial'); // 'initial' | 'loading_customer_data' | 'address_selection' | 'address_form' | 'payment'
  const [ecomCustomerProfiles, setEcomCustomerProfiles] = useState<EcomCustomerData[]>([]);
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Effects ---

  useEffect(() => {
    if (checkoutStep === 'loading_customer_data' && session.isLoggedin && user) {
      const fetchCustomerData = async () => {
        setLoading(true);
        try {
          const result = await getEcomCustomersAction(user.email);
          setEcomCustomerProfiles(result);
          if (result.length > 0) {
            setCheckoutStep('address_selection');
          } else {
            setCheckoutStep('address_form');
          }
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
          router.push('/');
        } finally {
          setLoading(false);
        }
      };
      fetchCustomerData();
    } else if (checkoutStep === 'loading_customer_data' && !session.isLoggedin) {
        setLoginModalOpen(true);
    }
  }, [checkoutStep, session.isLoggedin, user, router]);

  // --- Handlers ---

  const handleProcessCheckout = () => {
    if (session.isLoggedin) {
      setCheckoutStep('loading_customer_data');
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    setCheckoutStep('loading_customer_data');
  };

  const handleSwitchToSignup = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setCheckoutStep('address_form');
  };

  const handleProfileFormSubmit = async (profileData: Omit<EcomCustomerData, 'name' | 'user'>) => {
    if (!user) return;
    setLoading(true);
    try {
      await createEcomCustomerAction({ ...profileData, user_email: user.email });
      setCheckoutStep('loading_customer_data'); // Refetch profiles
    } catch (error) {
      console.error("Failed to create profile:", error);
      alert("Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = (profileName: string) => {
    setSelectedProfileName(profileName);
    setCheckoutStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!selectedProfileName || !user) return;
    setLoading(true);

    try {
      const result = await createSalesOrderAction({
        cart_data: cartItems,
        ecom_customer_name: selectedProfileName,
        user_email: user.email,
      });

      if (result.status === 'success') {
        const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        router.push(`/dummy-payment-gateway?order_id=${result.sales_order_id}&amount=${totalAmount}`);
      } else {
        alert(`Error placing order: ${result.message}`);
      }
    } catch (error) {
      console.error("An unexpected error occurred during order placement:", error);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {loading && <p>Loading...</p>}

      {checkoutStep === 'initial' && (
        <button onClick={handleProcessCheckout} className="px-6 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">
          Process to Checkout
        </button>
      )}

      {checkoutStep === 'address_selection' && (
        <AddressSelection
          ecomCustomerProfiles={ecomCustomerProfiles}
          onAddNewAddress={handleAddNewAddress}
          onProceedToPayment={handleProceedToPayment}
          isLoading={loading}
        />
      )}

      {checkoutStep === 'address_form' && (
        <AddressForm
          onSubmit={handleProfileFormSubmit}
          buttonText="Save Profile"
          isLoading={loading}
        />
      )}

      {checkoutStep === 'payment' && (
        <Payment
          cartItems={cartItems}
          onConfirmOrder={handlePlaceOrder}
          isLoading={loading}
        />
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSignupClick={handleSwitchToSignup}
      />

      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setSignupModalOpen(false)}
      >
        <SignupForm 
          onSignupSuccess={() => setSignupModalOpen(false)} // Assuming it has this prop
          onLoginClick={handleSwitchToLogin} 
        />
      </SignupModal>
    </div>
  );
}