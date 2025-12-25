import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  setToken: (token: string) => void; 
}

/**
 * UPDATED: Uses HTTPS and checks for Netlify Environment Variables.
 * This matches the logic in your App.tsx.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'https://shoecart-backend1.onrender.com';

export const AuthModal = ({ isOpen, onClose, setToken }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/token/' : '/api/register/';
    
    /**
     * UPDATED: Construction of the payload.
     * For login, we send the email inside the 'username' key because 
     * SimpleJWT looks for 'username' by default.
     */
    const payload = isLogin
      ? {
          username: formData.email.toLowerCase().trim(),
          password: formData.password,
        }
      : {
          email: formData.email.toLowerCase().trim(),
          username: formData.username.trim() || formData.email.split('@')[0],
          password: formData.password,
        };

    try {
      // FIXED: Added backticks and the API_BASE_URL variable with the correct protocol
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const tokenValue = data.access || data.token;
        if (tokenValue) {
          setToken(tokenValue);
          onClose();
        } else if (!isLogin) {
          setIsLogin(true);
          setError("Account created! Please sign in.");
        }
      } else {
        // Parse Django's nested error format
        const errorMsg = data.detail || 
                         (data.non_field_errors ? data.non_field_errors[0] : null) ||
                         (data.email ? `Email: ${data.email[0]}` : null) || 
                         (data.username ? `Username: ${data.username[0]}` : null) || 
                         "Please check your credentials.";
        setError(errorMsg);
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 20, opacity: 0 }}
            className="relative bg-white w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl"
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>

            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-zinc-500 text-sm mb-8">
              {isLogin ? 'Enter your details to access your account.' : 'Join our community today.'}
            </p>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  placeholder="name@example.com" 
                  required 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-2">Username</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    placeholder="Display name" 
                    required 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-2">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  placeholder="••••••••" 
                  required 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                disabled={isLoading} 
                className="w-full bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:bg-zinc-300 active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign in' : 'Join StrideZone'}</span> 
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100">
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }} 
                className="w-full text-sm font-medium text-zinc-500 hover:text-black transition-colors"
              >
                {isLogin ? (
                  <span>Don't have an account? <span className="text-black font-bold">Sign up</span></span>
                ) : (
                  <span>Already a member? <span className="text-black font-bold">Log in</span></span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};