
'use client'

import { useEffect } from 'react';
import { ensureUid } from '@/auth/setSession';
import { useAppDispatch } from '@/redux/store';
import { setUid } from '@/redux/features/session-slice';

export default function UIDGenerator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const generateAndSetUid = async () => {
      const newUid = await ensureUid();
      if (newUid) {
        dispatch(setUid(newUid));
      }
    };

    generateAndSetUid();
  }, [dispatch]);
  
  return null; 
}