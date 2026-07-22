import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPages,
  fetchPageById,
  createPage,
  updatePage,
  deletePage,
  clearCurrentPage,
  clearError,
} from '../redux/slices/pagesSlice';

const usePages = () => {
  const dispatch = useDispatch();
  const { list, currentPage, pagination, isLoading, isSubmitting, error } = useSelector(
    (state) => state.pages
  );

  return {
    pages: list,
    currentPage,
    pagination,
    isLoading,
    isSubmitting,
    error,
    fetchPages: (params) => dispatch(fetchPages(params)),
    fetchPageById: (slug) => dispatch(fetchPageById(slug)),
    createPage: (data) => dispatch(createPage(data)),
    updatePage: (id, data) => dispatch(updatePage({ id, data })),
    deletePage: (id) => dispatch(deletePage(id)),
    clearCurrentPage: () => dispatch(clearCurrentPage()),
    clearError: () => dispatch(clearError()),
  };
};

export default usePages;
