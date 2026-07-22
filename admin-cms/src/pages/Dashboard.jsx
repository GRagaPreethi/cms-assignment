import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchPages } from '../redux/slices/pagesSlice';
import StatsCard from '../components/UI/StatsCard';
import Badge from '../components/UI/Badge';
import { InlineLoader } from '../components/UI/LoadingSpinner';
import { formatShortDate } from '../utils/helpers';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);
  const { list: pages, isLoading } = useSelector((state) => state.pages);

  useEffect(() => {
    dispatch(fetchPages({ limit: 100 }));
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = pages.length;
    const published = pages.filter((p) => p.status === 'published').length;
    const draft = pages.filter((p) => p.status === 'draft').length;
    return { total, published, draft };
  }, [pages]);

  const recentPages = useMemo(() =>
    [...pages].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5),
    [pages]
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting()}, {admin?.username} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with your CMS today.</p>
        </div>
        <Link to="/pages/create" className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Page
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Pages"
          value={isLoading ? '—' : stats.total}
          color="blue"
          description="All pages in CMS"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Published Pages"
          value={isLoading ? '—' : stats.published}
          color="green"
          description="Live on public site"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Draft Pages"
          value={isLoading ? '—' : stats.draft}
          color="yellow"
          description="Pending publication"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        />
      </div>

      {/* Recent Pages */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Pages</h2>
          <Link to="/pages" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </Link>
        </div>

        {isLoading ? (
          <InlineLoader />
        ) : recentPages.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-sm">No pages yet.</p>
            <Link to="/pages/create" className="btn-primary mt-3 inline-flex">Create your first page</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentPages.map((page) => (
              <div key={page._id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{page.title}</p>
                  <p className="text-xs text-gray-400 font-mono">/pages/{page.slug}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Badge variant={page.status}>{page.status === 'published' ? 'Published' : 'Draft'}</Badge>
                  <span className="text-xs text-gray-400 hidden sm:block">{formatShortDate(page.updatedAt)}</span>
                  <Link to={`/pages/edit/${page._id}`} className="text-blue-600 hover:text-blue-700 text-xs font-medium">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Create Page', to: '/pages/create', icon: '✏️' },
          { label: 'All Pages', to: '/pages', icon: '📄' },
          { label: 'Published', to: '/pages?status=published', icon: '✅' },
          { label: 'Drafts', to: '/pages?status=draft', icon: '📝' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="card p-4 text-center hover:shadow-md transition-all duration-200 hover:border-blue-200 group"
          >
            <span className="text-2xl block mb-2">{item.icon}</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
