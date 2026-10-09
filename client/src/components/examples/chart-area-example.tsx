'use client';

import { CHART_TIME_RANGE } from '@/constants/chart.constants';
import { dataTransformers } from '@/types/chart.type';
import { useState } from 'react';
import ChartArea, { ChartConfiguration, ChartDataPoint } from '../ui/chart-area';

// Example 1: Visitors data (original format)
const visitorsData: ChartDataPoint[] = [
  { date: '2025-06-13', desktop: 222, mobile: 150 },
  { date: '2025-06-14', desktop: 97, mobile: 180 },
  { date: '2025-06-15', desktop: 167, mobile: 120 },
  { date: '2025-06-16', desktop: 242, mobile: 260 },
  { date: '2025-06-17', desktop: 373, mobile: 290 },
  { date: '2025-06-18', desktop: 301, mobile: 340 },
  { date: '2025-06-19', desktop: 245, mobile: 180 },
  { date: '2025-06-20', desktop: 409, mobile: 320 },
  { date: '2025-06-21', desktop: 59, mobile: 110 },
  { date: '2025-06-22', desktop: 261, mobile: 190 },
  { date: '2025-06-23', desktop: 327, mobile: 350 },
  { date: '2025-06-24', desktop: 292, mobile: 210 },
  { date: '2025-06-25', desktop: 342, mobile: 380 },
  { date: '2025-06-26', desktop: 137, mobile: 220 },
  { date: '2025-06-27', desktop: 120, mobile: 170 },
  { date: '2025-06-28', desktop: 138, mobile: 190 },
  { date: '2025-06-29', desktop: 446, mobile: 360 },
  { date: '2025-06-30', desktop: 364, mobile: 410 },
  { date: '2025-07-01', desktop: 243, mobile: 180 },
  { date: '2025-07-02', desktop: 89, mobile: 150 },
  { date: '2025-07-03', desktop: 137, mobile: 200 },
  { date: '2025-07-04', desktop: 224, mobile: 170 },
  { date: '2025-07-05', desktop: 138, mobile: 230 },
  { date: '2025-07-06', desktop: 387, mobile: 290 },
  { date: '2025-07-07', desktop: 215, mobile: 250 },
  { date: '2025-07-08', desktop: 75, mobile: 130 },
  { date: '2025-07-09', desktop: 383, mobile: 420 },
  { date: '2025-07-10', desktop: 122, mobile: 180 },
  { date: '2025-07-11', desktop: 315, mobile: 240 },
  { date: '2025-07-12', desktop: 454, mobile: 380 },
];

// Example 2: Sales data (time series format)
const salesRawData = [
  { timestamp: '2025-06-13', values: { revenue: 15000, profit: 5000 } },
  { timestamp: '2025-06-14', values: { revenue: 18000, profit: 6000 } },
  { timestamp: '2025-06-15', values: { revenue: 12000, profit: 4000 } },
  { timestamp: '2025-06-16', values: { revenue: 22000, profit: 7000 } },
  { timestamp: '2025-06-17', values: { revenue: 25000, profit: 8000 } },
  { timestamp: '2025-06-18', values: { revenue: 28000, profit: 9000 } },
  { timestamp: '2025-06-19', values: { revenue: 20000, profit: 6500 } },
  { timestamp: '2025-06-20', values: { revenue: 32000, profit: 10000 } },
  { timestamp: '2025-06-21', values: { revenue: 8000, profit: 2500 } },
  { timestamp: '2025-06-22', values: { revenue: 19000, profit: 6000 } },
  { timestamp: '2025-06-23', values: { revenue: 24000, profit: 7500 } },
  { timestamp: '2025-06-24', values: { revenue: 21000, profit: 6500 } },
  { timestamp: '2025-06-25', values: { revenue: 26000, profit: 8000 } },
  { timestamp: '2025-06-26', values: { revenue: 14000, profit: 4500 } },
  { timestamp: '2025-06-27', values: { revenue: 13000, profit: 4000 } },
  { timestamp: '2025-06-28', values: { revenue: 15000, profit: 5000 } },
  { timestamp: '2025-06-29', values: { revenue: 30000, profit: 9500 } },
  { timestamp: '2025-06-30', values: { revenue: 27000, profit: 8500 } },
  { timestamp: '2025-07-01', values: { revenue: 18000, profit: 5500 } },
  { timestamp: '2025-07-02', values: { revenue: 7000, profit: 2000 } },
  { timestamp: '2025-07-03', values: { revenue: 12000, profit: 3500 } },
  { timestamp: '2025-07-04', values: { revenue: 20000, profit: 6500 } },
  { timestamp: '2025-07-05', values: { revenue: 15000, profit: 4500 } },
  { timestamp: '2025-07-06', values: { revenue: 28000, profit: 9000 } },
  { timestamp: '2025-07-07', values: { revenue: 17000, profit: 5500 } },
  { timestamp: '2025-07-08', values: { revenue: 6000, profit: 1500 } },
  { timestamp: '2025-07-09', values: { revenue: 29000, profit: 9500 } },
  { timestamp: '2025-07-10', values: { revenue: 11000, profit: 3500 } },
  { timestamp: '2025-07-11', values: { revenue: 23000, profit: 7500 } },
  { timestamp: '2025-07-12', values: { revenue: 32000, profit: 10000 } },
];

