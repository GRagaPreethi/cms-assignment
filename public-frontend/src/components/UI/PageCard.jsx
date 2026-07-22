import React from 'react';
import Link from 'next/link';

const PageCard = ({ page }) => {
  const blockCount = page.blocks?.length || 0;
  const publishedDate = page.publishedAt
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(page.publishedAt))
    : null;

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 overflow-hidden">
      {/* Color accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
            {page.title}
          </h2>
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </div>

        {page.description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
            {page.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
          {blockCount > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {blockCount} block{blockCount !== 1 ? 's' : ''}
            </span>
          )}
          {publishedDate && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {publishedDate}
            </span>
          )}
        </div>

        <Link
          href={`/pages/${page.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors group/btn"
        >
          Read Article
          <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default PageCard;
