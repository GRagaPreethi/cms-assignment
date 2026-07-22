'use client';

import React from 'react';
import { BlockMath } from 'react-katex';
import ListBlock from './ListBlock';

const MixedContentBlock = ({ data }) => {
  if (!data) return null;

  const { title, content = [] } = data;

  return (
    <div className="my-8 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}

      <div className="px-6 py-5 space-y-4">
        {content.map((item, idx) => {
          switch (item.type) {
            case 'paragraph':
              return (
                <p key={idx} className="text-gray-700 leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: item.text || '' }} />
              );
            case 'header':
              return (
                <h4 key={idx} className={`font-semibold text-gray-800 ${item.level === 1 ? 'text-2xl' : item.level === 2 ? 'text-xl' : 'text-lg'}`}>
                  {item.text}
                </h4>
              );
            case 'list':
              return <ListBlock key={idx} data={{ style: item.style || 'unordered', items: item.items || [] }} />;
            case 'equation':
              return (
                <div key={idx} className="py-3 text-center">
                  <BlockMath math={item.equation || ''} errorColor="#dc2626" />
                  {item.description && (
                    <p className="text-xs text-gray-400 italic mt-1">{item.description}</p>
                  )}
                </div>
              );
            case 'table':
              return (
                <div key={idx} className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full text-sm">
                    <tbody>
                      {(item.rows || []).map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx === 0 && item.withHeadings ? 'bg-gray-100 font-semibold' : 'border-t border-gray-100'}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-2 text-gray-700"
                                dangerouslySetInnerHTML={{ __html: cell }} />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            case 'image':
              return item.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={idx} src={item.url} alt={item.caption || ''} className="w-full h-auto rounded-lg" loading="lazy" />
              ) : null;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default MixedContentBlock;
