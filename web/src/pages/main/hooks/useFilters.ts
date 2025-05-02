import { DEFAULT_INTERVAL, DEFAULT_SYMBOL, SAMPLE_SYMBOLS } from '@web/shared/constants/filter';
import type { IntervalOption, SymbolOption } from '@web/shared/types/domain';
import { type ValidationResult, safeValidateInterval, safeValidateSymbolId } from '@web/shared/utils/validator';
import { useCallback, useEffect, useState } from 'react';

export function useFilter<T>(initialValue: T, validator: (value: unknown) => ValidationResult<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const updateValue = useCallback(
    (newValue: unknown) => {
      const result = validator(newValue);

      if (result.success) {
        setValue(result.data);
        setError(null);
        return true;
      }
      setError(result.error);
      return false;
    },
    [validator]
  );

  return { value, updateValue, error };
}

export const useFilters = () => {
  const {
    value: interval,
    updateValue: onChangeInterval,
    error: intervalError,
  } = useFilter<IntervalOption>(DEFAULT_INTERVAL as IntervalOption, safeValidateInterval);

  const [symbolId, setSymbolId] = useState<string | number | null>(DEFAULT_SYMBOL);
  const [symbol, setSymbol] = useState<SymbolOption | null>(null);
  const [symbolError, setSymbolError] = useState<string | null>(null);
  /**
   * TODO: 서버에서 가져오는 실제 종목 목록
   */
  const symbols: SymbolOption[] = SAMPLE_SYMBOLS;

  const findSymbolById = useCallback(
    (id: string | number): SymbolOption | null => {
      return symbols.find(s => s.id === id) || null;
    },
    [symbols]
  );

  useEffect(() => {
    if (symbolId) {
      const foundSymbol = findSymbolById(symbolId);
      if (foundSymbol) {
        setSymbol(foundSymbol);
        setSymbolError(null);
      } else {
        setSymbol(null);
        setSymbolError(`ID가 ${symbolId}인 종목을 찾을 수 없습니다.`);
      }
    } else {
      setSymbol(null);
      setSymbolError(null);
    }
  }, [symbolId, findSymbolById]);

  const updateSymbolId = useCallback((id: unknown) => {
    if (id === null || id === '') {
      setSymbolId(null);
      return true;
    }

    const result = safeValidateSymbolId(id);
    if (result.success) {
      setSymbolId(result.data);
      return true;
    }
    setSymbolError(result.error);
    return false;
  }, []);

  return {
    interval,
    onChangeInterval,
    intervalError,
    symbolId,
    symbol,
    onChangeSymbol: updateSymbolId,
    symbolError,
    symbols,
    hasErrors: !!intervalError || !!symbolError,
  };
};
