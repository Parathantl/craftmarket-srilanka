import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon, HeartIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, HeartIcon as HeartOutline, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { fetchProductById } = useProduct();
  const { addToCart, isInCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, reviewCount: 0 });
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const buildImageUrl = (path) => {
    if (!path) return '/placeholder-product.jpg';
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${apiBase}${normalized}`;
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/reviews/product/${id}`);
      setReviews(response.data.reviews);
      setReviewStats({ avgRating: response.data.avgRating, reviewCount: response.data.reviewCount });
      if (user) {
        const userReview = response.data.reviews.find(r => r.user._id === user.id || r.user._id === user._id);
        setHasReviewed(!!userReview);
      }
    } catch (error) {
      // Reviews are non-critical, fail silently
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchProductById(id);
        setProduct(productData);
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    fetchReviews();

    // Check if product is in favorites
    if (isAuthenticated) {
      axios.get(`${apiBase}/api/auth/favorites`).then(res => {
        const favIds = res.data.map(p => p._id);
        setIsFavorite(favIds.includes(id));
      }).catch(() => {});
    }
  }, [id, isAuthenticated]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await axios.post(`${apiBase}/api/reviews`, {
        productId: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      toast.success('Review submitted!');
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${apiBase}/api/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add to wishlist');
      return;
    }
    try {
      if (isFavorite) {
        await axios.delete(`${apiBase}/api/auth/favorites/${id}`);
        setIsFavorite(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(`${apiBase}/api/auth/favorites/${id}`);
        setIsFavorite(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update wishlist');
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            disabled={!interactive}
          >
            {star <= rating ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarOutline className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Added to cart!');
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="bg-gray-200 aspect-square rounded-lg" />
            <div className="mt-10 lg:mt-0 space-y-4">
              <div className="bg-gray-200 h-8 rounded w-3/4"></div>
              <div className="bg-gray-200 h-8 rounded w-1/4"></div>
              <div className="bg-gray-200 h-4 rounded w-full"></div>
              <div className="bg-gray-200 h-4 rounded w-full"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              <div className="bg-gray-200 h-12 rounded w-full mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-3xl font-extrabold text-gray-900">Product not found</h1>
            <p className="mt-2 text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          <Link to="/products" className="hover:text-gray-700">Products</Link>
          {product.category?.name && (
            <>
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">{product.category.name}</span>
            </>
          )}
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
              <img
                src={buildImageUrl(product.images[selectedImage])}
                alt={product.title}
                className="w-full h-full object-center object-cover"
              />
            </div>
            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors duration-200 ${
                      index === selectedImage ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={buildImageUrl(image)}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 lg:col-span-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.title}
            </h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">LKR {product.price}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm text-gray-900">Category:</h3>
                <p className="ml-2 text-sm text-gray-500">{product.category?.name}</p>
              </div>
              <div className="flex items-center mt-2">
                <h3 className="text-sm text-gray-900">Creator:</h3>
                <p className="ml-2 text-sm text-gray-500">{product.creator?.name}</p>
              </div>
              <div className="flex items-center mt-2">
                <h3 className="text-sm text-gray-900">Stock:</h3>
                <p className="ml-2 text-sm text-gray-500">{product.stock} available</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-l-lg"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[3rem] text-center border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-r-lg"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isInCart(product._id)}
                  className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? 'Out of Stock' : isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
                </button>
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isFavorite ? (
                    <HeartIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartOutline className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

          {/* Rating Summary */}
          <div className="mt-4 flex items-center space-x-4">
            {renderStars(Math.round(reviewStats.avgRating))}
            <span className="text-sm text-gray-600">
              {reviewStats.avgRating} out of 5 ({reviewStats.reviewCount} {reviewStats.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {/* Review Form */}
          {isAuthenticated && !hasReviewed && (
            <form onSubmit={handleSubmitReview} className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                {renderStars(newReview.rating, true, (star) => setNewReview(prev => ({ ...prev, rating: star })))}
              </div>
              <div className="mt-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                  Comment (optional)
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Share your experience with this product..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {isAuthenticated && hasReviewed && (
            <p className="mt-4 text-sm text-gray-500">You have already reviewed this product.</p>
          )}

          {!isAuthenticated && (
            <p className="mt-4 text-sm text-gray-500">
              Please <a href="/login" className="text-indigo-600 hover:text-indigo-500">log in</a> to leave a review.
            </p>
          )}

          {/* Reviews List */}
          <div className="mt-8 space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {review.user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.user?.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {user && (user.id === review.user?._id || user._id === review.user?._id || user.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-sm text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="mt-2">{renderStars(review.rating)}</div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
