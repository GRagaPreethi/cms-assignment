import React from 'react';

const TableBlock = ({ data }) => {
  if (!data || !data.content || data.content.length === 0) {
    return (
      <div className="my-6 p-6 border border-dashed border-gray-300 rounded-xl text-center text-gray-400 text-sm">
        Empty table
      </div>
    );
  }

  const withHeadings = data.withHeadings !== false;
  const rows = data.content;
  const headingRow = withHeadings ? rows[0] : null;
  const dataRows = withHeadings ? rows.slice(1) : rows;

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        {headingRow && (
          <thead className="bg-gray-50">
            <tr>
              {headingRow.map((cell, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-100">
          {dataRows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="px-5 py-3 text-gray-700 align-top"
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {dataRows.length === 0 && (
        <div className="py-6 text-center text-sm text-gray-400">No data rows</div>
      )}
    </div>
  );
};

export default TableBlock;
