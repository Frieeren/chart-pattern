import { useCallback, useEffect, useSyncExternalStore } from 'react';

/**
 * @param callback Visibility 변경 시 호출할 콜백 함수
 */
export function useVisibilityChange(callback?: (state: 'visible' | 'hidden') => void): 'visible' | 'hidden' {
  const getSnapshot = useCallback(() => {
    if (typeof document === 'undefined') return 'visible';

    if (typeof document.hidden !== 'undefined') {
      return document.hidden ? 'hidden' : 'visible';
    }

    // 구형 브라우저/safari
    if (typeof document.visibilityState !== 'undefined') {
      return document.visibilityState === 'hidden' ? 'hidden' : 'visible';
    }

    return 'visible';
  }, []);

  const subscribe = useCallback((cb: () => void) => {
    document.addEventListener('visibilitychange', cb);
    window.addEventListener('pagehide', cb);

    return () => {
      document.removeEventListener('visibilitychange', cb);
      window.removeEventListener('pagehide', cb);
    };
  }, []);

  const visibilityState = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    callback?.(visibilityState);
  }, [callback, visibilityState]);

  return visibilityState;
}
