'use client';

import { useDispatch, useSelector } from 'react-redux';
import { setSession, selectSession } from '../redux/features/session-slice';
import { RootState } from '../redux/store';
import { checkCurrentUser } from './login';

export function useSession() {
  return useSelector((state: RootState) => selectSession(state));
}

export function useRefreshSession() {
  const dispatch = useDispatch();
  return async () => {
    const newSessionData = await checkCurrentUser();
    const sessionData = {
      ...newSessionData,
      isLoggedin: newSessionData.isLoggedin,
      user: newSessionData.data,
    }
    dispatch(setSession(sessionData));
  };
}
