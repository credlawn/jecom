import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A custom hook that triggers a callback function whenever the URL pathname changes.
 * @param resetCallback The function to call when navigation occurs.
 */
export const useResetOnNavigation = (resetCallback: () => void) => {
  const pathname = usePathname();

  useEffect(() => {
    resetCallback();
  }, [pathname, resetCallback]);
};
