import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  onShopNow: () => void;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1771&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop"
];

export const LandingPage = ({ onShopNow }: LandingPageProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-20 lg:pt-0 min-h-screen bg-white flex flex-col overflow-hidden">
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="z-10 px-8 md:px-20 lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center bg-white py-12 lg:py-0"
        >
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400">
                StrideZone Collective
              </span>
            </motion.div>

            <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-light leading-[0.85] tracking-tighter uppercase mb-8 text-zinc-900">
              Peak <br /> 
              <span className="font-serif italic text-zinc-400">Motion</span> <br /> 
              Studio
            </h1>

            <p className="text-zinc-500 text-xs md:text-sm max-w-xs leading-relaxed mb-10 font-medium uppercase tracking-[0.15em]">
              Engineered for the elite. Our 2025 collection merges brutalist geometry with tech-comfort.
            </p>
            
            <div className="flex">
              <button 
                onClick={onShopNow}
                className="group relative inline-flex items-center gap-12 py-6 px-1 border-b-2 border-zinc-900 font-black uppercase tracking-[0.4em] text-[10px] transition-all hover:text-zinc-400 hover:border-zinc-200"
              >
                Enter the Zone
                <ArrowRight className="w-5 h-5 group-hover:translate-x-4 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Hero Image Slider */}
        <div className="relative w-full lg:col-span-7 order-1 lg:order-2 h-[50vh] lg:h-screen">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 bg-zinc-100 overflow-hidden"
            >
              <motion.img 
                src={HERO_IMAGES[currentImage]} 
                className="w-full h-full object-cover"
                loading="eager"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "linear" }}
                alt="StrideZone Editorial"
              />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent lg:from-white/20" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/50" />
              
              <div className="absolute bottom-12 left-12 text-white z-20">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="w-8 h-[1px] bg-white/50" />
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/90">
                    EDITION 2025
                  </span>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-3xl md:text-5xl font-serif italic tracking-tight"
                >
                  Pure Aesthetic Force
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Indicators */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-30">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className="group flex items-center gap-4 focus:outline-none"
              >
                <span className={`text-[10px] font-bold transition-opacity duration-500 ${idx === currentImage ? 'opacity-100 text-white' : 'opacity-0 text-white/50'}`}>
                  0{idx + 1}
                </span>
                <div className={`w-[2px] transition-all duration-700 ${idx === currentImage ? 'h-10 bg-white' : 'h-4 bg-white/30 group-hover:bg-white/60'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};