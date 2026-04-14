import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPinIcon, 
  CreditCardIcon, 
  CheckCircleIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items: cart, clearCart, total: cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('payhere'); // 'payhere' or 'card'
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Sri Lanka'
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Pre-fill form with user data
    if (user) {
      setShippingForm(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const getFieldError = (name) => {
    if (!touched[name]) return null;
    if (!shippingForm[name]) return 'This field is required';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)) return 'Invalid email address';
    if (name === 'phone' && shippingForm.phone.length < 10) return 'Must be at least 10 digits';
    return null;
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode'
    ];

    for (const field of requiredFields) {
      if (!shippingForm[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingForm.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Basic phone validation
    if (shippingForm.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        products: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: cartTotal,
        shippingAddress: `${shippingForm.firstName} ${shippingForm.lastName}, ${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}, ${shippingForm.country}`,
        customerName: `${shippingForm.firstName} ${shippingForm.lastName}`,
        customerEmail: shippingForm.email,
        customerPhone: shippingForm.phone,
        paymentMethod: paymentMethod
      };

      // Create order with pending status
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders`, orderData);

      if (response.data.order) {
        setOrderId(response.data.order._id);
        
        if (paymentMethod === 'payhere') {
          // Initialize PayHere payment
          initializePayHerePayment(response.data.order);
        } else {
          // For card payments, we'll use a mock system for now
          // In production, you'd integrate with Stripe or another card processor
          setOrderPlaced(true);
          clearCart();
          toast.success('Order placed successfully!');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const initializePayHerePayment = async (order) => {
    // PayHere configuration
    const merchantIdEnv = (import.meta.env.VITE_PAYHERE_MERCHANT_ID || '').trim();
    const isSandbox = (import.meta.env.VITE_PAYHERE_ENV || 'sandbox') === 'sandbox';

    if (!merchantIdEnv) {
      toast.error('PayHere merchant ID not configured. Please contact administrator.');
      return;
    }

    const amountStr = Number(order.totalAmount).toFixed(2);
    const items = (order.products || [])
      .map((item) => (item.product?.title ? item.product.title : 'Item'))
      .join(', ') || 'Order';

    const digitsPhone = (shippingForm.phone || '').replace(/\D/g, '').slice(-10) || '0770000000';
    const retryOrderId = `${order._id}-${Date.now()}`; // visible order id can be unique per attempt

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
      first_name: shippingForm.firstName,
      last_name: shippingForm.lastName,
      email: shippingForm.email,
      phone: digitsPhone,
      address: shippingForm.address,
      city: shippingForm.city,
      country: shippingForm.country,
      order_id: retryOrderId,
      items: items,
      currency: "LKR",
      amount: amountStr,
      hash,
      custom_1: order._id, // Order ID for webhook processing
      custom_2: user._id   // User ID for webhook processing
    };

    // Create PayHere form and submit
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = isSandbox 
      ? 'https://sandbox.payhere.lk/pay/checkout' 
      : 'https://www.payhere.lk/pay/checkout';

    // Add form fields
    Object.keys(payhereConfig).forEach(key => {
      if (payhereConfig[key] !== undefined && payhereConfig[key] !== null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payhereConfig[key];
        form.appendChild(input);
      }
    });

    // Submit form
    document.body.appendChild(form);
    form.submit();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Order Confirmed!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="mt-4 bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Order ID:</p>
              <p className="text-lg font-semibold text-gray-900">#{orderId?.slice(-6)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/orders')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Order Details
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart?.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-4">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${item.product.images[0]}`}
                      alt={item.product.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product.title}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      LKR {(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <span>Total</span>
                  <span>LKR {cartTotal?.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Shipping and taxes will be calculated at the next step.
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${getFieldError('firstName') ? 'border-red-300' : 'border-gray-300'}`}
                      required
                    />
                    {getFieldError('firstName') && <p className="mt-1 text-xs text-red-600">{getFieldError('firstName')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${getFieldError('lastName') ? 'border-red-300' : 'border-gray-300'}`}
                      required
                    />
                    {getFieldError('lastName') && <p className="mt-1 text-xs text-red-600">{getFieldError('lastName')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${getFieldError('email') ? 'border-red-300' : 'border-gray-300'}`}
                      required
                    />
                    {getFieldError('email') && <p className="mt-1 text-xs text-red-600">{getFieldError('email')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${getFieldError('phone') ? 'border-red-300' : 'border-gray-300'}`}
                      required
                    />
                    {getFieldError('phone') && <p className="mt-1 text-xs text-red-600">{getFieldError('phone')}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${getFieldError('address') ? 'border-red-300' : 'border-gray-300'}`}
                      required
                    />
                    {getFieldError('address') && <p className="mt-1 text-xs text-red-600">{getFieldError('address')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${getFieldError('city') ? 'border-red-300' : 'border-gray-300'}`}
                      required
                    />
                    {getFieldError('city') && <p className="mt-1 text-xs text-red-600">{getFieldError('city')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State/Province <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="state"
                      value={shippingForm.state}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${getFieldError('state') ? 'border-red-300' : 'border-gray-300'}`}
                      required
                    />
                    {getFieldError('state') && <p className="mt-1 text-xs text-red-600">{getFieldError('state')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP/Postal Code <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingForm.zipCode}
                      onChange={handleShippingChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${getFieldError('zipCode') ? 'border-red-300' : 'border-gray-300'}`}
                      required
                    />
                    {getFieldError('zipCode') && <p className="mt-1 text-xs text-red-600">{getFieldError('zipCode')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingForm.country}
                      onChange={handleShippingChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  {/* PayHere Option */}
                  <div className="flex items-center">
                    <input
                      id="payhere"
                      name="paymentMethod"
                      type="radio"
                      value="payhere"
                      checked={paymentMethod === 'payhere'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="payhere" className="ml-3 flex items-center">
                      <div className="flex items-center">
                        <img 
                          src="https://www.payhere.lk/downloads/images/payhere-logo-blue-horizontal.png" 
                          alt="PayHere" 
                          className="h-8 w-auto"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">PayHere (Recommended)</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="ml-7 text-sm text-gray-500">
                    <p>• Secure payment gateway</p>
                    <p>• Multiple payment options (Cards, Bank Transfer, eZ Cash, etc.)</p>
                    <p>• Instant payment confirmation</p>
                  </div>

                  {/* Card Option (Mock) */}
                  <div className="flex items-center">
                    <input
                      id="card"
                      name="paymentMethod"
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="card" className="ml-3 flex items-center">
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Credit/Debit Card (Demo)</span>
                    </label>
                  </div>
                  
                  <div className="ml-7 text-sm text-gray-500">
                    <p>• Demo payment system</p>
                    <p>• For testing purposes only</p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <LockClosedIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Secure Payment</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Your payment information is encrypted and secure. We never store your payment details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="bg-white rounded-lg shadow p-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      {paymentMethod === 'payhere' ? 'Proceed to PayHere' : 'Place Order'}
                    </>
                  )}
                </button>
                
                <p className="mt-3 text-sm text-gray-500 text-center">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
