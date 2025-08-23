import React from 'react';
import { useMountIdle } from '@hooks/useMountIdle';
import { ChartSkeleton } from './Skeleton';

// Import dynamique du DonutChart
const DonutChart = React.lazy(() => import('./DonutChart'));

interface LazyDonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalBudget: number;
  totalDepense: number;
  delay?: number;
}

/**
 * Wrapper lazy pour DonutChart avec idle mounting
 * Ne charge le composant qu'après que le thread principal soit libre
 */
export const LazyDonutChart: React.FC<LazyDonutChartProps> = ({ 
  data, 
  totalBudget, 
  totalDepense,
  delay = 200 
}) => {
  const isReady = useMountIdle(delay);

  if (!isReady) {
    return <ChartSkeleton />;
  }

  return (
    <React.Suspense fallback={<ChartSkeleton />}>
      <DonutChart 
        data={data} 
        totalBudget={totalBudget} 
        totalDepense={totalDepense}
      />
    </React.Suspense>
  );
};
