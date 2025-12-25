import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  formatImageUrl: (path?: string) => string;
  onCheckout: () => void;
}

export const CartSidebar = ({ isOpen, onClose, formatImageUrl, onCheckout }: CartSidebarProps) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Your Bag</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-12 h-12 mb-2" />
                  <p className="uppercase text-xs font-bold">Empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={formatImageUrl(item.image)} alt={item.name} className="w-20 h-20 object-cover bg-zinc-100" />
                    <div className="flex-1">
                      <div className="flex justify-between font-bold text-sm uppercase">
                        <h3>{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)}><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <p className="text-sm">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2 border w-fit">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-zinc-50">
                <div className="flex justify-between mb-4">
                  <span className="text-xs font-bold text-zinc-400 uppercase">Total</span>
                  <span className="text-xl font-black">${cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={onCheckout} className="w-full bg-black text-white py-4 font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-colors">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};