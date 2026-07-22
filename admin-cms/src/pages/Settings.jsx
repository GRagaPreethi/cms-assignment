import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Settings = () => {
  const { admin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {admin?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{admin?.username}</p>
            <p className="text-sm text-gray-500">{admin?.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1 capitalize">
              {admin?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Username</label>
            <input type="text" value={admin?.username || ''} readOnly className="input bg-gray-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={admin?.email || ''} readOnly className="input bg-gray-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="label">Role</label>
            <input type="text" value={admin?.role || ''} readOnly className="input bg-gray-50 cursor-not-allowed capitalize" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Account details can only be changed through the API or database directly.</p>
      </div>

      {/* API */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">API Endpoints</h2>
        <div className="space-y-2 font-mono text-xs text-gray-600 bg-gray-50 rounded-lg p-4">
          {[
            'GET    /api/pages            — List all pages',
            'GET    /api/pages/:slug      — Get page by slug',
            'POST   /api/pages            — Create page',
            'PUT    /api/pages/:id        — Update page',
            'DELETE /api/pages/:id        — Delete page',
            'POST   /api/blocks           — Add block to page',
            'PUT    /api/blocks/:id       — Update block',
            'DELETE /api/blocks/:id       — Delete block',
            'POST   /api/auth/login       — Login',
            'POST   /api/auth/logout      — Logout',
            'GET    /api/auth/verify      — Verify token',
          ].map((ep) => <div key={ep}>{ep}</div>)}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-100">
        <h2 className="text-base font-semibold text-red-600 mb-4">Session</h2>
        <p className="text-sm text-gray-500 mb-4">Signing out will clear your session. You will need to log in again.</p>
        <button onClick={handleLogout} className="btn-danger">Sign Out</button>
      </div>
    </div>
  );
};

export default Settings;
