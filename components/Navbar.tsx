
import React, { useState } from 'react';
import { Menu, X, Building2, LogOut, Star, ShieldAlert } from 'lucide-react';
import { CATEGORIES } from '../lib/mockData';
import { UserRole } from '../App';
import StudioSignature from './StudioSignature';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  userRole: UserRole;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, userRole, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  const isLoggedIn = userRole !== null;
  const isAgency = userRole === 'agency';
  const isAdmin = userRole === 'admin';

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNav('/')}>
            <span className="font-serif text-2xl tracking-widest font-bold text-black">
              HIRE THE GLAM
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => handleNav('/models')}
              className={`text-xs uppercase tracking-widest hover:text-gray-500 transition-colors ${currentPage === '/models' ? 'text-black font-bold' : 'text-gray-800'}`}
            >
              Discover Talent
            </button>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => handleNav(`/models?category=${cat}`)}
                className="text-xs uppercase tracking-widest text-gray-800 hover:text-gray-500 transition-colors"
              >
                {cat}
              </button>
            ))}
            
            <div className="h-4 w-px bg-gray-200 mx-2"></div>

            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleNav(isAdmin ? '/admin' : isAgency ? '/models' : '/dashboard')}
                  className={`flex items-center gap-2 text-xs uppercase tracking-widest text-black font-bold border px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${isAdmin ? 'border-red-600 bg-red-600 text-white' : isAgency ? 'border-gray-200 bg-gray-50' : 'border-black bg-black text-white'}`}
                >
                  {isAdmin ? <ShieldAlert className="w-3 h-3" /> : (isAgency ? <Building2 className="w-3 h-3" /> : <Star className="w-3 h-3" />)}
                  {isAdmin ? 'Admin Panel' : (isAgency ? 'Agency' : 'My Portfolio')}
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/login')}
                  className="text-xs uppercase tracking-widest text-black font-bold hover:text-gray-500 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('/join')}
                  className="px-6 py-2 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Join Board
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-500 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full h-screen overflow-y-auto pb-20 z-40">
          <div className="px-4 pt-8 pb-4 space-y-4 flex flex-col items-center">
             <button
              onClick={() => handleNav('/')}
              className="block px-3 py-2 text-lg font-serif text-black hover:text-gray-500"
            >
              Home
            </button>
             <button
              onClick={() => handleNav('/models')}
              className="block px-3 py-2 text-sm uppercase tracking-widest text-black hover:text-gray-500"
            >
              All Models
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleNav(`/models?category=${cat}`)}
                className="block px-3 py-2 text-sm uppercase tracking-widest text-gray-600 hover:text-black"
              >
                {cat}
              </button>
            ))}
            
            <div className="w-12 h-px bg-gray-100 my-4"></div>

            {isLoggedIn ? (
               <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full max-w-xs px-6 py-3 border border-gray-200 text-black text-sm uppercase tracking-widest"
              >
                Logout ({isAdmin ? 'Admin' : (isAgency ? 'Agency' : 'Model')})
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/login')}
                  className="block px-3 py-2 text-sm uppercase tracking-widest font-bold text-black"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('/join')}
                  className="mt-4 w-full max-w-xs px-6 py-3 bg-black text-white text-sm uppercase tracking-widest"
                >
                  Join Board
                </button>
              </>
            )}

            {/* Studio Signature in Mobile Menu */}
            <div className="w-full max-w-xs mt-auto">
               <StudioSignature variant="inline" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
