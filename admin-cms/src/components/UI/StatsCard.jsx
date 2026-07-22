import React from 'react';

const StatsCard = ({ title, value, icon, color = 'blue', change, description }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', accent: 'bg-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', accent: 'bg-green-600' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', accent: 'bg-yellow-500' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', accent: 'bg-red-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', accent: 'bg-purple-600' },
  };
  const cls = colorClasses[color] || colorClasses.blue;

  return (
    <div className="card p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${cls.bg}`}>
          <span className={`block w-6 h-6 ${cls.icon}`}>{icon}</span>
        </div>
        {change !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
      <div className={`mt-4 h-1 w-full rounded-full ${cls.bg}`}>
        <div className={`h-1 rounded-full ${cls.accent}`} style={{ width: '60%' }} />
      </div>
    </div>
  );
};

export default StatsCard;
