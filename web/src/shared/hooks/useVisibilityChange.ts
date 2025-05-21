import { useEffect, useSyncExternalStore } from 'react';

/**
 * @param callback Visibility 변경 시 호출할 콜백 함수
 */
export function useVisibilityChange(callback: (state: 'visible' | 'hidden') => void): void {
  const visibilityState = useSyncExternalStore(
    cb => {
      document.addEventListener('visibilitychange', cb);
      return () => document.removeEventListener('visibilitychange', cb);
    },
    () => document.visibilityState
  );

  useEffect(() => {
    callback(visibilityState);
  }, [callback, visibilityState]);
}
