import { useCallback, useEffect, useSyncExternalStore } from 'react';

/**
 * @param callback Visibility 변경 시 호출할 콜백 함수
 */
export function useVisibilityChange(callback?: (state: 'visible' | 'hidden') => void): 'visible' | 'hidden' {
  const subscribe = useCallback((cb: () => void) => {
    document.addEventListener('visibilitychange', cb);
    return () => document.removeEventListener('visibilitychange', cb);
  }, []);

  const getSnapshot = useCallback(() => document.visibilityState, []);

  const visibilityState = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    callback?.(visibilityState);
  }, [callback, visibilityState]);

  return visibilityState;
}
