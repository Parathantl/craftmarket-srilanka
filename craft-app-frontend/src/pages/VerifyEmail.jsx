import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(response.data.message);

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        // If we've already succeeded once, ignore subsequent errors (e.g., due to StrictMode double-call)
        if (status === 'success') return;
        setStatus('error');
        setMessage(error.response?.data?.error || 'Email verification failed');

        if (error.response?.data?.error?.includes('expired')) {
          setShowResendForm(true);
        }
      }
    };

    if (!token) return;
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;
    verifyEmail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/resend-verification`, { email });
      toast.success('Verification email sent successfully!');
      setShowResendForm(false);
      setStatus('verifying');
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'verifying' && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            )}
            
            {status === 'success' && (
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-600" />
            )}
            
            {status === 'error' && (
              <XCircleIcon className="mx-auto h-12 w-12 text-red-600" />
            )}

            <div className="mt-4">
              {status === 'verifying' && (
                <p className="text-sm text-gray-600">Verifying your email...</p>
              )}
              
              {status === 'success' && (
                <div>
                  <p className="text-sm text-green-600 font-medium">{message}</p>
                  <p className="text-sm text-gray-600 mt-2">Redirecting to login page...</p>
                </div>
              )}
              
              {status === 'error' && (
                <div>
                  <p className="text-sm text-red-600 font-medium">{message}</p>
                  
                  {showResendForm ? (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-3">Your verification link has expired. Enter your email to receive a new one:</p>
                      <form onSubmit={handleResendVerification} className="space-y-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Resend Verification Email
                        </button>
                      </form>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Go to Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
