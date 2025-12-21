import React from 'react';

interface StudioSignatureProps {
  variant?: 'fixed' | 'inline' | 'admin';
}

const StudioSignature: React.FC<StudioSignatureProps> = ({ variant = 'fixed' }) => {
  const isFixed = variant === 'fixed';
  const isAdmin = variant === 'admin';

  // Variants for different placements
  const wrapperClasses = isFixed
    ? "fixed bottom-8 right-8 z-[200] animate-fadeInUp"
    : "w-full py-4 transition-all duration-500";

  const glassStyle = isFixed
    ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl px-5 py-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/20 hover:border-white/40 hover:shadow-gold/20"
    : isAdmin 
      ? "bg-transparent border-t border-gray-100 px-6 py-6 text-gray-400 hover:text-black"
      : "bg-transparent border-t border-gray-50 px-4 py-6 text-gray-400 hover:text-black";

  return (
    <div className={wrapperClasses}>
      <div className={`group flex items-center gap-3 transition-all duration-700 cursor-default ${glassStyle}`}>
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium font-serif italic">
          Engineered by <span className="font-bold not-italic tracking-widest transition-colors duration-500 group-hover:text-amber-500">GTdevS</span>
        </span>
        
        {/* Active Intelligence Glow Dot */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"></span>
        </div>
      </div>
    </div>
  );
};

export default StudioSignature;