import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const buildImageUrl = (path) => {
    if (!path) return '/placeholder-product.jpg';
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${apiBase}${normalized}`;
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/auth/favorites`);
      setFavorites(response.data);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${apiBase}/api/auth/favorites/${productId}`);
      setFavorites(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 rounded mb-8 w-48"></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center space-x-3 mb-8">
          <HeartIcon className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
            <Link
              to="/products"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {favorites.map((product) => (
              <div key={product._id} className="group relative rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-80 bg-gray-200 rounded-md overflow-hidden">
                  <img
                    src={buildImageUrl(product.images?.[0])}
                    alt={product.title}
                    className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50 shadow-sm z-10"
                    title="Remove from wishlist"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
                <div className="mt-4 flex justify-between px-1 pb-2">
                  <div className="min-w-0 flex-1 mr-2">
                    <h3 className="text-sm font-medium text-gray-700 truncate">
                      <Link to={`/products/${product._id}`}>
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
        )}
      </div>
    </div>
  );
}
