import React, { useState } from 'react';
import { Menu, X, Search, User } from 'lucide-react';
import { CATEGORIES } from '../lib/mockData';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNav('/')}>
            <span className="font-serif text-2xl tracking-widest font-bold text-black">
              MODEL APP
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => handleNav('/models')}
              className={`text-xs uppercase tracking-widest hover:text-gray-500 transition-colors ${currentPage === '/models' ? 'text-black font-bold' : 'text-gray-800'}`}
            >
              All Models
            </button>
            {CATEGORIES.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => handleNav(`/models?category=${cat}`)}
                className="text-xs uppercase tracking-widest text-gray-800 hover:text-gray-500 transition-colors"
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => handleNav('/join')}
              className="px-6 py-2 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Join Board
            </button>
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
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full h-screen overflow-y-auto pb-20">
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
            <button
              onClick={() => handleNav('/join')}
              className="mt-6 w-full max-w-xs px-6 py-3 bg-black text-white text-sm uppercase tracking-widest"
            >
              Join Board
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;