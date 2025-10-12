'use client';

import { User as UserAvatar, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { logoutUser } from '@/auth/login';
import { clearSession } from '@/auth/setSession';
import { useRouter } from 'next/navigation';
import LoginModal from './login/LoginModal';
import SignupModal from './signup/SignupModal';
import { checkPendingRequest } from '@/auth/signup';
import PendingMessage from './signup/PendingMessage';
import SignupForm from './signup/signupForm';
import Loader from '@/ui/loader';

interface UserIconProps {
  isLoggedIn: boolean;
  onLoggedOutClick?: () => void;
}

export default function UserIcon({ isLoggedIn, onLoggedOutClick }: UserIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userIconRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    const response = await logoutUser();
    await clearSession();
    if (response.success) {
      router.refresh();
      window.location.href = '/';
    } else {
      console.error('Logout failed:', response.error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userIconRef.current && !userIconRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleIconClick = () => {
    if (isLoggedIn) {
      setIsOpen(!isOpen);
    } else {
      if (onLoggedOutClick) {
        onLoggedOutClick();
      }
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleSignupClick = async () => {
    setIsLoginModalOpen(false);
    setIsLoading(true);
    const pendingRequest = await checkPendingRequest();
    if (pendingRequest.hasPendingRequest) {
      setHasPendingRequest(true);
    } else {
      setHasPendingRequest(false);
    }
    setIsSignupModalOpen(true);
    setIsLoading(false);
  };

  const handleSignupSuccess = () => {
    setIsSignupModalOpen(false);
  };

  const handleLoginClick = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="relative" ref={userIconRef}>
        <button
          onClick={handleIconClick}
          className="relative hover:text-red-500 transition-colors cursor-pointer"
        >
          <UserAvatar />
        </button>

        {isOpen && isLoggedIn && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSignupClick={handleSignupClick}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      >
        {hasPendingRequest ? <PendingMessage /> : <SignupForm onSignupSuccess={handleSignupSuccess} onLoginClick={handleLoginClick} />}
      </SignupModal>
    </>
  );
}
