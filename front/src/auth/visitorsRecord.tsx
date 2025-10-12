'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '@/auth/session';
import { recordVisitorAction } from '@/get-api-data/visitor';
import { useSelector } from 'react-redux';
import { selectSettings } from '@/redux/features/settings-slice';

export default function VisitorsRecord() {
  const session = useSession();
  const { visitorTracking } = useSelector(selectSettings);
  const pathname = usePathname();
  const lastVisitTimestamp = useRef(Date.now());
  const guestUidRef = useRef(session.uid);

  useEffect(() => { if (!visitorTracking) { return; }

    if (!session.isLoggedin && session.uid) { guestUidRef.current = session.uid; }
      
    const finalUser = session.user?.email;
    const finalGuestUid = session.isLoggedin ? guestUidRef.current : session.uid;
    
    lastVisitTimestamp.current = Date.now();
    recordVisitorAction(pathname, finalUser, finalGuestUid);

    
    const sendTimeUpdate = (timeSpent: number) => {
      if (timeSpent > 0) {
        const payload = {
          slug: pathname,
          user: finalUser,
          visitor_id: finalGuestUid,
          time_spent: timeSpent,
        };
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/beacon', blob);
      }
    };

    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const elapsed = Date.now() - lastVisitTimestamp.current;
        sendTimeUpdate(Math.floor(elapsed / 1000));
        lastVisitTimestamp.current = Date.now(); 

      } else if (document.visibilityState === 'visible') {
        lastVisitTimestamp.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);


    return () => {
      const finalElapsed = Date.now() - lastVisitTimestamp.current;
      sendTimeUpdate(Math.floor(finalElapsed / 1000));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, [pathname, session, visitorTracking]);

  return null;
}