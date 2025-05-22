import { useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router';

export const useGARouteTracking = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!window.location.href.includes('localhost')) {
      ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_TRAKING_ID);
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      ReactGA.set({ page: location.pathname });
      ReactGA.send('pageview');
    }
  }, [mounted, location]);
};
