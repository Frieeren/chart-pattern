import type { IntervalOption, RangeOption, SymbolOption } from '@web/shared/types/domain';
import { RealTimeChart } from '../TVChart/RealTimeChart';
import { chartViewSection } from './style.css';

interface ChartViewProps {
  interval?: IntervalOption;
  range?: RangeOption;
  symbol: SymbolOption | null;
}

export const ChartView: React.FC<ChartViewProps> = ({ interval = '5', range = '1D', symbol }) => {
  return (
    <div className={chartViewSection}>
      <RealTimeChart symbol={symbol?.code || ''} interval={interval} range={range} />
    </div>
  );
};
