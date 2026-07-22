import React from 'react';

const DocumentationBlock = ({ data }) => {
  if (!data) return null;

  const { title, sections = [] } = data;

  return (
    <div className="my-8 rounded-xl border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-6 py-4 bg-gray-800 text-white">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-100 font-mono">{title}</h3>
          </div>
        </div>
      )}

      {sections && sections.length > 0 && (
        <div className="divide-y divide-gray-100">
          {sections.map((section, idx) => (
            <div key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <div className="px-6 py-5">
                {section.heading && (
                  <h4 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {section.heading}
                  </h4>
                )}
                {section.content && (
                  <p className="text-sm text-gray-600 leading-relaxed pl-3.5"
                     dangerouslySetInnerHTML={{ __html: section.content }} />
                )}
                {section.code && (
                  <pre className="mt-3 p-4 bg-gray-900 text-green-400 rounded-lg text-xs font-mono overflow-x-auto">
                    <code>{section.code}</code>
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentationBlock;
