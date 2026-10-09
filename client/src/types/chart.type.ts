import { ChartDataPoint } from '@/components/ui/chart-area';

// Common data formats that can be transformed
export interface RawTimeSeriesData {
  timestamp: string | Date;
  values: Record<string, number>;
}

export interface RawArrayData {
  [key: string]: (string | number)[];
}

// Data transformation functions
export const dataTransformers = {
  // Transform time series data
  timeSeries: (rawData: RawTimeSeriesData[]): ChartDataPoint[] => {
    return rawData.map((item) => ({
      date:
        typeof item.timestamp === 'string'
          ? item.timestamp
          : item.timestamp.toISOString().split('T')[0],
      ...item.values,
    }));
  },

  // Transform array data (like CSV format)
  array: (rawData: RawArrayData): ChartDataPoint[] => {
    const dates = rawData.date || rawData.Date || rawData.DATE || [];
    const result: ChartDataPoint[] = [];

    dates.forEach((date, index) => {
      const point: ChartDataPoint = { date: String(date) };

      Object.entries(rawData).forEach(([key, values]) => {
        if (key.toLowerCase() !== 'date' && Array.isArray(values) && values[index] !== undefined) {
          point[key] = values[index];
        }
      });

      result.push(point);
    });

    return result;
  },
};
