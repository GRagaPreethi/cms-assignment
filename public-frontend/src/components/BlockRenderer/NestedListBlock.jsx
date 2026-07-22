import React from 'react';

const NestedItem = ({ item, isOrdered, depth = 0 }) => {
  const content = typeof item === 'string' ? item : item?.content || '';
  const children = typeof item === 'object' ? item?.items : [];
  const Tag = isOrdered ? 'ol' : 'ul';
  const listClass = isOrdered ? 'list-decimal' : 'list-disc';

  return (
    <li className="text-gray-700 leading-relaxed my-1">
      <span dangerouslySetInnerHTML={{ __html: content }} />
      {children && children.length > 0 && (
        <Tag className={`${listClass} list-inside pl-5 mt-1 space-y-1`}>
          {children.map((child, idx) => (
            <NestedItem key={idx} item={child} isOrdered={isOrdered} depth={depth + 1} />
          ))}
        </Tag>
      )}
    </li>
  );
};

const NestedListBlock = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) return null;

  const isOrdered = data.style === 'ordered';
  const Tag = isOrdered ? 'ol' : 'ul';
  const listClass = isOrdered ? 'list-decimal' : 'list-disc';

  return (
    <Tag className={`${listClass} list-inside space-y-1.5 my-4 pl-4`}>
      {data.items.map((item, idx) => (
        <NestedItem key={idx} item={item} isOrdered={isOrdered} />
      ))}
    </Tag>
  );
};

export default NestedListBlock;
