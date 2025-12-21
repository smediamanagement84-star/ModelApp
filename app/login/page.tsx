import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Building2, CheckCircle, Star, ShieldAlert } from 'lucide-react';
import { UserRole } from '../../App';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'agency' | 'model'>('agency');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (tab: 'agency' | 'model') => {
    setActiveTab(tab);
    setIsSignUp(false); // Reset signup state when switching tabs
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // ADMIN LOGIN CHECK
    if (email === 'admin@modelapp.com' && password === 'admin123') {
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess('admin');
        }, 1000);
        return;
    }

    // Simulate API Auth
    setTimeout(() => {
      if (email && password) {
        if (activeTab === 'agency' && isSignUp && (!agencyName || !fullName)) {
             setIsLoading(false);
             setError('Please complete all agency details.');
             return;
        }
        setIsLoading(false);
        onLoginSuccess(activeTab);
      } else {
        setIsLoading(false);
        setError('Invalid credentials provided.');
      }
    }, 1500);
  };

  const fillAdminCredentials = () => {
      setEmail('admin@modelapp.com');
      setPassword('admin123');
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Simulate Google Popup Flow
    setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(activeTab);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row animate-fadeInUp">
      {/* Visual Side - Dynamic based on Tab */}
      <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden items-center justify-center transition-all duration-500">
        <div className="absolute inset-0 opacity-60">
           <img 
            key={activeTab} // Force re-render for transition
            src={activeTab === 'agency' 
                ? "https://images.unsplash.com/photo-1550614000-4b9519e02d48?q=80&w=1887&auto=format&fit=crop"
                : "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
            }
            alt="Login Visual" 
            className="w-full h-full object-cover animate-fadeInUp"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="mb-6 flex items-center gap-2 text-white/80 uppercase tracking-widest text-xs font-bold">
            {activeTab === 'agency' ? <Building2 className="w-4 h-4" /> : <Star className="w-4 h-4" />} 
            {activeTab === 'agency' ? 'Agency Partner Program' : 'Model Management'}
          </div>
          <h1 className="font-serif text-5xl leading-tight mb-6">
            {activeTab === 'agency' 
                ? "\"Discover the faces that define the next generation.\""
                : "\"Your career, your portfolio, your future. All in one place.\""
            }
          </h1>
          <p className="text-gray-300 leading-relaxed font-light mb-8">
             {activeTab === 'agency' 
                ? "Access our curated board of premium talent. View real-time availability, secure bookings, and manage your castings in one seamless platform."
                : "Update your measurements, manage your digital portfolio, and respond to direct booking requests from verified agencies."
             }
          </p>

          <div className="space-y-3">
             <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>{activeTab === 'agency' ? 'Verified Talent Database' : 'Secure Booking System'}</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>{activeTab === 'agency' ? 'Direct Booking System' : 'Calendar Management'}</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>{activeTab === 'agency' ? 'Zero Commission on First Booking' : 'Agency Visibility Boost'}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md">
            
           {/* Role Toggle */}
           <div className="flex p-1 bg-gray-100 rounded-lg mb-8 relative">
              <button
                onClick={() => handleTabChange('agency')}
                className={`flex-1 py-2 text-xs uppercase tracking-widest font-bold rounded-md transition-all duration-300 z-10 ${activeTab === 'agency' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Agency
              </button>
              <button
                onClick={() => handleTabChange('model')}
                className={`flex-1 py-2 text-xs uppercase tracking-widest font-bold rounded-md transition-all duration-300 z-10 ${activeTab === 'model' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Model
              </button>
           </div>

           <div className="mb-8">
             <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                {isSignUp ? (activeTab === 'agency' ? 'New Partner Application' : 'Create Account') : 'Welcome Back'}
             </span>
             <h2 className="font-serif text-4xl mt-2">
                {isSignUp 
                    ? (activeTab === 'agency' ? 'Create Agency Account' : 'Join the Board') 
                    : (activeTab === 'agency' ? 'Agency Portal' : 'Model Access')
                }
             </h2>
           </div>

           {/* Google Auth Button */}
           <button 
             type="button"
             onClick={handleGoogleAuth}
             disabled={isLoading}
             className="w-full border border-gray-300 py-3.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors mb-6 group relative overflow-hidden"
           >
             <GoogleIcon />
             <span className="text-sm font-medium text-gray-700">
                {isSignUp ? 'Sign up with Gmail' : 'Continue with Gmail'}
             </span>
           </button>

           <div className="relative flex items-center py-2 mb-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] text-gray-400 uppercase tracking-widest">Or with email</span>
                <div className="flex-grow border-t border-gray-200"></div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
             {isSignUp && activeTab === 'agency' && (
                <div className="space-y-5 animate-fadeInUp">
                    <div className="group">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">Agency Name</label>
                        <input 
                            type="text" 
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                            className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200"
                            placeholder="Elite Models"
                            required={isSignUp}
                        />
                    </div>
                    <div className="group">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">Representative Name</label>
                        <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200"
                            placeholder="John Doe"
                            required={isSignUp}
                        />
                    </div>
                </div>
             )}

             <div className="group">
               <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">
                 {activeTab === 'agency' ? 'Work Email' : 'Personal Email'}
               </label>
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200"
                 placeholder={activeTab === 'agency' ? "name@agency.com" : "you@example.com"}
                 required
               />
             </div>

             <div className="group relative">
               <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">Password</label>
               <input 
                 type={showPassword ? "text" : "password"} 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200 pr-10"
                 placeholder="••••••••"
                 required
               />
               <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-gray-400 hover:text-black transition-colors"
               >
                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
             </div>

             {error && <p className="text-red-600 text-sm bg-red-50 p-3 border border-red-100">{error}</p>}

             <div className="pt-4">
               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isLoading ? 'Processing...' : (
                    activeTab === 'agency' 
                     ? (isSignUp ? 'Create Agency Account' : 'Enter Agency Portal')
                     : (isSignUp ? 'Register Model Account' : 'Access Portfolio')
                 )}
                 {!isLoading && <ArrowRight className="w-4 h-4" />}
               </button>
             </div>
           </form>
           
           <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
               <button 
                  onClick={() => {
                     if (activeTab === 'model') {
                        // Redirect to /join page if they want to sign up as a model
                        if (!isSignUp) window.location.hash = '/join';
                        else setIsSignUp(false); // Toggle back to login
                     } else {
                        setIsSignUp(!isSignUp); 
                     }
                     setError(''); 
                  }}
                  className="text-sm text-gray-600 hover:text-black underline-offset-4 hover:underline transition-all"
               >
                  {activeTab === 'agency'
                    ? (isSignUp ? "Already have an account? Log In" : "Don't have an account? Apply for Access")
                    : (isSignUp ? "Already have an account? Log In" : "Don't have a portfolio? Apply to Join")
                  }
               </button>
               
               {/* Admin Helper Link */}
               <button onClick={fillAdminCredentials} className="text-[10px] uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors flex items-center gap-1">
                 <ShieldAlert className="w-3 h-3" /> Admin Portal
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;