import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const DonateModal = ({ isOpen, onClose, athlete }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await loadRazorpay();
      if (!res) {
        setError('Razorpay SDK failed to load');
        return;
      }

      // Create order
      const { data } = await axios.post(`/api/payments/create-order`, {
        amount: Number(amount),
        athleteId: athlete._id
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'UnnatiVeer',
        description: `Donation to ${athlete.fullName}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post('/api/payments/verify-payment', response);
            if (verificationResponse.data.message === 'Payment verified successfully') {
              setError(null);
              const successMessage = document.createElement('div');
              successMessage.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]';
              successMessage.innerHTML = `
                <div class="bg-[#0F0F2D] p-8 rounded-xl border border-green-500/20 w-full max-w-md text-center">
                  <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-semibold text-white mb-2">Payment Successful!</h3>
                  <p class="text-gray-400 mb-6">Thank you for your generous donation of ₹${amount} to ${athlete.fullName}</p>
                  <button class="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-lg transition-colors duration-300 font-medium">Done</button>
                </div>
              `;
              document.body.appendChild(successMessage);
              
              // Add click event to close button
              const closeBtn = successMessage.querySelector('button');
              closeBtn.onclick = () => {
                document.body.removeChild(successMessage);
                onClose();
              };
            } else {
              setError('Payment verification failed');
            }
          } catch (error) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: athlete.fullName,
          email: athlete.email
        },
        theme: {
          color: '#4CAF50'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0F0F2D] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4">Donate to {athlete.fullName}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Amount (INR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="Enter amount"
              min="1"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleDonate}
              disabled={loading || !amount}
              className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Donate'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;