import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        // Get PayHere parameters
        const orderId = searchParams.get('order_id');
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');

        // Since we're on success page, assume payment was successful
        // The webhook should have already updated the order status
        if (orderId) {
          // Extract the actual database order ID (remove timestamp suffix)
          const actualOrderId = orderId.includes('-') ? orderId.split('-')[0] : orderId;
          
          // Try to fetch the order to show details
          try {
            const orderResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/orders/${actualOrderId}`);
            setOrderDetails(orderResponse.data);
            toast.success('Payment successful! Your order has been confirmed.');
          } catch (orderError) {
            console.error('Error fetching order:', orderError);
            toast.success('Payment successful! Your order has been confirmed.');
          }
        } else {
          toast.success('Payment successful! Your order has been confirmed.');
        }
      } catch (error) {
        console.error('Payment success processing error:', error);
        toast.success('Payment successful! Your order has been confirmed.');
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
          
          {orderDetails && (
            <div className="mt-4 bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-600">Order ID:</p>
              <p className="text-lg font-semibold text-gray-900">#{orderDetails._id?.slice(-6)}</p>
              <p className="text-sm text-gray-600 mt-2">Total Amount:</p>
              <p className="text-lg font-semibold text-gray-900">LKR {orderDetails.totalAmount?.toFixed(2)}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/orders')}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Order Details
            <ArrowRightIcon className="ml-2 h-4 w-4" />
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
};

export default PaymentSuccess;

