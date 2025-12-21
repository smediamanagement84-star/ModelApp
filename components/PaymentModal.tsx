import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Smartphone, Wallet } from 'lucide-react';

interface PaymentModalProps {
  price: number;
  modelName: string;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'esewa' | 'khalti' | null;

const PaymentModal: React.FC<PaymentModalProps> = ({ price, modelName, onClose, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [walletId, setWalletId] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (walletId.length < 10) {
        setError('Please enter a valid Mobile Number / ID');
        return;
    }
    if (pin.length < 4) {
        setError('Please enter your 4-digit PIN/MPIN');
        return;
    }

    setIsProcessing(true);

    // Simulate Payment Gateway API
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const renderWalletForm = () => {
    const isEsewa = method === 'esewa';
    const brandColor = isEsewa ? 'bg-[#41A124]' : 'bg-[#5C2D91]';
    const brandName = isEsewa ? 'eSewa' : 'Khalti';

    return (
      <div className="animate-fadeInUp">
        <button 
          onClick={() => { setMethod(null); setError(''); setWalletId(''); setPin(''); }} 
          className="text-xs text-gray-400 hover:text-black mb-4 flex items-center gap-1"
        >
          &larr; Back to wallets
        </button>

        <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 text-white ${brandColor}`}>
           <Wallet className="w-6 h-6" />
           <div>
             <h3 className="font-bold text-lg">Pay via {brandName}</h3>
             <p className="text-xs opacity-90">Instant Transfer</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{brandName} ID (Mobile)</label>
                <div className="relative">
                    <input 
                      type="text" 
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98XXXXXXXX"
                      className="w-full border-b border-gray-200 py-2 pl-10 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200 font-mono"
                    />
                    <Smartphone className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{isEsewa ? 'MPIN / Password' : 'Khalti PIN'}</label>
                <input 
                  type="password" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value.slice(0, 6))}
                  placeholder="••••"
                  className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200 font-mono tracking-widest"
                />
            </div>

            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full text-white py-4 mt-4 text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${brandColor}`}
            >
              {isProcessing ? 'Processing...' : `Pay NPR ${price.toLocaleString()} & Unlock`}
              {!isProcessing && <ShieldCheck className="w-4 h-4" />}
            </button>
        </form>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden animate-fadeInUp">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
           <div className="flex items-center gap-3 mb-6 text-black">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full">
                  <Lock className="w-5 h-5" />
              </div>
              <div>
                  <h3 className="font-serif text-xl leading-none">Premium Access</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Secure Payment</p>
              </div>
           </div>

           <div className="bg-gray-50 p-4 border border-gray-100 mb-6">
              <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Unlock Profile: {modelName}</span>
                  <span className="text-sm font-bold">NPR {price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400">Includes contact details & booking info</p>
           </div>

           {!method ? (
             <div className="space-y-4 animate-fadeInUp">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 text-center">Select Payment Method</p>
                
                <button 
                  onClick={() => setMethod('esewa')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 hover:border-[#41A124] hover:bg-[#41A124]/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#41A124] text-white flex items-center justify-center rounded-lg font-bold">e</div>
                    <span className="font-bold text-gray-700 group-hover:text-[#41A124]">eSewa</span>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-[#41A124]">&rarr;</span>
                </button>

                <button 
                  onClick={() => setMethod('khalti')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 hover:border-[#5C2D91] hover:bg-[#5C2D91]/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#5C2D91] text-white flex items-center justify-center rounded-lg font-bold">K</div>
                    <span className="font-bold text-gray-700 group-hover:text-[#5C2D91]">Khalti</span>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-[#5C2D91]">&rarr;</span>
                </button>
             </div>
           ) : renderWalletForm()}

           <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
               <ShieldCheck className="w-3 h-3" />
               <span>Encrypted Secure Payment</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;