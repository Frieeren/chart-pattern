import type { ChartSimilarityBasePriceData } from '@web/shared/api/models';
import type { ApexOptions } from 'apexcharts';
import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

interface CandleStickChartProps {
  options?: ApexOptions;
  data?: ChartSimilarityBasePriceData;
  onSelectRange?: (range: {
    start: string;
    end: string;
    startTimestamp: number;
    endTimestamp: number;
  }) => void;
}

const defaultOptions: ApexOptions = {
  chart: {
    type: 'candlestick',
  },
  title: {
    text: '',
  },
  grid: {
    show: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#22ab94',
        downward: '#f23645',
      },
    },
  },
};

const CandleStickChart = ({ options, data, onSelectRange }: CandleStickChartProps) => {
  const chartOptions = useMemo(() => {
    const baseOptions = {
      ...defaultOptions,
      chart: {
        ...defaultOptions.chart,
        selection: {
          enabled: !!onSelectRange,
        },
        events: {
          selection: (_: unknown, { xaxis }: { xaxis: { min: number; max: number } }) => {
            const startTime = new Date(xaxis.min);
            const endTime = new Date(xaxis.max);

            const rangeData = {
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              startTimestamp: xaxis.min,
              endTimestamp: xaxis.max,
            };

            if (onSelectRange) {
              onSelectRange(rangeData);
            }
          },
        },
      },
    };

    return { ...baseOptions, ...options };
  }, [options, onSelectRange]);

  const chartSeries = useMemo(() => {
    return data?.map(item => {
      const x = new Date(item.time);
      const y = [item.open, item.high, item.low, item.close];
      return { x, y };
    });
  }, [data]);

  if (!chartSeries) {
    return null;
  }

  return <ReactApexChart height="100%" options={chartOptions} series={[{ data: chartSeries }]} type="candlestick" />;
};

export default CandleStickChart;
