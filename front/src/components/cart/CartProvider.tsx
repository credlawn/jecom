'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@/auth/session';
import { fetchCart } from '@/redux/features/cart-slice';
import { AppDispatch } from '@/redux/store';

interface CartProviderProps {
  children: React.ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedin, user, uid } = useSession();

  // This logic is copied directly from WishlistProvider
  const guestUidRef = useRef(uid);

  useEffect(() => {
    if (!isLoggedin && uid) {
      guestUidRef.current = uid;
    }

    const finalUser = user?.email;
    const finalGuestUid = isLoggedin ? guestUidRef.current : uid;

    if (finalUser || finalGuestUid) {
      dispatch(fetchCart({ user: finalUser, guestUid: finalGuestUid }));
    }
  }, [isLoggedin, user, uid, dispatch]);

  return <>{children}</>;
}

