import { useCallback, useEffect, useSyncExternalStore } from 'react';

/**
 * @param callback 온라인 상태 변경 시 호출할 콜백 함수
 */
export function useOnlineStatus(callback?: (isOnline: boolean) => void): boolean {
  const getSnapshot = useCallback(() => navigator.onLine, []);

  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('online', cb);
    window.addEventListener('offline', cb);
    return () => {
      window.removeEventListener('online', cb);
      window.removeEventListener('offline', cb);
    };
  }, []);

  const isOnline = useSyncExternalStore<boolean>(subscribe, getSnapshot);

  useEffect(() => {
    callback?.(isOnline);
  }, [callback, isOnline]);

  return isOnline;
}
