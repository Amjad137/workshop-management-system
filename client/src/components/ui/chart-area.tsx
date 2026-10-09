'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CHART_TIME_RANGE } from '@/constants/chart.constants';
import { chartUtils } from '@/utils/chart-utils';
import * as React from 'react';

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface TimeRange {
  value: string;
  label: string;
  days: number;
}

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface ChartConfiguration {
  title: string;
  description: string;
  series: ChartSeries[];
  timeRanges: TimeRange[];
  defaultTimeRange: string;
}

interface ChartAreaProps {
  data: ChartDataPoint[];
  config: ChartConfiguration;
  className?: string;
  loading?: boolean;
  error?: string | null;
  onTimeRangeChange?: (timeRange: string) => void;
  disableTimeFilter?: boolean;
}

const ChartArea = ({
  data,
  config,
  className,
  loading,
  error,
  onTimeRangeChange,
  disableTimeFilter = false,
}: ChartAreaProps) => {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState(config.defaultTimeRange);

  useEffect(() => {
    if (isMobile) {
      setTimeRange(CHART_TIME_RANGE.SEVEN_DAYS);
    }
  }, [isMobile]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    onTimeRangeChange?.(value);
  };

  const filteredData = disableTimeFilter ? data : chartUtils.filterByTimeRange(data, timeRange);
  const chartConfig = chartUtils.generateChartConfig(config.series);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[250px] w-full animate-pulse bg-muted' />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex h-[250px] w-full items-center justify-center text-destructive'>
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`@container/card ${className || ''}`}>
      <CardHeader className='relative'>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>
          <span className='@[540px]/card:block hidden'>{config.description}</span>
          <span className='@[540px]/card:hidden'>Last 3 months</span>
        </CardDescription>
        {!disableTimeFilter && (
          <div className='absolute right-4 top-4'>
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className='flex w-40' aria-label='Select a time range'>
                <SelectValue placeholder='Last 3 months' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                {config.timeRanges.map((timeRangeOption) => (
                  <SelectItem
                    key={timeRangeOption.value}
                    value={timeRangeOption.value}
                    className='rounded-lg'
                  >
                    {timeRangeOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <AreaChart data={filteredData}>
            <defs>
              {config.series.map((series) => (
                <linearGradient
                  key={series.key}
                  id={`fill${series.key}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop offset='5%' stopColor={series.color} stopOpacity={1.0} />
                  <stop offset='95%' stopColor={series.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            {/* Default Y Axis for all series except percentage */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              label={
                config.series.some((s) => s.key === 'percentage')
                  ? undefined
                  : { value: 'Value', angle: -90, position: 'insideLeft', offset: 10 }
              }
            />
            {/* Y Axis for percentage if present */}
            {config.series.some((s) => s.key === 'percentage') && (
              <YAxis
                yAxisId='percentage'
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={48}
                label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', offset: 10 }}
                dataKey='percentage'
              />
            )}
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator='dot'
                />
              }
            />
            {/* Only set yAxisId for percentage series if percentage axis is present */}
            {(() => {
              const hasPercentage = config.series.some((s) => s.key === 'percentage');
              return config.series.map((series) => (
                <Area
                  key={series.key}
                  dataKey={series.key}
                  type='natural'
                  fill={`url(#fill${series.key})`}
                  stroke={series.color}
                  strokeWidth={2}
                  {...(hasPercentage && series.key === 'percentage'
                    ? { yAxisId: 'percentage' }
                    : {})}
                />
              ));
            })()}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartArea;
