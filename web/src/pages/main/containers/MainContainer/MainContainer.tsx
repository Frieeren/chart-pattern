import { useFilters } from '../../hooks/useFilters';
import { FilterView } from '../../components/FilterView';
import { ChartView } from '../../components/ChartView';
import { ChartListView } from '../../components/ChartListView';
import type { ChartItem } from '@web/shared/types/domain';
import {
  container,
  filterArea,
  chartArea,
  listArea,
} from './style.css';
import { themeClass } from '@web/common/style/theme.css';
import { SAMPLE_CHARTS } from '@web/shared/constants/filter';

export const MainContainer: React.FC = () => {
  const chartItems: ChartItem[] = SAMPLE_CHARTS;
  const { 
    timeframe, 
    setTimeframe, 
    timeframeError,
    symbolId,
    symbol,
    updateSymbolId,
    symbolError,
    symbols,
  } = useFilters();

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
        <ChartView
          timeframe={timeframe} 
          symbol={symbol}
        />
      </div>
      
      <div className={listArea}>
        <ChartListView
          chartItems={chartItems}
        />
      </div>
    </div>
  );
};