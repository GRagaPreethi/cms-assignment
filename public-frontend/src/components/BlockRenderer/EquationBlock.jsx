'use client';

import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';

const EquationBlock = ({ data }) => {
  if (!data || !data.equation) return null;

  const { equation, displayMode = true, description } = data;

  return (
    <div className="my-8 rounded-xl border border-blue-100 bg-blue-50/40 overflow-hidden">
      <div className="px-6 py-5 overflow-x-auto text-center">
        {displayMode ? (
          <BlockMath math={equation} errorColor="#dc2626" />
        ) : (
          <span className="text-base">
            <InlineMath math={equation} errorColor="#dc2626" />
          </span>
        )}
      </div>
      {description && (
        <div className="px-6 py-3 border-t border-blue-100 bg-blue-50/60">
          <p className="text-xs text-blue-600 text-center italic">{description}</p>
        </div>
      )}
    </div>
  );
};

export default EquationBlock;
