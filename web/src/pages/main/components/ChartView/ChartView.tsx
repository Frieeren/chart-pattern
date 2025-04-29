import type { SymbolOption, TimeframeOption } from '@web/shared/types/domain';
import { chartViewSection, noSymbolMessage, symbolInfo, timeframeInfo } from './style.css';

interface ChartViewProps {
  timeframe: TimeframeOption;
  symbol: SymbolOption | null;
}

export const ChartView: React.FC<ChartViewProps> = ({ timeframe, symbol }) => {
  return (
    <div className={chartViewSection}>
      <div className={timeframeInfo}>현재 시간 프레임: {formatTimeframe(timeframe)}</div>

      {symbol ? (
        <div className={symbolInfo}>
          선택된 종목: {symbol.name} ({symbol.code})
        </div>
      ) : (
        <div className={noSymbolMessage}>선택된 종목이 없습니다</div>
      )}
    </div>
  );
};

function formatTimeframe(timeframe: TimeframeOption) {
  switch (timeframe) {
    case '5m':
      return '5분봉';
    case '15m':
      return '15분봉';
    case '30m':
      return '30분봉';
    case '1h':
      return '1시간봉';
    case '4h':
      return '4시간봉';
    case '6h':
      return '6시간봉';
    case '12h':
      return '12시간봉';
    case '24h':
      return '일봉';
    default:
      return timeframe;
  }
}
