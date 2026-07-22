import React from 'react';

const ListBlock = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) return null;

  const isOrdered = data.style === 'ordered';
  const Tag = isOrdered ? 'ol' : 'ul';
  const listClass = isOrdered
    ? 'list-decimal list-inside space-y-2 my-4 pl-4'
    : 'list-disc list-inside space-y-2 my-4 pl-4';

  return (
    <Tag className={listClass}>
      {data.items.map((item, idx) => (
        <li
          key={idx}
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: typeof item === 'string' ? item : item?.content || '' }}
        />
      ))}
    </Tag>
  );
};

export default ListBlock;