// Example 3: Attendance data (array format)
const attendanceRawData = {
  date: ['2025-07-08', '2025-07-09', '2025-07-10', '2025-07-11', '2025-07-12'],
  present: [25, 28, 22, 30, 27],
  absent: [3, 0, 6, 0, 1],
};

// Chart configurations
const visitorsConfig: ChartConfiguration = {
  title: 'Total Visitors',
  description: 'Total for the last 3 months',
  series: [
    {
      key: 'desktop',
      label: 'Desktop',
      color: 'hsl(var(--chart-1))',
    },
    {
      key: 'mobile',
      label: 'Mobile',
      color: 'hsl(var(--chart-2))',
    },
  ],
  timeRanges: [
    { value: CHART_TIME_RANGE.NINETY_DAYS, label: 'Last 3 months', days: 90 },
    { value: CHART_TIME_RANGE.THIRTY_DAYS, label: 'Last 30 days', days: 30 },
    { value: CHART_TIME_RANGE.SEVEN_DAYS, label: 'Last 7 days', days: 7 },
    { value: CHART_TIME_RANGE.ONE_YEAR, label: 'Last 1 year', days: 365 },
  ],
  defaultTimeRange: CHART_TIME_RANGE.THIRTY_DAYS,
};

const salesConfig: ChartConfiguration = {
  title: 'Sales Performance',
  description: 'Revenue and profit for the selected period',
  series: [
    {
      key: 'revenue',
      label: 'Revenue',
      color: 'hsl(var(--chart-1))',
    },
    {
      key: 'profit',
      label: 'Profit',
      color: 'hsl(var(--chart-2))',
    },
  ],
  timeRanges: [
    { value: CHART_TIME_RANGE.NINETY_DAYS, label: 'Last 3 months', days: 90 },
    { value: CHART_TIME_RANGE.THIRTY_DAYS, label: 'Last 30 days', days: 30 },
    { value: CHART_TIME_RANGE.SEVEN_DAYS, label: 'Last 7 days', days: 7 },
  ],
  defaultTimeRange: CHART_TIME_RANGE.THIRTY_DAYS,
};

const attendanceConfig: ChartConfiguration = {
  title: 'Student Attendance',
  description: 'Daily attendance records',
  series: [
    {
      key: 'present',
      label: 'Present',
      color: 'hsl(var(--chart-1))',
    },
    {
      key: 'absent',
      label: 'Absent',
      color: 'hsl(var(--chart-2))',
    },
  ],
  timeRanges: [
    { value: CHART_TIME_RANGE.THIRTY_DAYS, label: 'Last 30 days', days: 30 },
    { value: CHART_TIME_RANGE.SEVEN_DAYS, label: 'Last 7 days', days: 7 },
  ],
  defaultTimeRange: CHART_TIME_RANGE.THIRTY_DAYS,
};

export function ChartAreaExample() {
  const [activeChart, setActiveChart] = useState<'visitors' | 'sales' | 'attendance'>('visitors');

  // Transform data using the utility functions
  const salesData = dataTransformers.timeSeries(salesRawData);
  const attendanceData = dataTransformers.array(attendanceRawData);

  const getCurrentData = () => {
    switch (activeChart) {
      case 'visitors':
        return visitorsData;
      case 'sales':
        return salesData;
      case 'attendance':
        return attendanceData;
      default:
        return visitorsData;
    }
  };

  const getCurrentConfig = () => {
    switch (activeChart) {
      case 'visitors':
        return visitorsConfig;
      case 'sales':
        return salesConfig;
      case 'attendance':
        return attendanceConfig;
      default:
        return visitorsConfig;
    }
  };

  const handleTimeRangeChange = (timeRange: string) => {
    console.log('Time range changed:', timeRange);
  };

  return (
    <div className='space-y-6'>
      <div className='flex gap-2'>
        <button
          onClick={() => setActiveChart('visitors')}
          className={`px-4 py-2 rounded-md ${
            activeChart === 'visitors'
              ? 'bg-primary text-primary'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          Visitors
        </button>
        <button
          onClick={() => setActiveChart('sales')}
          className={`px-4 py-2 rounded-md ${
            activeChart === 'sales'
              ? 'bg-primary text-primary'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          Sales
        </button>
        <button
          onClick={() => setActiveChart('attendance')}
          className={`px-4 py-2 rounded-md ${
            activeChart === 'attendance'
              ? 'bg-primary text-primary'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          Attendance
        </button>
      </div>

      <ChartArea
        data={getCurrentData()}
        config={getCurrentConfig()}
        onTimeRangeChange={handleTimeRangeChange}
      />
    </div>
  );
}
