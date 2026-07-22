'use client';

import React from 'react';
import HeaderBlock from './HeaderBlock';
import ParagraphBlock from './ParagraphBlock';
import ListBlock from './ListBlock';
import NestedListBlock from './NestedListBlock';
import TableBlock from './TableBlock';
import EquationBlock from './EquationBlock';
import ImageBlock from './ImageBlock';
import DocumentationBlock from './DocumentationBlock';
import MixedContentBlock from './MixedContentBlock';

const UnknownBlock = ({ type }) => (
  <div className="my-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
    <p className="text-sm text-gray-400 font-mono">Unknown block type: <code className="text-gray-600">{type}</code></p>
  </div>
);

const BlockRenderer = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400">No content available.</p>
      </div>
    );
  }

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="prose-content space-y-2">
      {sorted.map((block, index) => {
        const key = block._id || `block-${index}`;
        switch (block.type) {
          case 'header':
            return <HeaderBlock key={key} data={block.data} />;
          case 'paragraph':
            return <ParagraphBlock key={key} data={block.data} />;
          case 'list':
            return <ListBlock key={key} data={block.data} />;
          case 'nested-list':
            return <NestedListBlock key={key} data={block.data} />;
          case 'table':
            return <TableBlock key={key} data={block.data} />;
          case 'equation':
            return <EquationBlock key={key} data={block.data} />;
          case 'image':
            return <ImageBlock key={key} data={block.data} />;
          case 'documentation':
            return <DocumentationBlock key={key} data={block.data} />;
          case 'mixed-content':
            return <MixedContentBlock key={key} data={block.data} />;
          // EditorJS standard types
          case 'quote':
            return (
              <blockquote key={key} className="my-6 pl-5 border-l-4 border-blue-400 italic text-gray-700">
                <p>{block.data?.text}</p>
                {block.data?.caption && <cite className="text-sm text-gray-500 not-italic mt-1 block">— {block.data.caption}</cite>}
              </blockquote>
            );
          case 'code':
            return (
              <pre key={key} className="my-6 p-4 bg-gray-900 text-green-400 rounded-xl overflow-x-auto text-sm font-mono">
                <code>{block.data?.code}</code>
              </pre>
            );
          case 'delimiter':
            return <hr key={key} className="my-8 border-gray-200" />;
          case 'embed':
            return block.data?.embed ? (
              <div key={key} className="my-6 aspect-video rounded-xl overflow-hidden">
                <iframe src={block.data.embed} className="w-full h-full" allowFullScreen loading="lazy" title={block.data.caption || 'Embedded content'} />
              </div>
            ) : null;
          default:
            return <UnknownBlock key={key} type={block.type} />;
        }
      })}
    </div>
  );
};

export default BlockRenderer;
