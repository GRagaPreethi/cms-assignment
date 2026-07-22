import React from 'react';
import { useSelector } from 'react-redux';

const Navbar = ({ onMenuToggle }) => {
  const { admin } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="lg:hidden text-sm font-semibold text-gray-900">CMS Admin</div>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{admin?.username || 'Admin'}</p>
              <p className="text-xs text-gray-400 capitalize">{admin?.role || 'admin'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
