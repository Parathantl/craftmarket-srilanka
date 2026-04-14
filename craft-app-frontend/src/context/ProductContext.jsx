import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 12
  }
};

const productReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: action.payload.limit
        },
        loading: false,
        error: null
      };
    case 'FETCH_PRODUCTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        categories: action.payload
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, currentPage: 1 }
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          search: '',
          category: '',
          minPrice: '',
          maxPrice: '',
          sortBy: 'createdAt',
          sortOrder: 'desc'
        },
        pagination: { ...state.pagination, currentPage: 1 }
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products]
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload)
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/categories`);
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async (filters = state.filters, page = 1) => {
    dispatch({ type: 'FETCH_PRODUCTS_START' });
    try {
      const params = new URLSearchParams({
        page,
        limit: state.pagination.limit,
        ...filters
      });

      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products?${params}`);
      dispatch({
        type: 'FETCH_PRODUCTS_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch products';
      dispatch({
        type: 'FETCH_PRODUCTS_FAILURE',
        payload: errorMessage
      });
    }
  };

  const fetchProductById = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch product');
    }
  };

  const createProduct = async (productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images' && productData[key]) {
          Array.from(productData[key]).forEach(image => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch({ type: 'ADD_PRODUCT', payload: response.data });
      return { success: true, product: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create product';
      return { success: false, error: errorMessage };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images' && productData[key]) {
          Array.from(productData[key]).forEach(image => {
            formData.append('images', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
      return { success: true, product: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update product';
      return { success: false, error: errorMessage };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products/${id}`);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete product';
      return { success: false, error: errorMessage };
    }
  };

  const toggleProductStatus = async (id) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products/${id}/toggle-status`);
      dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to toggle product status';
      return { success: false, error: errorMessage };
    }
  };

  const fetchCreatorProducts = async (page = 1) => {
    dispatch({ type: 'FETCH_PRODUCTS_START' });
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/products/creator/my-products?page=${page}&limit=${state.pagination.limit}`);
      dispatch({
        type: 'FETCH_PRODUCTS_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch products';
      dispatch({
        type: 'FETCH_PRODUCTS_FAILURE',
        payload: errorMessage
      });
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    products: state.products,
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    fetchCreatorProducts,
    setFilters,
    clearFilters,
    clearError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
