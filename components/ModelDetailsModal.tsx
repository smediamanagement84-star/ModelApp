import React, { useState } from 'react';
import { Model } from '../types';
import { X, AlertTriangle, CheckCircle, Mail, Lock, Instagram, Globe, Camera, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ModelDetailsModalProps {
  model: Model;
  isUnlocked: boolean;
  onClose: () => void;
  onUnlockRequest: () => void;
}

// Mock additional images for the portfolio simulation
const getMockPortfolio = (mainImage: string) => [
  mainImage,
  "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a302d2052574?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop"
];

const ModelDetailsModal: React.FC<ModelDetailsModalProps> = ({ model, isUnlocked, onClose, onUnlockRequest }) => {
  const isNSFW = model.category === 'NSFW';
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const portfolioImages = getMockPortfolio(model.imageUrl);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % portfolioImages.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + portfolioImages.length) % portfolioImages.length);
  };

  // Gallery Overlay Component
  if (showPortfolio) {
    return (
      <div className="fixed inset-0 z-[150] bg-black flex flex-col animate-fadeInUp">
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 text-white">
           <div className="flex flex-col">
             <span className="font-serif text-2xl">{model.name}</span>
             <span className="text-[10px] uppercase tracking-widest text-gray-400">Portfolio &bull; {currentImageIndex + 1} / {portfolioImages.length}</span>
           </div>
           <button 
             onClick={() => setShowPortfolio(false)} 
             className="p-2 hover:bg-white/10 rounded-full transition-colors"
           >
             <X className="w-8 h-8" />
           </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
           {/* Image */}
           <img 
             src={portfolioImages[currentImageIndex]} 
             alt={`Portfolio ${currentImageIndex + 1}`} 
             className="max-h-full max-w-full object-contain transition-opacity duration-300"
           />

           {/* Navigation */}
           <button 
             onClick={handlePrevImage}
             className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
           >
             <ChevronLeft className="w-8 h-8" />
           </button>
           <button 
             onClick={handleNextImage}
             className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
           >
             <ChevronRight className="w-8 h-8" />
           </button>
        </div>

        {/* Thumbnails */}
        <div className="h-24 bg-neutral-900 border-t border-neutral-800 flex items-center gap-4 px-6 overflow-x-auto custom-scrollbar">
           {portfolioImages.map((img, idx) => (
             <button 
               key={idx}
               onClick={() => setCurrentImageIndex(idx)}
               className={`relative h-16 aspect-[3/4] flex-shrink-0 overflow-hidden border-2 transition-all ${
                 currentImageIndex === idx ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
               }`}
             >
               <img src={img} className="w-full h-full object-cover" alt="" />
             </button>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row animate-fadeInUp">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 md:hidden p-2 bg-white/50 rounded-full"
        >
          <X className="w-6 h-6 text-black" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 relative bg-gray-100 min-h-[400px] md:min-h-[600px] group">
          <img
            src={model.imageUrl}
            alt={model.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              isNSFW && !isRevealed ? 'blur-xl scale-110' : 'blur-0 scale-100'
            }`}
          />
          
          {/* View Portfolio Overlay Button (Only if unlocked) */}
          {isUnlocked && (
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 pointer-events-auto cursor-pointer" onClick={() => setShowPortfolio(true)}>
                   <Maximize2 className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">Expand</span>
                </div>
             </div>
          )}
          
          {/* NSFW Overlay */}
          {isNSFW && !isRevealed && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
              <div className="bg-white/90 backdrop-blur-md px-8 py-6 flex flex-col items-center shadow-lg text-center mx-4">
                <div className="flex items-center gap-2 mb-3 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="font-serif text-xl">Sensitive Content</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 max-w-xs leading-relaxed">
                  This model's portfolio contains material that may not be suitable for all audiences.
                </p>
                <button
                  onClick={() => setIsRevealed(true)}
                  className="bg-black text-white text-xs uppercase tracking-widest px-8 py-3 hover:bg-red-600 transition-colors"
                >
                  Reveal Content
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative bg-white">
          <button 
            onClick={onClose}
            className="hidden md:block absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-black" />
          </button>

          <div className="mb-2">
             <span className={`text-xs uppercase tracking-[0.2em] font-bold ${isNSFW ? 'text-red-600' : 'text-gray-400'}`}>
              {model.category}
            </span>
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-black">
            {model.name}
          </h2>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-light">NPR {model.price.toLocaleString()}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest">/ Hour</span>
            </div>
            {model.priceType && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm border ${
                model.priceType === 'Negotiable' 
                  ? 'bg-green-50 text-green-700 border-green-100' 
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}>
                {model.priceType}
              </span>
            )}
          </div>

          <div className="space-y-8 flex-1">
            {/* Measurements (Always Visible) */}
            <div>
              <h3 className="font-serif text-xl mb-4">Measurements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Height</span>
                  <span className="font-medium">{model.height} cm</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Bust</span>
                  <span className="font-medium">{model.stats.bust} cm</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Waist</span>
                  <span className="font-medium">{model.stats.waist} cm</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Hips</span>
                  <span className="font-medium">{model.stats.hips} cm</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Shoe Size</span>
                  <span className="font-medium">{model.stats.shoeSize} EU</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Eyes</span>
                  <span className="font-medium">{model.stats.eyeColor}</span>
                </div>
              </div>
            </div>

            {/* LOCKED CONTENT: Availability & Contact */}
            <div className="relative">
                {/* Blur Overlay if Locked */}
                {!isUnlocked && (
                    <div className="absolute -inset-4 z-10 backdrop-blur-[6px] bg-white/40 flex items-center justify-center border border-white/20">
                        <div className="bg-black text-white p-6 text-center shadow-2xl max-w-sm mx-4">
                            <Lock className="w-8 h-8 mx-auto mb-4" />
                            <h3 className="font-serif text-xl mb-2">Premium Profile</h3>
                            <p className="text-gray-300 text-xs mb-6 leading-relaxed">
                                To view {model.name}'s direct contact information, availability calendar, and social handles, a one-time platform fee is required.
                            </p>
                            <button 
                                onClick={onUnlockRequest}
                                className="w-full bg-white text-black py-3 text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors font-bold"
                            >
                                Unlock for NPR {model.unlockPrice.toLocaleString()}
                            </button>
                        </div>
                    </div>
                )}

                <div className={`space-y-8 ${!isUnlocked ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                    {/* NEW: View Portfolio Button (Only visible when unlocked) */}
                    <div className="border border-black p-6 bg-gray-50 flex items-center justify-between group cursor-pointer hover:bg-black hover:text-white transition-colors duration-300" onClick={() => setShowPortfolio(true)}>
                       <div className="flex items-center gap-3">
                          <Camera className="w-6 h-6" />
                          <div>
                            <h3 className="font-serif text-lg leading-none">Full Portfolio</h3>
                            <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60">{portfolioImages.length} High-Res Images</p>
                          </div>
                       </div>
                       <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="bg-gray-50 p-6 border border-gray-100">
                        <h3 className="font-serif text-lg mb-2">Availability</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            Available for bookings in {model.location}. Open for travel arrangements.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-widest">
                            <CheckCircle className="w-4 h-4" />
                            Available this week
                        </div>
                    </div>

                    {/* Socials - Only show if unlocked */}
                    {model.socials && model.socials.length > 0 && (
                        <div>
                            <h3 className="font-serif text-lg mb-4">Social Media</h3>
                            <div className="flex gap-4">
                                {model.socials.map((social, idx) => (
                                    <a key={idx} href="#" className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm hover:border-black transition-colors">
                                        {social.platform === 'Instagram' ? <Instagram className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                        <span>{social.handle}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <button className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors uppercase tracking-widest text-sm">
                        <Mail className="w-4 h-4" />
                        Request Booking
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-widest">
                        Response time usually under 2 hours
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetailsModal;