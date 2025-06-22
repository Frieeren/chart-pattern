import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface UseChannelIOOptions {
  disabledPaths?: RegExp[];
}

export function useChannelIO({ disabledPaths = [] }: UseChannelIOOptions = {}) {
  const isChannelIOEnabled = import.meta.env.VITE_FEATURE_CHANNELIO === 'true';
  const pluginKey = import.meta.env.VITE_CHANNELIO_PLUGIN_KEY;
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isChannelIOEnabled || !pluginKey) {
      if (import.meta.env.DEV) {
        console.warn('ChannelIO configuration missing');
      }
      return;
    }

    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey,
    });

    return () => {
      ChannelService.shutdown();
    };
  }, []);

  useEffect(() => {
    if (!isChannelIOEnabled || !pluginKey) return;

    const shouldHide = disabledPaths.some(path => path.test(pathname));

    if (shouldHide) {
      ChannelService.hideChannelButton();
    } else {
      ChannelService.showChannelButton();
    }
  }, [pathname, disabledPaths]);

  return {
    show: () => ChannelService.showChannelButton(),
    hide: () => ChannelService.hideChannelButton(),
  };
}
