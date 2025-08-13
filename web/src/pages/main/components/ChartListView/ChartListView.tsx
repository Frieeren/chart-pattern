import type { ChartSimilarityBase, ChartSimilarityList } from '@web/shared/api/models';
import { AsyncBoundary } from '@web/shared/components/AsyncBoundary';
import type { SymbolOption } from '@web/shared/types/domain';
import { ArrowRightIcon } from 'lucide-react';
import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import {
  chartCard,
  chartCardChartWrapper,
  chartCardHeader,
  chartCardLinkButton,
  chartCardSkeleton,
  chartCardTitle,
  chartListHeader,
  chartListSection,
  chartListTitle,
  emptyMessage,
} from './style.css';

const CandleStickChart = lazy(() => import('../SideChart/CandleStickChart'));

interface ChartCardProps {
  chart: ChartSimilarityBase;
  onClickChart: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ chart, onClickChart }) => {
  return (
    <div className={chartCard}>
      <div className={chartCardHeader}>
        <h4 className={chartCardTitle}>
          {chart.start_time.replace('T', ' ')} ~<br />
          {chart.end_time.replace('T', ' ')}
        </h4>
        <button type="button" className={chartCardLinkButton} onClick={onClickChart}>
          <ArrowRightIcon size={20} />
        </button>
      </div>
      <AsyncBoundary
        pendingFallback={<div className={chartCardSkeleton} />}
        rejectedFallback={<div className={chartCardSkeleton} />}
      >
        <div className={chartCardChartWrapper}>
          <CandleStickChart data={chart.price_data} />
        </div>
      </AsyncBoundary>
    </div>
  );
};

interface ChartListViewProps {
  symbol: SymbolOption | null;
  chartItems?: ChartSimilarityList;
}

export const ChartListView: React.FC<ChartListViewProps> = ({ symbol, chartItems }) => {
  const { t } = useTranslation();

  const handleClickChart = (chart: ChartSimilarityBase) => {
    console.log({
      symbol: chart.symbol,
      start_time: chart.start_time,
      end_time: chart.end_time,
    });
  };

  return (
    <div className={chartListSection}>
      <div className={chartListHeader}>
        <h4 className={chartListTitle}>{symbol?.id}</h4>
      </div>
      {chartItems?.similarities && chartItems?.similarities.length > 0 ? (
        <>
          {chartItems?.similarities.map(chart => (
            <ChartCard
              key={`${chart.symbol}-${chart.start_time}`}
              chart={chart}
              onClickChart={() => handleClickChart(chart)}
            />
          ))}
        </>
      ) : (
        <div className={emptyMessage}>{t('chartList.noChart')}</div>
      )}
    </div>
  );
};
