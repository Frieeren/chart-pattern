import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export const useBrowseParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }, [searchParams]);

  const updateParams = useCallback(
    (newParams: Record<string, string | null>) => {
      setSearchParams(prev => {
        const updated = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(newParams)) {
          if (value === null || value === '') {
            updated.delete(key);
          } else {
            updated.set(key, value);
          }
        }
        return updated;
      });
    },
    [setSearchParams]
  );

  const resetParams = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return { params, updateParams, resetParams };
};
