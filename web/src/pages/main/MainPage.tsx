import { themeClass } from '@web/common/style/theme.css';
import { useChartSimilarityLatest } from '@web/shared/api/endpoints/chart-similarity/chart-similarity';
import { Helmet } from '@web/shared/components/Helmet';
import { ChartListView } from './components/ChartListView';
import { ChartView } from './components/ChartView';
import { FilterView } from './components/FilterView';
import { useFilters } from './hooks/useFilters';
import { chartArea, container, filterArea, listArea } from './style.css';

export function MainPage() {
  const { interval, onChangeInterval, intervalError, symbolId, symbol, onChangeSymbol, symbolError, symbols } =
    useFilters();
  const { data: chartItems } = useChartSimilarityLatest(symbol?.code ?? '', {
    query: {
      enabled: !!symbol?.code,
    },
  });

  return (
    <div className={`${themeClass} ${container}`}>
      <Helmet title="chart pattern | home" />
      <div className={filterArea}>
        <FilterView
          interval={interval}
          onChangeInterval={onChangeInterval}
          intervalError={intervalError}
          symbolId={symbolId}
          onChangeSymbol={onChangeSymbol}
          symbolError={symbolError}
          symbols={symbols}
        />
      </div>

      <div className={chartArea}>
        <ChartView interval={interval} symbol={symbol} />
      </div>

      <div className={listArea}>
        <ChartListView symbol={symbol} chartItems={chartItems} />
      </div>
    </div>
  );
}

export default MainPage;
