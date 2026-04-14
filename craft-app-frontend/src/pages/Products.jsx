import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { products, categories, loading, filters, pagination, fetchProducts, setFilters, clearFilters } = useProduct();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${apiBase}/api/auth/favorites`).then(res => {
        setFavoriteIds(new Set(res.data.map(p => p._id)));
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to add to wishlist');
      return;
    }
    try {
      if (favoriteIds.has(productId)) {
        await axios.delete(`${apiBase}/api/auth/favorites/${productId}`);
        setFavoriteIds(prev => { const next = new Set(prev); next.delete(productId); return next; });
      } else {
        await axios.post(`${apiBase}/api/auth/favorites/${productId}`);
        setFavoriteIds(prev => new Set(prev).add(productId));
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const buildImageUrl = (path) => {
    if (!path) return '/placeholder-product.jpg';
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${apiBase}${normalized}`;
  };

  useEffect(() => {
    fetchProducts(filters, pagination.currentPage);
  }, [filters, pagination.currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  const handleCategoryChange = (categoryId) => {
    setFilters({ category: categoryId });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters({ sortBy, sortOrder });
  };

  const handlePageChange = (page) => {
    fetchProducts(filters, page);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            All Products
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Discover unique handmade products from talented Sri Lankan artisans
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleSortChange(sortBy, sortOrder);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Name: A to Z</option>
                <option value="title-desc">Name: Z to A</option>
              </select>

              <button
                onClick={clearFilters}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {products.map((product) => (
                <div key={product._id} className="group relative rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-full h-80 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={buildImageUrl(product.images[0])}
                      alt={product.title}
                      className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    <button
                      onClick={(e) => toggleFavorite(e, product._id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-sm z-10"
                      title={favoriteIds.has(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {favoriteIds.has(product._id) ? (
                        <HeartSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartOutline className="h-5 w-5 text-gray-600 hover:text-red-500" />
                      )}
                    </button>
                  </div>
                  <div className="mt-4 flex justify-between px-1 pb-2">
                    <div className="min-w-0 flex-1 mr-2">
                      <h3 className="text-sm font-medium text-gray-700 truncate">
                        <Link to={`/products/${product._id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 truncate">{product.category?.name}</p>
                      <p className="mt-1 text-sm text-gray-500 truncate">By {product.creator?.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">LKR {product.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          page === pagination.currentPage
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}

            {products.length === 0 && !loading && (
              <div className="text-center py-16">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
