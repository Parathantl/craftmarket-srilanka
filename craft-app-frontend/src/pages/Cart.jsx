import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, total, itemCount, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  if (itemCount === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Your Cart
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Your cart is empty. Start shopping to add items!
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
          Shopping Cart ({itemCount} items)
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.product._id} className="py-6 flex">
                  <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.product.images[0] ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${item.product.images[0]}` : '/placeholder-product.jpg'}
                      alt={item.product.title}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to={`/products/${item.product._id}`}>
                            {item.product.title}
                          </Link>
                        </h3>
                        <p className="ml-4">LKR {item.product.price * item.quantity}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        By {item.product.creator?.name}
                      </p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 rounded-l-md"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-center min-w-[2rem] border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product._id, Math.min(10, item.quantity + 1))}
                          disabled={item.quantity >= 10}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 rounded-r-md"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product._id)}
                          className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <section aria-labelledby="summary-heading" className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">LKR {total}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">LKR {total}</dd>
              </div>
            </dl>

            <div className="mt-6">
              {isAuthenticated ? (
                <Link
                  to="/checkout"
                  className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex justify-center"
                  >
                    Sign in to Checkout
                  </Link>
                  <Link
                    to="/register"
                    className="w-full bg-gray-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex justify-center"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/products"
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
