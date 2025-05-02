import type { ChartItem } from '@web/shared/types/domain';
import { useTranslation } from 'react-i18next';
import { chartCard, chartCardHeader, chartCardTitle, chartListSection, chartPreview, emptyMessage } from './style.css';

interface ChartCardProps {
  chart: ChartItem;
}

const ChartCard: React.FC<ChartCardProps> = ({ chart }) => {
  return (
    <div className={chartCard}>
      <div className={chartCardHeader}>
        <h4 className={chartCardTitle}>{chart.name}</h4>
      </div>
      <div className={chartPreview} />
    </div>
  );
};

interface ChartListViewProps {
  chartItems: ChartItem[];
}

export const ChartListView: React.FC<ChartListViewProps> = ({ chartItems }) => {
  const { t } = useTranslation();

  return (
    <div className={chartListSection}>
      {chartItems.length > 0 ? (
        <>
          {chartItems.map(chart => (
            <ChartCard key={chart.id} chart={chart} />
          ))}
        </>
      ) : (
        <div className={emptyMessage}>{t('chartList.noChart')}</div>
      )}
    </div>
  );
};
