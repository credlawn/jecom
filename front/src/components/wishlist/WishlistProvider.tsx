'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@/auth/session';
import { fetchWishlist } from '@/redux/features/wishlist-slice';
import { AppDispatch } from '@/redux/store';

interface WishlistProviderProps {
  children: React.ReactNode;
}

export default function WishlistProvider({ children }: WishlistProviderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedin, user, uid } = useSession();

  const guestUidRef = useRef(uid);

  useEffect(() => {
    if (!isLoggedin && uid) {
      guestUidRef.current = uid;
    }

    const finalUser = user?.email;
    const finalGuestUid = isLoggedin ? guestUidRef.current : uid;

    if (finalUser || finalGuestUid) {
      dispatch(fetchWishlist({ user: finalUser, guestUid: finalGuestUid }));
    }
  }, [isLoggedin, user, uid, dispatch]);

  return <>{children}</>;
}
