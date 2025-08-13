import type { ChartSimilarityBasePriceData } from '@web/shared/api/models/chartSimilarityBasePriceData.ts';
import CandleStickChart from '../SideChart/CandleStickChart';
import { financialChartContainer } from './style.css.ts';

interface FinancialChartProps {
  data: ChartSimilarityBasePriceData;
  onSelectRange: (range: {
    start: string;
    end: string;
    startTimestamp: number;
    endTimestamp: number;
  }) => void;
}

export function FinancialChart({ data, onSelectRange }: FinancialChartProps) {
  return (
    <div className={financialChartContainer}>
      <CandleStickChart data={data} onSelectRange={onSelectRange} />
    </div>
  );
}
