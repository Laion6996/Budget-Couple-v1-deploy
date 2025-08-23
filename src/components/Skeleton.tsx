import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

/**
 * Composant Skeleton réutilisable pour les états de chargement
 */
export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  height = '260px', 
  width = '100%',
  rounded = true 
}) => {
  const baseClasses = `animate-pulse bg-slate-800`;
  const roundedClasses = rounded ? 'rounded-xl' : '';
  const sizeClasses = `min-h-[${height}] w-[${width}]`;
  
  return (
    <div 
      className={`${baseClasses} ${roundedClasses} ${sizeClasses} ${className}`}
      style={{ minHeight: height, width }}
    />
  );
};

/**
 * Skeleton spécialisé pour les graphiques/charts
 */
export const ChartSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Skeleton 
    height="260px" 
    className={`${className}`}
  />
);

/**
 * Skeleton spécialisé pour les pages complètes
 */
export const PageSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton height="40px" className="w-1/3" />
    <Skeleton height="200px" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton height="150px" />
      <Skeleton height="150px" />
    </div>
  </div>
);
