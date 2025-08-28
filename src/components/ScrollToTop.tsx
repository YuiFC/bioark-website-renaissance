import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop({ behavior = 'auto' as ScrollBehavior }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the very top on every route change
    try {
      window.scrollTo({ top: 0, left: 0, behavior });
    } catch {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname, behavior]);

  return null;
}
