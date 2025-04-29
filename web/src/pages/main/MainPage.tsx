import { themeClass } from '@web/common/style/theme.css';
import { SAMPLE_CHARTS } from '@web/shared/constants/filter';
import type { ChartItem } from '@web/shared/types/domain';
import { ChartListView } from './components/ChartListView';
import { ChartView } from './components/ChartView';
import { FilterView } from './components/FilterView';
import { useFilters } from './hooks/useFilters';
import { chartArea, container, filterArea, listArea } from './style.css';

export function MainPage() {
  const chartItems: ChartItem[] = SAMPLE_CHARTS;
  const { timeframe, onChangeTimeframe, timeframeError, symbolId, symbol, onChangeSymbol, symbolError, symbols } =
    useFilters();

  return (
    <div className={`${themeClass} ${container}`}>
      <div className={filterArea}>
        <FilterView
          timeframe={timeframe}
          onChangeTimeframe={onChangeTimeframe}
          timeframeError={timeframeError}
          symbolId={symbolId}
          onChangeSymbol={onChangeSymbol}
          symbolError={symbolError}
          symbols={symbols}
        />
      </div>

      <div className={chartArea}>
        <ChartView timeframe={timeframe} symbol={symbol} />
      </div>

      <div className={listArea}>
        <ChartListView chartItems={chartItems} />
      </div>
    </div>
  );
}

export default MainPage;
