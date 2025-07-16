import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const isFeatureEnabled = import.meta.env.VITE_FEATURE_CHANNELIO === 'true';
const pluginKey = import.meta.env.VITE_CHANNELIO_PLUGIN_KEY;

function isChannelIOEnabled() {
  if (!isFeatureEnabled || !pluginKey) {
    if (import.meta.env.DEV) {
      console.warn('ChannelIO is disabled');
    }
    return false;
  }
  return true;
}

export function useChannelIOInit() {
  const isEnabled = isChannelIOEnabled();
  const initRef = useRef(false);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    if (initRef.current) {
      return;
    }

    initRef.current = true;
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey,
    });

    return () => {
      initRef.current = false;
      ChannelService.shutdown();
    };
  }, [isEnabled]);
}

interface UseChannelIOVisibilityOptions {
  disabledPaths?: RegExp[];
}

export function useChannelIOVisibility({ disabledPaths = [] }: UseChannelIOVisibilityOptions = {}) {
  const isEnabled = isChannelIOEnabled();
  const location = useLocation();

  useEffect(() => {
    if (!isEnabled) return;

    const shouldHide = disabledPaths.some(path => path.test(location.pathname));

    if (shouldHide) {
      ChannelService.hideChannelButton();
    } else {
      ChannelService.showChannelButton();
    }
  }, [disabledPaths, location.pathname, isEnabled]);
}
