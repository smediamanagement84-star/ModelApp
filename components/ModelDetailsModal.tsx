import React, { useState } from 'react';
import { Model } from '../types';
import { X, AlertTriangle, CheckCircle, Mail } from 'lucide-react';

interface ModelDetailsModalProps {
  model: Model;
  onClose: () => void;
}

const ModelDetailsModal: React.FC<ModelDetailsModalProps> = ({ model, onClose }) => {
  const isNSFW = model.category === 'NSFW';
  const [isRevealed, setIsRevealed] = useState(false);

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
        <div className="w-full md:w-1/2 relative bg-gray-100 min-h-[400px] md:min-h-[600px]">
          <img
            src={model.imageUrl}
            alt={model.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              isNSFW && !isRevealed ? 'blur-xl scale-110' : 'blur-0 scale-100'
            }`}
          />
          
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

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <span className="text-2xl font-light">${model.price}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">/ Hour</span>
          </div>

          <div className="space-y-8 flex-1">
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
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Hair</span>
                  <span className="font-medium">{model.stats.hairColor}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Eyes</span>
                  <span className="font-medium">{model.stats.eyeColor}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6">
              <h3 className="font-serif text-lg mb-2">Availability</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Available for bookings in New York, Paris, and Milan. Open for travel arrangements.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-widest">
                <CheckCircle className="w-4 h-4" />
                Available this week
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6">
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
  );
};

export default ModelDetailsModal;