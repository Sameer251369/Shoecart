import { useState } from 'react';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CheckoutProps {
  cartItems: any[];
  total: number;
  token: string | null;
  onOrderSuccess: () => void;
  onBack: () => void;
}

export const CheckoutPage = ({ cartItems, total, token, onOrderSuccess, onBack }: CheckoutProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', phone: '' });

  const handlePlaceOrder = async () => {
    if (!address.street || !address.phone) {
      toast.error("Please fill in shipping details");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Processing order...');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: total,
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity
          })),
          address: `${address.street}, ${address.city}`
        })
      });

      if (response.ok) {
        toast.success('Order Placed Successfully!', { id: loadingToast });
        onOrderSuccess();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to place order');
      }
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-black mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Bag</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-8">Shipping</h2>
            <div className="grid gap-6">
              <input 
                type="text" placeholder="STREET ADDRESS" 
                className="w-full border-b border-zinc-200 py-4 focus:outline-none focus:border-black transition-colors uppercase text-[10px] font-bold tracking-widest"
                onChange={(e) => setAddress({...address, street: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-6">
                <input 
                  type="text" placeholder="CITY" 
                  className="border-b border-zinc-200 py-4 focus:outline-none focus:border-black uppercase text-[10px] font-bold tracking-widest"
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                />
                <input 
                  type="text" placeholder="PHONE NUMBER" 
                  className="border-b border-zinc-200 py-4 focus:outline-none focus:border-black uppercase text-[10px] font-bold tracking-widest"
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter mb-6">Payment</h2>
            <div className="p-6 border-2 border-black rounded-2xl flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-4">
                <CreditCard className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Mock Payment Mode Enabled</span>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-zinc-50 rounded-[2.5rem] p-10 border border-zinc-100 sticky top-32">
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-zinc-500">{item.name} x{item.quantity}</span>
                  <span className="text-[10px] font-black uppercase">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-6 flex justify-between items-baseline">
              <span className="text-sm font-black uppercase">Total</span>
              <span className="text-3xl font-[1000] italic tracking-tighter">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] mt-10 hover:bg-zinc-800 transition-all active:scale-95 disabled:bg-zinc-200 flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};