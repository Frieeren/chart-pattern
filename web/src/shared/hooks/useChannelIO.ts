import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { useEffect, useRef } from 'react';

interface UseChannelIOOptions {
  disabledPaths?: RegExp[];
}

export function useChannelIO({ disabledPaths = [] }: UseChannelIOOptions = {}) {
  const isChannelIOEnabled = import.meta.env.VITE_FEATURE_CHANNELIO === 'true';
  const pluginKey = import.meta.env.VITE_CHANNELIO_PLUGIN_KEY;
  const initRef = useRef(false);

  useEffect(() => {
    if (!isChannelIOEnabled || !pluginKey) {
      if (import.meta.env.DEV) {
        console.warn('ChannelIO configuration missing');
      }
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
  }, []);

  useEffect(() => {
    if (!isChannelIOEnabled || !pluginKey || typeof window === 'undefined') return;

    const shouldHide = disabledPaths.some(path => path.test(window.location.pathname));

    if (shouldHide) {
      ChannelService.hideChannelButton();
    } else {
      ChannelService.showChannelButton();
    }
  }, [disabledPaths]);

  return {
    show: () => ChannelService.showChannelButton(),
    hide: () => ChannelService.hideChannelButton(),
  };
}
