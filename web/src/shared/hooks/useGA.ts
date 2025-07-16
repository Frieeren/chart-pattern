import { useEffect, useRef } from 'react';
import ReactGA from 'react-ga4';
import type { UaEventOptions } from 'react-ga4/types/ga4';
import { useLocation } from 'react-router';

const isLocalhost = window.location.hostname === 'localhost';

export const useGA4Init = () => {
  const initRef = useRef(false);

  useEffect(() => {
    if (!isLocalhost && !initRef.current) {
      initRef.current = true;
      ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_TRAKING_ID);
      console.log('GA4 initialized');
    }
  }, []);
};

export const useGARouteTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isLocalhost) {
      ReactGA.set({ page: location.pathname });
      ReactGA.send('pageview');
    }
  }, [location.pathname]);
};

export const useGAEvent = () => {
  const triggerEvent = (action: string, category: string, params: Omit<UaEventOptions, 'action' | 'category'>) => {
    if (!isLocalhost) {
      ReactGA.event({
        transport: 'beacon',
        action,
        category,
        ...params,
      });
    }
  };

  return {
    triggerEvent,
  };
};
