import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPages, deletePage, updatePage } from '../redux/slices/pagesSlice';
import PageCard from '../components/Pages/PageCard';
import PageFilter from '../components/Pages/PageFilter';
import { ConfirmModal } from '../components/UI/Modal';
import { InlineLoader } from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const Pages = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { list: pages, isLoading, isSubmitting, error } = useSelector((state) => state.pages);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchPages({ limit: 200 }));
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    setSearchParams(params, { replace: true });
  }, [statusFilter, setSearchParams]);

  const filteredPages = useMemo(() => {
    let result = [...pages];
    if (statusFilter) result = result.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [pages, statusFilter, search]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await dispatch(deletePage(deleteTarget._id));
    setDeleteTarget(null);
  }, [deleteTarget, dispatch]);

  const handlePublish = useCallback((id) => {
    dispatch(updatePage({ id, data: { status: 'published' } }));
  }, [dispatch]);

  const handleUnpublish = useCallback((id) => {
    dispatch(updatePage({ id, data: { status: 'draft' } }));
  }, [dispatch]);

  const publishedCount = pages.filter((p) => p.status === 'published').length;
  const draftCount = pages.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pages.length} total &middot; {publishedCount} published &middot; {draftCount} drafts
          </p>
        </div>
        <Link to="/pages/create" className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Page
        </Link>
      </div>

      {/* Quick filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[{ label: 'All', value: '' }, { label: 'Published', value: 'published' }, { label: 'Draft', value: 'draft' }].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              statusFilter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.value === '' && <span className="ml-1.5 text-xs opacity-70">{pages.length}</span>}
            {tab.value === 'published' && <span className="ml-1.5 text-xs opacity-70">{publishedCount}</span>}
            {tab.value === 'draft' && <span className="ml-1.5 text-xs opacity-70">{draftCount}</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <PageFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <ErrorMessage message={error} />

      {/* Grid */}
      {isLoading ? (
        <InlineLoader message="Loading pages..." />
      ) : filteredPages.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No pages found</h3>
          <p className="text-gray-400 text-sm mb-6">
            {search || statusFilter ? 'Try adjusting your filters.' : 'Create your first page to get started.'}
          </p>
          {!search && !statusFilter && (
            <Link to="/pages/create" className="btn-primary">Create Page</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPages.map((page) => (
            <PageCard
              key={page._id}
              page={page}
              onDelete={setDeleteTarget}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Page"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Page"
        confirmClass="btn-danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Pages;
