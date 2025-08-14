import { zodResolver } from '@hookform/resolvers/zod';
import { themeClass } from '@web/common/style/theme.css';
import { useChartSimilarityLatest } from '@web/shared/api/endpoints/chart-similarity/chart-similarity';
import { useSymbols } from '@web/shared/api/endpoints/symbols/symbols';
import { Helmet } from '@web/shared/components/Helmet';
import { INTERVAL_OPTIONS } from '@web/shared/constants/filter';
import { type SymbolOption, filterFormSchema, intervalSchema } from '@web/shared/types/domain';
import { useMemo } from 'react';
import type { Resolver } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ChartListView } from './components/ChartListView';
import { ChartView } from './components/ChartView';
import { FilterSelect } from './components/FilterSelect';
import { useBrowserParamsForm } from './hooks/useBroserParamsForm';
import { chartArea, container, filterArea, listArea } from './style.css';
import { type FilterFormFields, fieldsToParamsTransformer, paramsToFieldsTransformer } from './utils/transformer';

export function MainPage() {
  const { t } = useTranslation();
  const { data } = useSymbols();

  const symbols: SymbolOption[] = useMemo(() => {
    if (!data) return [];
    return data.symbols.map(sym => ({
      id: sym,
      name: sym,
      code: sym,
    }));
  }, [data]);

  const {
    register,
    formState: { errors },
    watch,
  } = useBrowserParamsForm<FilterFormFields>({
    paramsToFields: paramsToFieldsTransformer,
    fieldsToParams: fieldsToParamsTransformer,
    defaultValues: {
      interval: intervalSchema.enum[5],
      symbol: null,
    },
    resolver: zodResolver(filterFormSchema) as Resolver<FilterFormFields>,
  });

  const filters = watch();
  const symbol = useMemo(() => {
    if (!filters.symbol) return null;
    return symbols.find(s => s.id === filters.symbol) ?? null;
  }, [symbols, filters.symbol]);

  const { data: chartItems } = useChartSimilarityLatest(symbol?.code ?? '', {
    query: {
      enabled: !!symbol?.code,
    },
  });

  return (
    <div className={`${themeClass} ${container}`}>
      <Helmet title="chart pattern | home" />

      <div className={filterArea}>
        <FilterSelect
          label={t('filter.interval')}
          options={INTERVAL_OPTIONS}
          error={errors.interval?.message}
          {...register('interval')}
        />

        <FilterSelect
          label={t('filter.symbol')}
          options={symbols?.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }))}
          error={errors.symbol?.message}
          {...register('symbol')}
        />
      </div>

      <div className={chartArea}>
        <ChartView interval={filters.interval} symbol={symbol} />
      </div>

      <div className={listArea}>
        <ChartListView symbol={symbol} chartItems={chartItems} />
      </div>
    </div>
  );
}

export default MainPage;
