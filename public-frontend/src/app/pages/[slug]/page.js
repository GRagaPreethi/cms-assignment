import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import pagesService from '../../../services/pagesService';
import BlockRenderer from '../../../components/BlockRenderer/BlockRenderer';
import { formatDate, estimateReadingTime } from '../../../utils/helpers';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  try {
    const data = await pagesService.getBySlug(params.slug);
    const page = data.page;
    return {
      title: `${page.title} | Knowledge Base`,
      description: page.description || `Read ${page.title} on Knowledge Base.`,
      openGraph: {
        title: page.title,
        description: page.description,
        type: 'article',
        publishedTime: page.publishedAt,
        modifiedTime: page.updatedAt,
      },
    };
  } catch {
    return { title: 'Article | Knowledge Base' };
  }
}

export async function generateStaticParams() {
  try {
    const data = await pagesService.getAllPublished({ limit: 200 });
    return (data.pages || []).map((page) => ({ slug: page.slug }));
  } catch {
    return [];
  }
}

async function getPage(slug) {
  try {
    const data = await pagesService.getBySlug(slug);
    return data.page;
  } catch {
    return null;
  }
}

export default async function PageDetail({ params }) {
  const page = await getPage(params.slug);

  if (!page || page.status !== 'published') {
    notFound();
  }

  const readTime = estimateReadingTime(page.blocks || []);
  const publishedDate = page.publishedAt ? formatDate(page.publishedAt) : null;
  const updatedDate = page.updatedAt ? formatDate(page.updatedAt) : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600 font-medium truncate">{page.title}</span>
          </nav>

          {/* Status badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Published
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {page.title}
          </h1>

          {page.description && (
            <p className="text-lg text-gray-500 leading-relaxed mb-6 max-w-3xl">
              {page.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-5 text-sm text-gray-400">
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {publishedDate}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime}
            </span>
            {page.blocks && page.blocks.length > 0 && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {page.blocks.length} section{page.blocks.length !== 1 ? 's' : ''}
              </span>
            )}
            <span className="flex items-center gap-1.5 font-mono text-xs">
              /pages/{page.slug}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-10 lg:px-14 py-10">
          <BlockRenderer blocks={page.blocks || []} />
        </div>

        {/* Footer nav */}
        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </Link>
          {updatedDate && (
            <span className="text-xs text-gray-400">Last updated: {updatedDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}
