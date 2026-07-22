import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPage } from '../redux/slices/pagesSlice';
import CMSEditor from '../components/Editor/CMSEditor';
import ErrorMessage from '../components/UI/ErrorMessage';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { slugify, editorJSToBlocks } from '../utils/helpers';

const CreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSubmitting, error } = useSelector((state) => state.pages);

  const [form, setForm] = useState({ title: '', slug: '', description: '', status: 'draft' });
  const [editorData, setEditorData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug: slugManuallyEdited ? f.slug : slugify(title),
    }));
    if (formErrors.title) setFormErrors((e) => ({ ...e, title: '' }));
  };

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true);
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setForm((f) => ({ ...f, slug }));
    if (formErrors.slug) setFormErrors((e) => ({ ...e, slug: '' }));
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

    const blocks = editorData ? editorJSToBlocks(editorData) : [];
    const pageData = { ...form, status: submitStatus || form.status, blocks };

    const result = await dispatch(createPage(pageData));
    if (!result.error) {
      navigate('/pages');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/pages')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Page</h1>
          <p className="text-gray-500 text-sm">Fill in the details and add content blocks</p>
        </div>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={(e) => handleSubmit(e, form.status)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Page Details</h2>

              <div>
                <label className="label">Page Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="Enter page title..."
                  className={`input ${formErrors.title ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="label">Slug <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">/pages/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={handleSlugChange}
                    placeholder="page-slug"
                    className={`input rounded-l-none ${formErrors.slug ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {formErrors.slug && <p className="text-xs text-red-500 mt-1">{formErrors.slug}</p>}
                <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers, and hyphens only</p>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description for SEO and previews..."
                  rows={3}
                  className="input resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Editor */}
            <div className="card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Content</h2>
              <p className="text-xs text-gray-400">Use the editor below to add blocks: paragraphs, headings, tables, equations, images, and more.</p>
              <CMSEditor onChange={handleEditorChange} placeholder="Start writing your page content..." />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Publish</h2>

              <div>
                <label className="label">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="input"
                  disabled={isSubmitting}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? <><LoadingSpinner size="sm" color="white" />Saving...</> : `Save as ${form.status === 'published' ? 'Published' : 'Draft'}`}
                </button>

                {form.status === 'draft' && (
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'published')}
                    disabled={isSubmitting}
                    className="btn-success w-full"
                  >
                    Save &amp; Publish
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/pages')}
                  disabled={isSubmitting}
                  className="btn-secondary w-full"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Supported Block Types</h3>
              <ul className="space-y-1.5 text-xs text-gray-500">
                {['Heading (H1–H6)', 'Paragraph', 'List (ordered/unordered)', 'Nested List', 'Table', 'Image', 'Mathematical Equation', 'Quote', 'Embed'].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
