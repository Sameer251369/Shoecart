import { useEffect, useState } from 'react';
import { Search, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

export const OrdersPage = ({ token }: any) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  const DJANGO_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetch(`${DJANGO_URL}/api/orders/my-orders/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => { 
      setOrders(data); 
      setFilteredOrders(data);
      setLoading(false); 
    })
    .catch(() => setLoading(false));
  }, [token]);

  // 1. SAFE NAME RESOLVER
  const getItemName = (item: any) => {
    return item.product_name || item.product?.name || item.name || "StrideZone Product";
  };

  // 2. SAFE PRICE RESOLVER
  const getItemPrice = (item: any) => {
    const price = item.price || item.product?.price || item.unit_price || 0;
    return parseFloat(price).toFixed(2);
  };

  // 3. SAFE IMAGE RESOLVER
  const getItemImage = (item: any) => {
    const imagePath = item.image || item.product?.images?.[0]?.image || item.product_image;
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${DJANGO_URL}${imagePath}`;
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }
    const filtered = orders.filter(order => 
      order.items.some((item: any) => 
        getItemName(item).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
  };

  const getStatusUI = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'shipped':
        return { color: 'text-blue-600', bg: 'bg-blue-600', icon: <Truck className="w-4 h-4" />, text: 'Shipped', desc: 'Your item is on the way' };
      case 'delivered':
        return { color: 'text-green-600', bg: 'bg-green-600', icon: <CheckCircle className="w-4 h-4" />, text: 'Delivered', desc: 'Your item has been delivered' };
      case 'cancelled':
        return { color: 'text-red-500', bg: 'bg-red-500', icon: <XCircle className="w-4 h-4" />, text: 'Cancelled', desc: 'Order was cancelled' };
      default:
        return { color: 'text-orange-500', bg: 'bg-orange-500', icon: <Clock className="w-4 h-4" />, text: 'Confirmed', desc: 'Processing your order' };
    }
  };

  if (loading) return <div className="pt-40 text-center text-sm font-medium text-zinc-500 italic uppercase tracking-widest">Fetching your gear...</div>;

  return (
    /* Changed pt-24 to pt-32 to move page further down under the navbar */
    <div className="min-h-screen bg-[#f1f3f6] pt-32 pb-10 px-4 antialiased">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white shadow-sm rounded-sm p-5 sticky top-32 border border-zinc-200">
            <h2 className="text-lg font-[1000] italic uppercase tracking-tighter mb-6">Filters</h2>
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase mb-4 tracking-[0.2em] text-zinc-400">Order Status</p>
              {['On the way', 'Delivered', 'Cancelled'].map(s => (
                <label key={s} className="flex items-center gap-3 mb-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-none border-zinc-300 accent-black" />
                  <span className="text-xs font-bold uppercase text-zinc-600 group-hover:text-black transition-colors">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN LIST */}
        <div className="flex-1 space-y-4">
          {/* SEARCH BAR */}
          <div className="flex shadow-sm bg-white border border-zinc-200 overflow-hidden mb-6">
            <input 
              type="text" 
              placeholder="Search by product name..."
              className="flex-1 p-4 outline-none text-xs font-bold uppercase tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} className="bg-black text-white px-8 py-4 flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em]">
              <Search className="w-4 h-4" />
              Find
            </button>
          </div>

          {filteredOrders.map((order) => {
            const ui = getStatusUI(order.status);
            const totalAmount = order.total_price || order.total_amount || 
              order.items.reduce((acc: number, item: any) => acc + (parseFloat(item.price || item.unit_price || 0) * item.quantity), 0);

            return (
              <div key={order.id} className="bg-white border border-zinc-200 rounded-sm p-6 hover:shadow-md transition-all mb-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-50">
                   <div className="flex gap-4">
                      <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Order ID: #{order.id}</span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        {new Date(order.created_at || order.date).toLocaleDateString()}
                      </span>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Total Paid</span>
                      <span className="text-sm font-[1000]">₹{parseFloat(totalAmount).toFixed(2)}</span>
                   </div>
                </div>

                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-4 border-b border-zinc-50 last:border-0">
                    <div className="flex gap-6 w-full md:w-2/5">
                      <div className="w-24 h-24 flex-shrink-0 bg-zinc-50 border border-zinc-100 p-2">
                        <img 
                          src={getItemImage(item)} 
                          alt={getItemName(item)} 
                          className="w-full h-full object-contain mix-blend-multiply" 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-xs font-black uppercase tracking-tight text-zinc-900 leading-relaxed mb-1">
                          {getItemName(item)}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Qty: {item.quantity}</p>
                      </div>
                    </div>

                    <div className="w-24">
                      <p className="text-sm font-[1000]">₹{getItemPrice(item)}</p>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${ui.bg}`} />
                        <div className="flex items-center gap-2">
                          <span className={ui.color}>{ui.icon}</span>
                          <p className={`text-[11px] font-black uppercase tracking-widest ${ui.color}`}>
                            {ui.text}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2">
                        {ui.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};