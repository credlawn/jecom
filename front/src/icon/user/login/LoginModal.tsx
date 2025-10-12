"use client";

import LoginForm from "./loginForm";
import { MouseEvent } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onSignupClick: () => void; // Add this line
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onSignupClick }: LoginModalProps) {
  if (!isOpen) return null;

  const handleContentClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div onClick={handleContentClick} className="w-full max-w-sm">
        <LoginForm onLoginSuccess={onLoginSuccess} onSignupClick={onSignupClick} />
      </div>
    </div>
  );
}
