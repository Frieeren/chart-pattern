import type { ChartItem } from '@web/shared/types/domain';
import {
  chartListSection,
  chartCard,
  chartCardHeader,
  chartCardTitle,
  chartPreview,
  emptyMessage
} from './style.css';

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

export const ChartListView: React.FC<ChartListViewProps> = ({ 
  chartItems,
}) => {
  return (
    <div className={chartListSection}>
      {chartItems.length > 0 ? (
        <>
          {chartItems.map(chart => (
            <ChartCard 
              key={chart.id}
              chart={chart}
            />
          ))}
        </>
      ) : (
        <div className={emptyMessage}>
          유사한 차트가 존재하지 않습니다.
        </div>
      )}
    </div>
  );
};