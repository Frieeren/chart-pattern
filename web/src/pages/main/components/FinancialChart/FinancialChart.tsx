import type { ChartSimilarityBasePriceData } from '@web/shared/api/models/chartSimilarityBasePriceData.ts';
import CandleStickChart from '../SideChart/CandleStickChart';
import { financialChartContainer } from './style.css.ts';

export function FinancialChart({ data }: { data: ChartSimilarityBasePriceData }) {
  return (
    <div className={financialChartContainer}>
      <CandleStickChart data={data} />
    </div>
  );
}
