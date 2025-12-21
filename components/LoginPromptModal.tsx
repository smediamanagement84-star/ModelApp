import React from 'react';
import { X, Lock, ArrowRight } from 'lucide-react';

interface LoginPromptModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ onClose, onLogin }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-sm shadow-2xl p-8 text-center animate-fadeInUp">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-serif text-2xl mb-3">Agency Access Required</h3>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          To view model profiles, measurements, and availability, you must be logged into the Agency Portal.
        </p>

        <button 
          onClick={onLogin}
          className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
        >
          Enter Agency Portal <ArrowRight className="w-4 h-4" />
        </button>
        
        <p className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest">
          Verified Agencies Only
        </p>
      </div>
    </div>
  );
};

export default LoginPromptModal;