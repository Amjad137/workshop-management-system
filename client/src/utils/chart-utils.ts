import { ChartConfig } from '@/components/ui/chart';
import { ChartDataPoint, ChartSeries } from '@/components/ui/chart-area';

export const chartUtils = {
  // Filter data by time range
  filterByTimeRange: (
    data: ChartDataPoint[],
    timeRange: string,
    referenceDate?: string,
  ): ChartDataPoint[] => {
    const refDate = referenceDate ? new Date(referenceDate) : new Date();

    // Default time range mapping
    const timeRangeDays: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };

    const daysToSubtract = timeRangeDays[timeRange] || 30;

    const startDate = new Date(refDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  },

  // Generate chart config for Recharts
  generateChartConfig: (series: ChartSeries[]): ChartConfig => {
    const config: ChartConfig = {};

    series.forEach((s) => {
      config[s.key] = {
        label: s.label,
        color: s.color,
      };
    });

    return config;
  },
};
