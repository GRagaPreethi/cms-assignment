import React from 'react';

const sizeMap = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
  xl: 'w-16 h-16 border-4',
};

const colorMap = {
  white: 'border-white/20 border-t-white',
  blue: 'border-blue-200 border-t-blue-600',
  gray: 'border-gray-200 border-t-gray-600',
};

const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  return (
    <div
      className={`${sizeMap[size]} ${colorMap[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const FullPageLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
    <LoadingSpinner size="xl" />
    <p className="text-gray-500 text-sm font-medium">{message}</p>
  </div>
);

export const InlineLoader = ({ message = 'Loading...' }) => (
  <div className="flex items-center gap-2 py-8 justify-center text-gray-400">
    <LoadingSpinner size="sm" color="gray" />
    <span className="text-sm">{message}</span>
  </div>
);

export default LoadingSpinner;
