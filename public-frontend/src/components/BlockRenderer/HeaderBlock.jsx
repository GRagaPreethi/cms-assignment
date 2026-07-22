import React from 'react';

const HeaderBlock = ({ data }) => {
  if (!data || !data.text) return null;

  const Tag = `h${data.level || 1}`;

  const classMap = {
    1: 'text-4xl font-bold text-gray-900 mb-6 mt-10 leading-tight tracking-tight',
    2: 'text-3xl font-bold text-gray-900 mb-5 mt-10 leading-tight',
    3: 'text-2xl font-semibold text-gray-800 mb-4 mt-8',
    4: 'text-xl font-semibold text-gray-800 mb-3 mt-6',
    5: 'text-lg font-semibold text-gray-700 mb-2 mt-5',
    6: 'text-base font-semibold text-gray-700 mb-2 mt-4 uppercase tracking-wide',
  };

  return (
    <Tag
      className={classMap[data.level || 1]}
      dangerouslySetInnerHTML={{ __html: data.text }}
    />
  );
};

export default HeaderBlock;
