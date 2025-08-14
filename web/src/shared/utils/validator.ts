import {
  type ChartItem,
  type IntervalOption,
  type SymbolOption,
  chartItemSchema,
  intervalSchema,
  symbolSchema,
} from '../types/domain';

export type ValidationResult<T> = { success: true; data: T } | { success: false; error: string };

export const validateInterval = (input: unknown): IntervalOption => {
  return intervalSchema.parse(input);
};

export const safeValidateInterval = (input: unknown): ValidationResult<IntervalOption> => {
  try {
    const data = validateInterval(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '유효하지 않은 시간 프레임입니다.',
    };
  }
};

export const validateSymbolId = (input: unknown): string => {
  if (input === null || input === undefined) {
    throw new Error('종목 ID는 필수입니다.');
  }

  if (typeof input !== 'string') {
    throw new Error('종목 ID는 문자열이어야 합니다.');
  }

  return input;
};

export const safeValidateSymbolId = (input: unknown): ValidationResult<string> => {
  try {
    const data = validateSymbolId(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '유효하지 않은 종목 ID입니다.',
    };
  }
};

export const validateSymbol = (input: unknown): SymbolOption => {
  return symbolSchema.parse(input);
};

export const safeValidateSymbol = (input: unknown): ValidationResult<SymbolOption> => {
  try {
    const data = validateSymbol(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '유효하지 않은 종목 정보입니다.',
    };
  }
};

export const validateChartItem = (input: unknown): ChartItem => {
  return chartItemSchema.parse(input);
};

export const safeValidateChartItem = (input: unknown): ValidationResult<ChartItem> => {
  try {
    const data = validateChartItem(input);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '유효하지 않은 차트 정보입니다.',
    };
  }
};
