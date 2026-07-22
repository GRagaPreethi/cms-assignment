import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../UI/Badge';
import { formatShortDate, truncate } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const PageCard = ({ page, onDelete, onPublish, onUnpublish, isSubmitting }) => {
  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base group-hover:text-blue-600 transition-colors">
            {page.title}
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">/{page.slug}</p>
        </div>
        <Badge variant={page.status}>{page.status === 'published' ? 'Published' : 'Draft'}</Badge>
      </div>

      {page.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{truncate(page.description, 120)}</p>
      )}

      <div className="text-xs text-gray-400 mb-4">
        Updated {formatShortDate(page.updatedAt)}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Link to={ROUTES.EDIT_PAGE(page._id)} className="btn-secondary btn-sm">
          Edit
        </Link>
        {page.status === 'draft' ? (
          <button
            onClick={() => onPublish(page._id)}
            disabled={isSubmitting}
            className="btn-success btn-sm"
          >
            Publish
          </button>
        ) : (
          <button
            onClick={() => onUnpublish(page._id)}
            disabled={isSubmitting}
            className="btn btn-sm bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
          >
            Unpublish
          </button>
        )}
        <button
          onClick={() => onDelete(page)}
          disabled={isSubmitting}
          className="btn-danger btn-sm ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PageCard;
