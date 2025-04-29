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
  const { timeframe, setTimeframe, timeframeError, symbolId, symbol, updateSymbolId, symbolError, symbols } =
    useFilters();

  return (
    <div className={`${themeClass} ${container}`}>
      <div className={filterArea}>
        <FilterView
          timeframe={timeframe}
          onChangeTimeframe={setTimeframe}
          timeframeError={timeframeError}
          symbolId={symbolId}
          onChangeSymbol={updateSymbolId}
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
