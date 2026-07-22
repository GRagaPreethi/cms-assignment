import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeMap = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' };
  return (
    <div
      className={`${sizeMap[size]} border-gray-200 border-t-blue-600 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <LoadingSpinner size="lg" />
    <p className="text-gray-400 text-sm animate-pulse">Loading content...</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
    <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3" />
    <div className="h-3 bg-gray-100 rounded w-1/4 mb-4" />
    <div className="space-y-2 mb-5">
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
    </div>
    <div className="h-8 bg-gray-100 rounded-lg w-28" />
  </div>
);

export default LoadingSpinner;
