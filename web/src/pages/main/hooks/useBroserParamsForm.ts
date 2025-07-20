import { useEffect, useMemo } from 'react';
import {
  type DeepPartial,
  type DefaultValues,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import { useBrowseParams } from './useBrowserParams';

interface UseBrowserParamsFormOptions<TFieldValues extends FieldValues>
  extends Omit<UseFormProps<TFieldValues>, 'defaultValues'> {
  paramsToFields: (params: Record<string, string>) => Partial<TFieldValues>;
  fieldsToParams: (fields: DeepPartial<TFieldValues>) => Record<string, string | null>;
  defaultValues?: TFieldValues;
}

export function useBrowserParamsForm<TFieldValues extends FieldValues = FieldValues>(
  options: UseBrowserParamsFormOptions<TFieldValues>
): UseFormReturn<TFieldValues> & {
  reset: () => void;
} {
  const { paramsToFields, fieldsToParams, defaultValues, mode = 'onChange', ...useFormOptions } = options;

  const { params, updateParams } = useBrowseParams();

  const initialValues = useMemo(() => {
    const parsedParams = paramsToFields(params);
    const values = Object.values(parsedParams).every(value => value === null) ? defaultValues : parsedParams;
    return values as DefaultValues<TFieldValues>;
  }, [params, paramsToFields, defaultValues]);

  const form = useForm<TFieldValues>({
    defaultValues: initialValues,
    ...useFormOptions,
  });

  const reset = () => {
    form.reset(initialValues);
  };

  useEffect(() => {
    const subscription = form.watch(value => {
      const urlParams = fieldsToParams(value);
      updateParams(urlParams);
    });

    return () => subscription.unsubscribe();
  }, [updateParams, fieldsToParams, form.watch]);

  return {
    ...form,
    reset,
  };
}
