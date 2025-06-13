import type { ChartSimilarityBasePriceData } from '@web/shared/api/models';
import type { ApexOptions } from 'apexcharts';
import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

interface CandleStickChartProps {
  options?: ApexOptions;
  data?: ChartSimilarityBasePriceData;
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

const CandleStickChart = ({ options, data }: CandleStickChartProps) => {
  const chartOptions = useMemo(() => {
    return { ...defaultOptions, ...options };
  }, [options]);

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
