import type { IntervalOption, RangeOption } from '@web/shared/types/domain';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { chartContainer } from './style.css';

interface TVRealTimeChartProps {
  symbol: string;
  interval?: IntervalOption;
  range?: RangeOption;
}

export function RealTimeChart({ symbol, interval, range }: TVRealTimeChartProps) {
  return (
    <div className={chartContainer}>
      <AdvancedRealTimeChart theme="dark" symbol={symbol} interval={interval} range={range} autosize />
    </div>
  );
}
