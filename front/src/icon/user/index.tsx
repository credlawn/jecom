'use client';

import { useSession } from '@/auth/session';
import UserIcon from './userIcon';

interface UserIconContainerProps {
  onLoggedOutClick?: () => void;
}

export default function UserIconContainer({ onLoggedOutClick }: UserIconContainerProps) {
  const session = useSession();
  return <UserIcon isLoggedIn={session.isLoggedin} onLoggedOutClick={onLoggedOutClick} />;
}