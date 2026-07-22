import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePage, fetchPages } from '../redux/slices/pagesSlice';
import CMSEditor from '../components/Editor/CMSEditor';
import ErrorMessage from '../components/UI/ErrorMessage';
import { InlineLoader } from '../components/UI/LoadingSpinner';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { editorJSToBlocks, blocksToEditorJS } from '../utils/helpers';
import pagesService from '../services/pagesService';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: pages, isLoading, isSubmitting, error } = useSelector((state) => state.pages);

  const [page, setPage] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', description: '', status: 'draft' });
  const [editorData, setEditorData] = useState(null);
  const [initialEditorData, setInitialEditorData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);

  useEffect(() => {
    if (pages.length === 0) {
      dispatch(fetchPages({ limit: 200 }));
    }
  }, [dispatch, pages.length]);

  useEffect(() => {
    const found = pages.find((p) => p._id === id);
    if (found) {
      setPage(found);
      setForm({
        title: found.title || '',
        slug: found.slug || '',
        description: found.description || '',
        status: found.status || 'draft',
      });
    }
  }, [pages, id]);

  // Fetch page with full blocks (list API excludes blocks for performance)
  useEffect(() => {
    if (!page) return;
    pagesService.getBySlug(page.slug)
      .then((data) => {
        if (data.page && data.page.blocks) {
          setInitialEditorData(blocksToEditorJS(data.page.blocks));
        }
      })
      .catch(() => {
        setInitialEditorData(blocksToEditorJS(page.blocks || []));
      });
  }, [page]);

  const handleTitleChange = (e) => {
    setForm((f) => ({ ...f, title: e.target.value }));
    if (formErrors.title) setFormErrors((err) => ({ ...err, title: '' }));
  };

  const handleSlugChange = (e) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setForm((f) => ({ ...f, slug }));
    if (formErrors.slug) setFormErrors((err) => ({ ...err, slug: '' }));
  };

  const handleEditorChange = useCallback((data) => {
    setEditorData(data);
  }, []);

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.slug.trim()) errors.slug = 'Slug is required';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = 'Slug must be lowercase with hyphens only';
    return errors;
  };

  const handleSubmit = async (e, submitStatus) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    const blocks = editorData ? editorJSToBlocks(editorData) : (page?.blocks || []);
    const pageData = { ...form, status: submitStatus || form.status, blocks };

    const result = await dispatch(updatePage({ id, data: pageData }));
    if (!result.error) {
      setSuccessMsg('Page updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  if (isLoading && !page) return <InlineLoader message="Loading page..." />;

  if (!page && !isLoading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Page not found.</p>
        <button onClick={() => navigate('/pages')} className="btn-primary mt-4">Back to Pages</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/pages')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Page</h1>
          <p className="text-gray-500 text-sm">{page?.title}</p>
        </div>
      </div>

      <ErrorMessage message={error} />
      {successMsg && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMsg}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, form.status)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Page Details</h2>

              <div>
                <label className="label">Page Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={handleTitleChange} className={`input ${formErrors.title ? 'input-error' : ''}`} disabled={isSubmitting} />
                {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="label">Slug <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">/pages/</span>
                  <input type="text" value={form.slug} onChange={handleSlugChange} className={`input rounded-l-none ${formErrors.slug ? 'input-error' : ''}`} disabled={isSubmitting} />
                </div>
                {formErrors.slug && <p className="text-xs text-red-500 mt-1">{formErrors.slug}</p>}
              </div>

              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="input resize-none" disabled={isSubmitting} />
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Content</h2>
              {initialEditorData ? (
                <CMSEditor key={id} initialData={initialEditorData} onChange={handleEditorChange} />
              ) : (
                <div className="border border-gray-200 rounded-xl min-h-[200px] flex items-center justify-center">
                  <InlineLoader message="Loading editor..." />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Publish</h2>

              <div>
                <label className="label">Status</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="input" disabled={isSubmitting}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  {isSubmitting ? <><LoadingSpinner size="sm" color="white" />Saving...</> : 'Save Changes'}
                </button>

                {form.status === 'draft' ? (
                  <button type="button" onClick={(e) => handleSubmit(e, 'published')} disabled={isSubmitting} className="btn-success w-full">
                    Save &amp; Publish
                  </button>
                ) : (
                  <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={isSubmitting} className="btn w-full bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100">
                    Unpublish
                  </button>
                )}

                <button type="button" onClick={() => navigate('/pages')} disabled={isSubmitting} className="btn-secondary w-full">
                  Cancel
                </button>
              </div>
            </div>

            {page && (
              <div className="card p-5 space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Page Info</h3>
                <div className="text-xs text-gray-500 space-y-1.5">
                  <div className="flex justify-between"><span>Blocks</span><span className="font-medium text-gray-700">{page.blocks?.length || 0}</span></div>
                  <div className="flex justify-between"><span>Created</span><span className="font-medium text-gray-700">{new Date(page.createdAt).toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span>Modified</span><span className="font-medium text-gray-700">{new Date(page.updatedAt).toLocaleDateString()}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditPage;
