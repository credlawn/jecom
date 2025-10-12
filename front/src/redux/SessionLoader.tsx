'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/store';
import { setSession } from '@/redux/features/session-slice';
import { getSessionDataAction } from '@/auth/actions';
import UIDGenerator from '@/auth/tracking';

export default function SessionLoader() {
  const dispatch = useAppDispatch();
  const [showUidGenerator, setShowUidGenerator] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSessionDataAction();
      dispatch(setSession(sessionData));

      if (!sessionData.uid) {
        setShowUidGenerator(true);
      }
    };

    fetchSession();
  }, [dispatch]);

  return showUidGenerator ? <UIDGenerator /> : null;
}
