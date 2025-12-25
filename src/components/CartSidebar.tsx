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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-200 flex justify-between items-center bg-gradient-to-b from-zinc-50 to-white">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">Shopping Cart</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Your cart is empty</h3>
                  <p className="text-sm text-zinc-500">Add items to get started</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map(item => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="bg-white border border-zinc-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-zinc-100 shrink-0 overflow-hidden rounded-lg">
                          <img 
                             src={formatImageUrl(item.images?.[0]?.image)} 
                             className="w-full h-full object-cover" 
                             alt={item.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="font-semibold text-sm text-zinc-900 leading-tight">{item.name}</h4>
                            <button 
                              onClick={() => onRemove(item.id)} 
                              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, -1)} 
                                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5 text-zinc-600"/>
                              </button>
                              <span className="w-10 text-center text-sm font-medium text-zinc-900">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, 1)} 
                                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5 text-zinc-600"/>
                              </button>
                            </div>
                            <p className="font-bold text-base text-zinc-900">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-zinc-200 bg-white p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Subtotal</span>
                    <span className="font-medium text-zinc-900">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm pb-3 border-b border-zinc-200">
                    <span className="text-zinc-600">Tax (GST 18%)</span>
                    <span className="font-medium text-zinc-900">₹{(total * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-base font-semibold text-zinc-900">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-zinc-900">₹{(total * 1.18).toFixed(2)}</span>
                      <p className="text-xs text-zinc-500 mt-0.5">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={onCheckout}
                  disabled={items.length === 0}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg py-3.5 font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:cursor-not-allowed"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <p className="text-xs text-center text-zinc-500">
                  Secure checkout powered by Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};