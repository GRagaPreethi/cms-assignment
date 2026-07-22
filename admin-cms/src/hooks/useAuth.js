import { useSelector, useDispatch } from 'react-redux';
import { login, logout, clearError } from '../redux/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { admin, token, isAuthenticated, isLoading, error, isInitializing } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (credentials) => dispatch(login(credentials));
  const handleLogout = () => dispatch(logout());
  const handleClearError = () => dispatch(clearError());

  return {
    admin,
    token,
    isAuthenticated,
    isLoading,
    error,
    isInitializing,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
  };
};

export default useAuth;
