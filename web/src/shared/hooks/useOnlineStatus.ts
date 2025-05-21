import { useEffect, useSyncExternalStore } from 'react';

/**
 * @param callback 온라인 상태 변경 시 호출할 콜백 함수
 */
export function useOnlineStatus(callback: (isOnline: boolean) => void): void {
  const isOnline = useSyncExternalStore<boolean>(
    cb => {
      window.addEventListener('online', cb);
      window.addEventListener('offline', cb);
      return () => {
        window.removeEventListener('online', cb);
        window.removeEventListener('offline', cb);
      };
    },
    () => navigator.onLine
  );

  useEffect(() => {
    callback(isOnline);
  }, [callback, isOnline]);
}
