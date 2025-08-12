import { useToggle } from '@web/shared/hooks/useToggle';
import type { IntervalOption, RangeOption, SymbolOption } from '@web/shared/types/domain';
import { FinancialChart } from '../FinancialChart';
import { LiveToggle } from '../LiveToggle';
import { RealTimeChart } from '../TVChart/RealTimeChart';
import { chartViewSection } from './style.css';

interface ChartViewProps {
  interval?: IntervalOption;
  range?: RangeOption;
  symbol: SymbolOption | null;
}

const generateMockData = (length: number) => {
  let currentPrice = 100;
  return Array.from({ length }, (_, i) => {
    const time = new Date(Date.now() - (length - 1 - i) * 1000).toISOString();

    // 이전 가격 기반으로 변동
    const volatility = 0.02; // 2% 변동성
    const trend = (Math.random() - 0.5) * volatility;

    const open = currentPrice;
    const priceChange = currentPrice * trend;
    const close = open + priceChange;

    // 캔들 내 변동 범위
    const wickRange = Math.abs(priceChange) + currentPrice * 0.01;
    const high = Math.max(open, close) + Math.random() * wickRange;
    const low = Math.min(open, close) - Math.random() * wickRange;

    currentPrice = close; // 다음 캔들의 시작점

    return {
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    };
  });
};

export const ChartView: React.FC<ChartViewProps> = ({ interval = '5', range = '1D', symbol }) => {
  const [isLive, onToggle] = useToggle(false);

  return (
    <div className={chartViewSection}>
      <LiveToggle value={isLive} onChange={onToggle} />
      {isLive ? (
        <RealTimeChart symbol={symbol?.code || ''} interval={interval} range={range} />
      ) : (
        <FinancialChart data={generateMockData(200)} />
      )}
    </div>
  );
};
