import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders/my-orders`);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const initializePayHerePayment = async (order) => {
    const merchantIdEnv = (import.meta.env.VITE_PAYHERE_MERCHANT_ID || '').trim();
    const isSandbox = (import.meta.env.VITE_PAYHERE_ENV || 'sandbox') === 'sandbox';
    if (!merchantIdEnv) {
      toast.error('PayHere merchant ID is not configured.');
      return;
    }

    const amountStr = Number(order.totalAmount).toFixed(2);
    const items = (order.products || [])
      .map((p) => (p.product?.title ? p.product.title : 'Item'))
      .join(', ') || 'Order';

    const [firstName, ...rest] = (user?.name || '').split(' ');
    const lastName = rest.join(' ');
    const digitsPhone = (user?.phone || '').replace(/\D/g, '').slice(-10) || '0770000000';
    const retryOrderId = `${order._id}-${Date.now()}`;

    // Fetch hash from backend
    let hash = '';
    let merchantIdFinal = merchantIdEnv;
    try {
      const hashRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/payments/payhere-hash`, {
        orderId: retryOrderId,
        amount: amountStr,
        currency: 'LKR'
      });
      hash = hashRes.data.hash;
      if (hashRes.data.merchantId) {
        merchantIdFinal = String(hashRes.data.merchantId).trim();
      }
    } catch (err) {
      console.error('Error generating PayHere hash:', err);
      toast.error('Failed to prepare payment. Please try again.');
      return;
    }

    const payhereConfig = {
      merchant_id: merchantIdFinal,
      return_url: `${window.location.origin}/payment-success`,
      cancel_url: `${window.location.origin}/payment-cancel`,
      notify_url: `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/payments/payhere-webhook`,
      first_name: firstName || 'Customer',
      last_name: lastName || 'User',
      email: user?.email || 'noemail@example.com',
      phone: digitsPhone,
      address: 'Address',
      city: 'City',
      country: 'Sri Lanka',
      order_id: retryOrderId,
      items: items,
      currency: 'LKR',
      amount: amountStr,
      hash,
      custom_1: order._id,
      custom_2: user?._id
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = isSandbox ? 'https://sandbox.payhere.lk/pay/checkout' : 'https://www.payhere.lk/pay/checkout';

    Object.keys(payhereConfig).forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = payhereConfig[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      confirmed: CheckCircleIcon,
      shipped: TruckIcon,
      delivered: CheckCircleIcon,
      cancelled: XCircleIcon
    };
    return icons[status] || ClockIcon;
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel order');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Track your order history and status</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
            <div className="mt-6">
              <a
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Products
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order._id} className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {order.status}
                        </span>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Amount</p>
                          <p className="text-lg font-semibold text-gray-900">${order.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Items</p>
                          <p className="text-sm text-gray-900">{order.products.length} products</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <p className="text-sm text-gray-900 capitalize">{order.status}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => initializePayHerePayment(order)}
                          className="px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50"
                        >
                          Pay Now
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          Cancel Order
                        </button>
                      )}
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Order Details - #{selectedOrder._id.slice(-6)}
                  </h3>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Order Status</h4>
                    <div className="mt-2 flex items-center">
                      {(() => {
                        const StatusIcon = getStatusIcon(selectedOrder.status);
                        return (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {selectedOrder.status}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Shipping Information</h4>
                    <div className="mt-2 text-sm text-gray-900">
                      <p>{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                      <p>{selectedOrder.shippingAddress?.address}</p>
                      <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                      <p>{selectedOrder.shippingAddress?.country}</p>
                      <p className="mt-1">Email: {selectedOrder.shippingAddress?.email}</p>
                      <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Order Items</h4>
                    <div className="mt-2 space-y-3">
                      {selectedOrder.products?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${item.product.images[0]}`}
                            alt={item.product.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900">{item.product.title}</h5>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <span>Total</span>
                      <span>${selectedOrder.totalAmount}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Order placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
