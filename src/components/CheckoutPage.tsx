import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Loader2, MapPin, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

interface CheckoutProps {
  cartItems: any[];
  total: number;
  token: string | null;
  onOrderSuccess: () => void;
  onBack: () => void;
}

// Clean API URL logic to ensure no double slashes in production
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '').replace(/\/+$/, '') || 'https://shoecart-backend1.onrender.com';

export const CheckoutPage = ({ cartItems, total, token, onOrderSuccess, onBack }: CheckoutProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', phone: '' });
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'loading' | null, message: string }>({ type: null, message: '' });

  const subtotal = Number(total) || 0;
  const gst = subtotal * 0.18;
  const finalTotal = subtotal + gst;

  const handlePlaceOrder = async () => {
    if (!address.street || !address.phone || !address.city) {
      setNotification({ type: 'error', message: 'Please fill in all shipping details' });
      setTimeout(() => setNotification({ type: null, message: '' }), 3000);
      return;
    }

    if (!token) {
      setNotification({ type: 'error', message: 'You must be logged in to place an order' });
      return;
    }

    setIsProcessing(true);
    setNotification({ type: 'loading', message: 'Processing order...' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: finalTotal.toFixed(2),
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity
          })),
          address: `${address.street}, ${address.city}`,
          phone: address.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: 'success', message: 'Order Placed Successfully!' });
        setTimeout(() => {
          onOrderSuccess();
        }, 1500);
      } else {
        throw new Error(data.error || data.detail || 'Failed to place order');
      }
    } catch (err: any) {
      console.error("Order Error:", err);
      setNotification({ type: 'error', message: err.message || "Unable to connect to server" });
      setTimeout(() => setNotification({ type: null, message: '' }), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white pt-32 pb-20 px-4 md:px-8">
      {notification.type && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${
            notification.type === 'success' ? 'bg-green-50 border border-green-200' :
            notification.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
            {notification.type === 'loading' && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
            <span className={`text-sm font-medium ${
              notification.type === 'success' ? 'text-green-900' :
              notification.type === 'error' ? 'text-red-900' :
              'text-blue-900'
            }`}>
              {notification.message}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Cart</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">Checkout</h1>
        <p className="text-zinc-500 mb-12">Complete your purchase</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">Shipping Address</h2>
                  <p className="text-sm text-zinc-500">Where should we deliver your order?</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="Enter your street address" 
                    className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-sm"
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">City</label>
                    <input 
                      type="text" 
                      placeholder="Enter city" 
                      className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-sm"
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX" 
                      className="w-full border border-zinc-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-sm"
                      onChange={(e) => setAddress({...address, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">Payment Method</h2>
                  <p className="text-sm text-zinc-500">Select your payment option</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 border-2 border-zinc-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">Cash on Delivery</p>
                      <p className="text-sm text-zinc-500">Pay when you receive</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-zinc-900"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm sticky top-32">
              <h3 className="text-lg font-semibold text-zinc-900 mb-6">Order Summary</h3>
              
              <div className="space-y-3 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Subtotal</span>
                  <span className="font-medium text-zinc-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">GST (18%)</span>
                  <span className="font-medium text-zinc-900">₹{gst.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t-2 border-zinc-900 mb-6">
                <span className="text-base font-semibold text-zinc-900">Total</span>
                <span className="text-2xl font-bold text-zinc-900">₹{finalTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/10"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              <p className="text-xs text-center text-zinc-500 mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};