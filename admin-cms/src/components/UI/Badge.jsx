import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {variant === 'published' && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
      {variant === 'draft' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
      {children}
    </span>
  );
};

export default Badge;
