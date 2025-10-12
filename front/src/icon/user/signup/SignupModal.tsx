"use client";

import { MouseEvent, ReactNode } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function SignupModal({ isOpen, onClose, children }: SignupModalProps) {
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
        {children}
      </div>
    </div>
  );
}