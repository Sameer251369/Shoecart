import { useEffect, useState } from 'react';
import { Search, Truck, CheckCircle, XCircle, Clock, PackageOpen, ChevronLeft } from 'lucide-react';

interface OrdersPageProps {
  token: string | null;
  onBack: () => void; // Added this to match App.tsx
}

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'https://shoecart-backend1.onrender.com';

export const OrdersPage = ({ token, onBack }: OrdersPageProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/api/orders/my-orders/`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => { 
      const ordersList = Array.isArray(data) ? data : (data.results || []);
      setOrders(ordersList); 
      setFilteredOrders(ordersList);
      setLoading(false); 
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
  }, [token]);

  const getItemName = (item: any) => item.product_name || item.product?.name || "StrideZone Product";
  
  const getItemImage = (item: any) => {
    const imagePath = item.image || item.product?.images?.[0]?.image;
    if (!imagePath) return "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=200&auto=format&fit=crop";
    return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const getStatusUI = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'shipped': return { color: 'text-blue-600', bg: 'bg-blue-600', icon: <Truck className="w-4 h-4" />, text: 'Shipped', desc: 'On the way' };
      case 'delivered': return { color: 'text-green-600', bg: 'bg-green-600', icon: <CheckCircle className="w-4 h-4" />, text: 'Delivered', desc: 'Handed over' };
      case 'cancelled': return { color: 'text-red-500', bg: 'bg-red-500', icon: <XCircle className="w-4 h-4" />, text: 'Cancelled', desc: 'Voided' };
      default: return { color: 'text-orange-500', bg: 'bg-orange-500', icon: <Clock className="w-4 h-4" />, text: 'Confirmed', desc: 'Processing' };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white uppercase tracking-[0.4em] text-[10px] font-black text-zinc-400">
      Loading Orders...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-8">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">My Orders</h1>
            <div className="bg-white p-6 border border-zinc-200">
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Filter By</p>
               {['On the way', 'Delivered', 'Cancelled'].map(s => (
                <label key={s} className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded-none border-zinc-300 accent-black" />
                  <span className="text-[10px] font-bold uppercase">{s}</span>
                </label>
              ))}
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-zinc-200 p-20 text-center">
                <PackageOpen className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No Orders Yet</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const ui = getStatusUI(order.status);
                return (
                  <div key={order.id} className="bg-white border border-zinc-200 p-6">
                    <div className="flex justify-between border-b border-zinc-100 pb-4 mb-6">
                      <span className="text-[10px] font-black uppercase">ID: #{order.id}</span>
                      <span className="text-sm font-black">₹{parseFloat(order.total_price || 0).toLocaleString('en-IN')}</span>
                    </div>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <img src={getItemImage(item)} className="w-16 h-16 object-contain bg-zinc-50 p-2" alt="" />
                        <div className="flex-1">
                          <p className="text-xs font-black uppercase">{getItemName(item)}</p>
                          <p className="text-[10px] text-zinc-400 font-bold">QTY: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center gap-2 ${ui.color}`}>
                            {ui.icon}
                            <span className="text-[10px] font-black uppercase">{ui.text}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};