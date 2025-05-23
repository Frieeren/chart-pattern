import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import type { UaEventOptions } from 'react-ga4/types/ga4';
import { useLocation } from 'react-router';

export const useGA4Init = () => {
  useEffect(() => {
    if (!window.location.href.includes('localhost')) {
      ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_TRAKING_ID);
      console.log('GA4 initialized');
    }
  }, []);
};

export const useGARouteTracking = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.send('pageview');
  }, [location]);
};

export const useGAEvent = () => {
  const triggerEvent = (action: string, category: string, params: Omit<UaEventOptions, 'action' | 'category'>) => {
    if (!window.location.href.includes('localhost')) {
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
