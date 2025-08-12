import { useToggle } from '@web/shared/hooks/useToggle';
import type { IntervalOption, RangeOption, SymbolOption } from '@web/shared/types/domain';
import { LiveToggle } from '../LiveToggle';
import { RealTimeChart } from '../TVChart/RealTimeChart';
import { chartViewSection } from './style.css';

interface ChartViewProps {
  interval?: IntervalOption;
  range?: RangeOption;
  symbol: SymbolOption | null;
}

export const ChartView: React.FC<ChartViewProps> = ({ interval = '5', range = '1D', symbol }) => {
  const [isLive, onToggle] = useToggle(true);

  return (
    <div className={chartViewSection}>
      <LiveToggle value={isLive} onChange={onToggle} />
      <RealTimeChart symbol={symbol?.code || ''} interval={interval} range={range} />
    </div>
  );
};
