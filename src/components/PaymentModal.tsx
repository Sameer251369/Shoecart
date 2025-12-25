import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  token: string | null;
  items: CartItem[];
  onSuccess: () => void;
}

// PRODUCTION URL: Connects directly to your Render instance
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'https://shoecart-backend1.onrender.com';

export const PaymentModal = ({ isOpen, onClose, total, token, items, onSuccess }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError("Authentication required."); return; }
    if (items.length === 0) { setError("Bag is empty."); return; }

    setIsProcessing(true);
    setError(null);

    try {
      // Sending order data to Render backend
      const response = await fetch(`${API_BASE_URL}/api/orders/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: total,
          items: items.map(item => ({ 
            product_id: item.id, 
            quantity: item.quantity 
          })),
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.detail || 'Payment declined by provider.');
      }

      // Success sequence
      setIsDone(true);
      
      // Give the user a moment to feel the "Success" state
      setTimeout(() => {
        onSuccess(); // Clears cart
        onClose();
        setIsDone(false);
      }, 3000);

    } catch (err: any) {
      console.error("Order Creation Error:", err);
      setError(err.message || "Network error. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg overflow-hidden rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)]"
          >
            <div className="p-10">
              {!isDone ? (
                <>
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter leading-none">Checkout</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <Lock className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">End-to-end encrypted</span>
                      </div>
                    </div>
                    {!isProcessing && (
                      <button onClick={onClose} className="p-3 hover:bg-zinc-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="mb-8 p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 mb-1">Due Today</p>
                      <p className="text-4xl font-[1000] italic tracking-tighter">₹{total.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{items.length} Products</p>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handlePayment} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 px-1">Card Details</label>
                      <div className="relative">
                        <input 
                          type="text" placeholder="Card Number" 
                          className="w-full px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all font-mono text-sm"
                          required
                          disabled={isProcessing}
                        />
                        <CreditCard className="absolute right-6 top-5 w-5 h-5 text-zinc-300" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <input type="text" placeholder="MM / YY" className="px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-black/5 transition-all font-mono text-sm text-center" required disabled={isProcessing} />
                      <input type="text" placeholder="CVC" className="px-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-black/5 transition-all font-mono text-sm text-center" required disabled={isProcessing} />
                    </div>

                    <button
                      type="submit" disabled={isProcessing}
                      className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Authorizing</span>
                        </div>
                      ) : (
                        "Confirm Payment"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 flex flex-col items-center text-center">
                  <div className="w-28 h-28 bg-black text-white rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-black/20">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-4">Success</h2>
                  <p className="text-zinc-500 text-sm max-w-[240px] leading-relaxed">
                    Your order has been logged at <span className="font-bold">StrideZone</span>. Redirecting to your dashboard...
                  </p>
                </motion.div>
              )}
            </div>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-2">
               <ShieldCheck className="w-4 h-4 text-zinc-400" />
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">StrideZone Secure Checkout</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};