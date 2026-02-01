import React from 'react';
import { CATEGORIES } from '../lib/mockData';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Using poster image as background since video may be blocked */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
            alt="Fashion"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl text-white font-bold tracking-tighter mb-6">
            THE FUTURE<br/>OF FASHION
          </h1>
          <p className="text-white text-sm md:text-base uppercase tracking-[0.3em] mb-10">
            Premium Talent Management
          </p>
          <button
            onClick={() => onNavigate('/models')}
            className="px-10 py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300 border border-white"
          >
            Discover Talent
          </button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-serif text-4xl text-black">Featured Categories</h2>
          <button
            onClick={() => onNavigate('/models')}
            className="hidden md:flex items-center text-xs uppercase tracking-widest hover:text-gray-500"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.slice(0, 4).map((cat, idx) => (
            <div
              key={cat}
              onClick={() => onNavigate(`/models?category=${cat}`)}
              className="group cursor-pointer relative h-96 overflow-hidden"
            >
              <img
                src={[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1525151425813-5a4f3f8b3798?q=80&w=1892&auto=format&fit=crop'
                ][idx]}
                alt={cat}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-2xl italic">{cat}</h3>
                <span className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 block mt-2">
                  Explore
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-gray-500 mb-4 block">Our Philosophy</span>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-8">
            "Beauty is not just about appearance. It's about attitude, elegance, and the power to inspire."
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Hire The Glam represents the diverse spectrum of beauty in the modern world. From high fashion to commercial, we bridge the gap between extraordinary talent and world-class brands.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
