
import React, { useState, useEffect } from 'react';
import {
  CATEGORIES, PHOTO_STYLES, MUA_SPECIALTIES
} from '../../lib/mockData';
import { Model, ProfessionalRole } from '../../types';
import ModelCard from '../../components/ModelCard';
import ModelDetailsModal from '../../components/ModelDetailsModal';
import PaymentModal from '../../components/PaymentModal';
import LoginPromptModal from '../../components/LoginPromptModal';
import BookingModal from '../../components/BookingModal';
import { useTalents, useUnlockedTalents, useBookingRequests } from '../../lib/hooks';
import { Search, ChevronDown, ChevronUp, Camera, Palette, Users } from 'lucide-react';

interface ModelSearchPageProps {
  initialCategory?: string | null;
  isAgency: boolean;
  onNavigate: (path: string) => void;
}

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-serif text-lg mb-1 focus:outline-none group"
      >
        <span className="group-hover:text-gray-600 transition-colors">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && <div className="mt-4 space-y-6 animate-fadeInUp">{children}</div>}
    </div>
  );
};

const ModelSearchPage: React.FC<ModelSearchPageProps> = ({ initialCategory, isAgency, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<ProfessionalRole>('Model');

  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');

  // Sync category when URL changes (e.g., clicking nav category links)
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Use hooks for data fetching
  const { talents: filteredModels, loading: isLoading } = useTalents({
    role: activeTab,
    category: activeTab === 'Model' ? selectedCategory : undefined,
    search: searchQuery || undefined,
  });

  // Use unlock hook for persistent state
  const { isUnlocked, unlockTalent, loading: unlockLoading } = useUnlockedTalents();
  const { createBookingRequest } = useBookingRequests();

  const handleModelClick = (model: Model) => {
    if (isAgency) setSelectedModel(model);
    else setShowLoginPrompt(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Professional Tabs */}
      <div className="border-b border-gray-100 bg-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 flex">
          {[
            { id: 'Model', label: 'Models', icon: Users },
            { id: 'Photographer', label: 'Photographers', icon: Camera },
            { id: 'Make-up Artist', label: 'Artists', icon: Palette }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfessionalRole)}
              className={`flex items-center gap-2 px-8 py-5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all ${
                activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
             <div className="sticky top-44 max-h-[calc(100vh-12rem)] overflow-y-auto pr-4 custom-scrollbar pb-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-xl">Filters</span>
                </div>
                
                {activeTab === 'Model' ? (
                  <FilterSection title="Division" defaultOpen={true}>
                    <div className="space-y-2">
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`block w-full text-left text-xs uppercase tracking-widest py-1 ${selectedCategory === cat ? 'font-bold text-black' : 'text-gray-400'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                ) : activeTab === 'Photographer' ? (
                  <FilterSection title="Photo Style" defaultOpen={true}>
                    <div className="space-y-2">
                      {PHOTO_STYLES.map(s => (
                        <label key={s} className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 cursor-pointer">
                          <input type="checkbox" className="rounded-none border-gray-300" /> {s}
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                ) : (
                  <FilterSection title="Specialty" defaultOpen={true}>
                    <div className="space-y-2">
                      {MUA_SPECIALTIES.map(s => (
                        <label key={s} className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 cursor-pointer">
                          <input type="checkbox" className="rounded-none border-gray-300" /> {s}
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )}
             </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
             <div className="flex justify-between items-center mb-8 gap-4">
                <div className="relative flex-1 max-w-md">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder={`Search ${activeTab.toLowerCase()}s...`} 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-9 pr-4 py-2 border-b border-gray-200 focus:border-black focus:outline-none bg-transparent w-full text-sm"
                   />
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-widest">{filteredModels.length} Professionals</span>
             </div>

             {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                 {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-gray-100"></div>)}
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                 {filteredModels.map(model => (
                   <div key={model.id} className="relative group">
                     {/* Role Badge */}
                     <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-[0.2em] border border-black/5">
                       {model.role === 'Model' ? model.category : model.role}
                     </div>
                     <ModelCard 
                        model={model} 
                        onClick={() => handleModelClick(model)}
                      />
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>

      {selectedModel && (
        <ModelDetailsModal
          model={selectedModel}
          isUnlocked={isUnlocked(selectedModel.id)}
          onClose={() => setSelectedModel(null)}
          onUnlockRequest={() => setShowPaymentModal(true)}
          onBookingRequest={() => setShowBookingModal(true)}
        />
      )}

      {showPaymentModal && selectedModel && (
        <PaymentModal
          price={selectedModel.unlockPrice}
          modelName={selectedModel.name}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async () => {
            await unlockTalent(selectedModel.id, selectedModel.unlockPrice);
            setShowPaymentModal(false);
          }}
        />
      )}

      {showBookingModal && selectedModel && (
        <BookingModal
          talent={selectedModel}
          onClose={() => setShowBookingModal(false)}
          onSubmit={async (data) => {
            const result = await createBookingRequest(
              selectedModel.id,
              selectedModel.name,
              data.projectName,
              data.description,
              data.shootDate,
              data.durationDays,
              data.budget
            );
            if (result.success) {
              setShowBookingModal(false);
              alert('Booking request sent successfully!');
            } else {
              alert(result.error || 'Failed to send booking request');
            }
          }}
        />
      )}

      {showLoginPrompt && (
        <LoginPromptModal 
          onClose={() => setShowLoginPrompt(false)} 
          onLogin={() => onNavigate('/login')} 
        />
      )}
    </div>
  );
};

export default ModelSearchPage;
