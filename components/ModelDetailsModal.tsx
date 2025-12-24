
import React, { useState } from 'react';
import { Model } from '../types';
import { X, Lock, Mail, ChevronLeft, ChevronRight, Maximize2, CameraIcon, Palette } from 'lucide-react';

interface ModelDetailsModalProps {
  model: Model;
  isUnlocked: boolean;
  onClose: () => void;
  onUnlockRequest: () => void;
}

const getMockPortfolio = (mainImage: string) => [
  mainImage,
  "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop"
];

const ModelDetailsModal: React.FC<ModelDetailsModalProps> = ({ model, isUnlocked, onClose, onUnlockRequest }) => {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const portfolioImages = getMockPortfolio(model.imageUrl);

  if (showPortfolio) {
    return (
      <div className="fixed inset-0 z-[150] bg-black flex flex-col animate-fadeInUp">
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 text-white">
           <div className="flex flex-col">
             <span className="font-serif text-2xl">{model.name}</span>
           </div>
           <button onClick={() => setShowPortfolio(false)} className="p-2"><X className="w-8 h-8" /></button>
        </div>
        <div className="flex-1 relative flex items-center justify-center bg-black">
           <img src={portfolioImages[currentImageIndex]} className="max-h-full max-w-full object-contain" alt="" />
           <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + portfolioImages.length) % portfolioImages.length)} className="absolute left-8 p-3 bg-white/10 text-white rounded-full"><ChevronLeft className="w-8 h-8" /></button>
           <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % portfolioImages.length)} className="absolute right-8 p-3 bg-white/10 text-white rounded-full"><ChevronRight className="w-8 h-8" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row animate-fadeInUp">
        <div className="w-full md:w-1/2 relative bg-gray-100 min-h-[400px]">
          <img src={model.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt={model.name} />
          {isUnlocked && (
             <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 group cursor-pointer" onClick={() => setShowPortfolio(true)}>
                <div className="bg-white/90 px-6 py-3 rounded-full flex items-center gap-2">
                   <Maximize2 className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">View Portfolio</span>
                </div>
             </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative">
          <button onClick={onClose} className="absolute top-6 right-6"><X className="w-6 h-6 text-black" /></button>
          
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2">{model.role}</span>
          <h2 className="font-serif text-5xl mb-6">{model.name}</h2>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-light">NPR {model.price.toLocaleString()}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">/ {model.priceType === 'Day Rate' ? 'Day' : 'Gig'}</span>
            </div>
          </div>

          <div className="space-y-8 flex-1">
             {/* Dynamic Stats Based on Role */}
             <div>
                <h3 className="font-serif text-xl mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                   <div className="flex flex-col">
                      <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Location</span>
                      <span className="font-medium">{model.location}</span>
                   </div>
                   {model.role === 'Model' ? (
                     <div className="flex flex-col">
                        <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Height</span>
                        <span className="font-medium">{model.height} cm</span>
                     </div>
                   ) : model.role === 'Photographer' ? (
                     <div className="flex flex-col">
                        <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Equip.</span>
                        <span className="font-medium">{model.stats.equipment?.[0] || 'Professional'}</span>
                     </div>
                   ) : (
                     <div className="flex flex-col">
                        <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Specialty</span>
                        <span className="font-medium">{model.stats.specialties?.[0] || 'Multi-disciplinary'}</span>
                     </div>
                   )}
                </div>
             </div>

             {/* Unlocked / Locked Logic */}
             <div className="relative">
                {!isUnlocked && (
                  <div className="bg-black text-white p-8 text-center">
                    <Lock className="w-8 h-8 mx-auto mb-4" />
                    <h3 className="font-serif text-xl mb-2">Agency Verification Required</h3>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">Contact details and full portfolio are reserved for verified booking partners.</p>
                    <button onClick={onUnlockRequest} className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-widest">Access for NPR {model.unlockPrice.toLocaleString()}</button>
                  </div>
                )}
                {isUnlocked && (
                  <div className="space-y-6">
                     <div className="bg-gray-50 p-6 border flex items-center justify-between cursor-pointer" onClick={() => setShowPortfolio(true)}>
                        <div className="flex items-center gap-3">
                           {model.role === 'Photographer' ? <CameraIcon className="w-6 h-6" /> : <Palette className="w-6 h-6" />}
                           <span className="font-serif text-lg">Full Portfolio Gallery</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                     </div>
                     <button className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors uppercase tracking-widest text-sm">
                        <Mail className="w-4 h-4" /> Request Quote
                     </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetailsModal;
