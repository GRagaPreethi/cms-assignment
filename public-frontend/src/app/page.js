import React from 'react';
import pagesService from '../services/pagesService';
import PageCard from '../components/UI/PageCard';
import Link from 'next/link';

export const metadata = {
  title: 'Home | Knowledge Base',
  description: 'Browse our comprehensive knowledge base — covering electric vehicles, renewable energy, methanol, and more.',
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getPublishedPages() {
  try {
    const data = await pagesService.getAllPublished({ limit: 100 });
    return data.pages || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const pages = await getPublishedPages();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Headless CMS — Dynamic Content
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Knowledge Base
          </h1>
          <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            Explore our curated collection of in-depth articles on energy technology, scientific concepts, and emerging innovations.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="#pages"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-900/40"
            >
              Browse Articles
            </a>
            <a
              href="#pages"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
            >
              {pages.length} Published
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <strong className="text-gray-900">{pages.length}</strong> published articles
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Powered by Headless CMS API
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Math equations supported
            </span>
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <section id="pages" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Articles</h2>
            <p className="text-gray-500 text-sm mt-1">
              {pages.length > 0
                ? `${pages.length} article${pages.length !== 1 ? 's' : ''} available`
                : 'No articles published yet'}
            </p>
          </div>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles yet</h3>
            <p className="text-gray-400 text-sm">
              Content will appear here once pages are published in the CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <PageCard key={page._id} page={page} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
