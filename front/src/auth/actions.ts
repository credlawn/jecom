'use server';

import { cookies } from 'next/headers';
import { checkCurrentUser } from './login';

export async function getSessionDataAction() {
  const cookieStore = await cookies();
  const sid = cookieStore.get('user_session')?.value;
  const uid = cookieStore.get('uid')?.value;
  const { isLoggedin, data: user } = await checkCurrentUser();

  return { isLoggedin, user, sid, uid };
}
