import React from 'react';

const ParagraphBlock = ({ data }) => {
  if (!data || !data.text) return null;

  return (
    <p
      className="text-gray-700 leading-relaxed mb-4 text-base"
      dangerouslySetInnerHTML={{ __html: data.text }}
    />
  );
};

export default ParagraphBlock;
