import { type IntervalOption, intervalSchema } from '@web/shared/types/domain';
import type { DeepPartial } from 'react-hook-form';

export interface FilterFormFields {
  interval: IntervalOption;
  symbol: string | number | null;
}

export const paramsToFieldsTransformer = (params: Record<string, string>): Partial<FilterFormFields> => {
  return {
    interval: intervalSchema.enum[params.interval as keyof typeof intervalSchema.enum] ?? null,
    symbol: params.symbol ?? null,
  };
};

export const fieldsToParamsTransformer = (fields: DeepPartial<FilterFormFields>): Record<string, string | null> => {
  return {
    interval: fields.interval?.toString() ?? null,
    symbol: fields.symbol?.toString() ?? null,
  };
};
