import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  total: number;
  formatImageUrl: (path?: string) => string;
  token: string | null;
  onCheckout: () => void;
}

export const CartSidebar = ({ 
  isOpen, onClose, items, onUpdateQuantity, onRemove, total, formatImageUrl, onCheckout 
}: CartSidebarProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[60]"
          />
          
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter leading-none">Your Bag</h2>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 font-bold">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'} selected
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-all duration-300 hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-zinc-200" />
                  </div>
                  <p className="uppercase font-black tracking-[0.2em] text-[10px] text-zinc-400">Your bag is currently empty</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50">
                  {items.map(item => (
                    <div key={item.id} className="p-8 flex gap-6 hover:bg-zinc-50/50 transition-colors group">
                      <div className="w-28 h-32 bg-zinc-100 shrink-0 overflow-hidden rounded-xl border border-zinc-100 relative">
                        <img 
                           src={formatImageUrl(item.images?.[0]?.image)} 
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                           alt={item.name}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-bold uppercase text-sm tracking-tighter leading-tight italic">{item.name}</h4>
                          <button 
                            onClick={() => onRemove(item.id)} 
                            className="text-zinc-300 hover:text-black transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-white border border-zinc-200 rounded-full p-1 shadow-sm">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)} 
                              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-full transition-colors"
                            >
                              <Minus className="w-3 h-3"/>
                            </button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)} 
                              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-full transition-colors"
                            >
                              <Plus className="w-3 h-3"/>
                            </button>
                          </div>
                          <p className="font-[1000] text-sm tracking-tighter">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-zinc-100 bg-white/80 backdrop-blur-md">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="font-black uppercase text-[10px] tracking-[0.3em] text-zinc-400">Total Amount</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold">$</span>
                    <span className="font-[1000] text-4xl tracking-tighter italic">{total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pb-1">Tax included</div>
              </div>
              
              <button 
                onClick={onCheckout}
                disabled={items.length === 0}
                className="group relative w-full bg-black text-white rounded-2xl py-6 font-black uppercase text-xs tracking-[0.3em] overflow-hidden transition-all active:scale-[0.98] disabled:bg-zinc-200 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span>Secure Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};