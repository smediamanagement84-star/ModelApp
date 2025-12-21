import React, { useState, useEffect } from 'react';
import { 
  MODELS, CATEGORIES, EYE_COLORS, HAIR_COLORS, SHOE_SIZES,
  GENDERS, ETHNICITIES, LOCATIONS, DRESS_SIZES, VIBES, HAIR_TEXTURES 
} from '../../lib/mockData';
import { Model } from '../../types';
import ModelCard from '../../components/ModelCard';
import ModelDetailsModal from '../../components/ModelDetailsModal';
import PaymentModal from '../../components/PaymentModal';
import LoginPromptModal from '../../components/LoginPromptModal';
import { Filter, X, AlertTriangle, Search, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface ModelSearchPageProps {
  initialCategory?: string | null;
  isAgency: boolean;
  onNavigate: (path: string) => void;
}

// Collapsible Filter Section Component
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
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Payment & Unlock State
  const [unlockedModelIds, setUnlockedModelIds] = useState<Set<string>>(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // --- FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<string>('featured');

  // Must Haves
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [ageRange, setAgeRange] = useState<{min: number, max: number}>({ min: 18, max: 80 });

  // Fit / Measurements
  const [heightRange, setHeightRange] = useState<number>(150);
  const [maxWaist, setMaxWaist] = useState<number>(120);
  const [maxHips, setMaxHips] = useState<number>(130);
  const [maxBust, setMaxBust] = useState<number>(130);
  const [selectedDressSize, setSelectedDressSize] = useState<string>('All');
  const [selectedShoeSize, setSelectedShoeSize] = useState<number | 'All'>('All');

  // Appearance
  const [selectedEyeColor, setSelectedEyeColor] = useState<string>('All');
  const [selectedHairColor, setSelectedHairColor] = useState<string>('All');
  const [selectedHairTexture, setSelectedHairTexture] = useState<string>('All');

  // Social & Vibe
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [minFollowers, setMinFollowers] = useState<number>(0);

  // Logistics
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [unionStatus, setUnionStatus] = useState<string>('All');

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Filtering Logic
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let result = MODELS;

      // 1. Text Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(m => 
          m.name.toLowerCase().includes(q) || 
          m.tags?.some(t => t.toLowerCase().includes(q)) ||
          m.location.toLowerCase().includes(q)
        );
      }

      // 2. Must Haves
      if (selectedCategory !== 'All') {
        result = result.filter(m => m.category === selectedCategory);
      }
      if (selectedGenders.length > 0) {
        result = result.filter(m => selectedGenders.includes(m.gender));
      }
      if (selectedEthnicities.length > 0) {
        // Check if model has any of the selected ethnicities
        result = result.filter(m => m.ethnicity.some(e => selectedEthnicities.includes(e)));
      }
      if (selectedLocation !== 'All') {
        result = result.filter(m => m.location === selectedLocation);
      }
      result = result.filter(m => m.age >= ageRange.min && m.age <= ageRange.max);

      // 3. Fit
      result = result.filter(m => m.height >= heightRange);
      result = result.filter(m => m.stats.waist <= maxWaist);
      result = result.filter(m => m.stats.hips <= maxHips);
      result = result.filter(m => m.stats.bust <= maxBust);
      
      if (selectedDressSize !== 'All') {
        result = result.filter(m => m.stats.dressSize === selectedDressSize);
      }
      if (selectedShoeSize !== 'All') {
        result = result.filter(m => m.stats.shoeSize === selectedShoeSize);
      }

      // 4. Appearance
      if (selectedEyeColor !== 'All') {
        result = result.filter(m => m.stats.eyeColor === selectedEyeColor);
      }
      if (selectedHairColor !== 'All') {
        result = result.filter(m => m.stats.hairColor === selectedHairColor);
      }
      if (selectedHairTexture !== 'All') {
        result = result.filter(m => m.stats.hairTexture === selectedHairTexture);
      }

      // 5. Social & Vibe
      if (selectedVibes.length > 0) {
        result = result.filter(m => m.tags?.some(t => selectedVibes.includes(t)));
      }
      if (minFollowers > 0) {
        // If model has no socials, filter out if min > 0
        // Or sum followers? Let's check if any platform has > min
        result = result.filter(m => m.socials && m.socials.some(s => s.followers >= minFollowers));
      }

      // 6. Logistics
      result = result.filter(m => m.price <= maxPrice);
      if (unionStatus !== 'All') {
        result = result.filter(m => m.unionStatus === unionStatus);
      }

      // Sorting
      if (sortOption === 'price-asc') result.sort((a, b) => a.price - b.price);
      else if (sortOption === 'price-desc') result.sort((a, b) => b.price - a.price);
      else if (sortOption === 'height-asc') result.sort((a, b) => a.height - b.height);
      else if (sortOption === 'height-desc') result.sort((a, b) => b.height - a.height);
      else if (sortOption === 'age-asc') result.sort((a, b) => a.age - b.age);

      setFilteredModels(result);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [
    searchQuery, selectedCategory, selectedGenders, selectedEthnicities, selectedLocation, ageRange,
    heightRange, maxWaist, maxHips, maxBust, selectedDressSize, selectedShoeSize,
    selectedEyeColor, selectedHairColor, selectedHairTexture,
    selectedVibes, minFollowers,
    maxPrice, unionStatus, sortOption
  ]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = (selectedModel || showPaymentModal || showLoginPrompt) ? 'hidden' : 'auto';
  }, [selectedModel, showPaymentModal, showLoginPrompt]);

  const toggleArrayFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGenders([]);
    setSelectedEthnicities([]);
    setSelectedLocation('All');
    setAgeRange({ min: 18, max: 80 });
    setHeightRange(150);
    setMaxWaist(120);
    setMaxHips(130);
    setMaxBust(130);
    setSelectedDressSize('All');
    setSelectedShoeSize('All');
    setSelectedEyeColor('All');
    setSelectedHairColor('All');
    setSelectedHairTexture('All');
    setSelectedVibes([]);
    setMinFollowers(0);
    setMaxPrice(100000);
    setUnionStatus('All');
    setSortOption('featured');
  };

  const toggleNSFW = (checked: boolean) => {
    if (checked) setSelectedCategory('NSFW');
    else if (selectedCategory === 'NSFW') setSelectedCategory('All');
  };

  const handleModelClick = (model: Model) => {
    // Agencies can click to see details (and potential lock screen)
    // Non-logged-in users or models see prompt if they try to access sensitive info
    // For now, let's allow viewing the card modal, but unlocking is Agency only.
    if (isAgency) {
        setSelectedModel(model);
    } else {
        // If not an agency, we show the login prompt.
        // NOTE: If we want models to view other models without unlocking, we'd need to change this logic.
        // Currently adhering to "Agency Access Required" for deep details.
        setShowLoginPrompt(true);
    }
  };

  // Payment Handlers
  const handleUnlockRequest = () => {
    // Keep ModelDetailsModal open, but show Payment Modal on top
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedModel) {
        setUnlockedModelIds(prev => new Set(prev).add(selectedModel.id));
        setShowPaymentModal(false);
    }
  };

  const tagClass = (isSelected: boolean) => 
    `px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-all duration-200 cursor-pointer select-none ${
      isSelected 
        ? 'bg-black text-white border-black' 
        : 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
    }`;

  const renderFilterContent = () => (
    <div className="space-y-2">
       {/* General (Renamed from Must Haves) */}
       <FilterSection title="General" defaultOpen={true}>
          {/* Category */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900">Category</h4>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          {/* Gender */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900">Gender Identity</h4>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map(gender => (
                <button
                  key={gender}
                  onClick={() => toggleArrayFilter(gender, selectedGenders, setSelectedGenders)}
                  className={tagClass(selectedGenders.includes(gender))}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div className="mb-6">
             <div className="flex justify-between items-center mb-3">
               <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Age</h4>
               <span className="text-xs text-gray-500">{ageRange.min} - {ageRange.max}</span>
             </div>
             <div className="flex gap-2 items-center">
                <input 
                  type="number" min="16" max="60" 
                  value={ageRange.min} 
                  onChange={e => setAgeRange({...ageRange, min: parseInt(e.target.value)})}
                  className="w-16 p-1.5 text-center border border-gray-200 text-sm focus:outline-none focus:border-black"
                />
                <div className="h-px bg-gray-300 w-4"></div>
                <input 
                  type="number" min="16" max="90" 
                  value={ageRange.max} 
                  onChange={e => setAgeRange({...ageRange, max: parseInt(e.target.value)})}
                  className="w-16 p-1.5 text-center border border-gray-200 text-sm focus:outline-none focus:border-black"
                />
             </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900">Location</h4>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors"
            >
              <option value="All">Anywhere</option>
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

           {/* Ethnicity */}
           <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900">Ethnicity</h4>
            <div className="flex flex-wrap gap-2">
              {ETHNICITIES.map(eth => (
                <button
                  key={eth}
                  onClick={() => toggleArrayFilter(eth, selectedEthnicities, setSelectedEthnicities)}
                  className={tagClass(selectedEthnicities.includes(eth))}
                >
                  {eth}
                </button>
              ))}
            </div>
          </div>
       </FilterSection>

       {/* Fit & Measurements */}
       <FilterSection title="Measurements">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-900 font-medium">Min Height</span>
                <span className="text-gray-500">{heightRange} cm+</span>
              </div>
              <input type="range" min="150" max="200" value={heightRange} onChange={e => setHeightRange(Number(e.target.value))} className="w-full h-1 bg-gray-200 appearance-none accent-black cursor-pointer rounded-full"/>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-900 font-medium">Max Bust</span>
                <span className="text-gray-500">{maxBust} cm</span>
              </div>
              <input type="range" min="70" max="130" value={maxBust} onChange={e => setMaxBust(Number(e.target.value))} className="w-full h-1 bg-gray-200 appearance-none accent-black cursor-pointer rounded-full"/>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-900 font-medium">Max Waist</span>
                <span className="text-gray-500">{maxWaist} cm</span>
              </div>
              <input type="range" min="50" max="120" value={maxWaist} onChange={e => setMaxWaist(Number(e.target.value))} className="w-full h-1 bg-gray-200 appearance-none accent-black cursor-pointer rounded-full"/>
            </div>
            <div>
               <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900 mt-6">Dress Size</h4>
               <div className="flex flex-wrap gap-2">
                 {DRESS_SIZES.map(size => (
                   <button 
                    key={size} 
                    onClick={() => setSelectedDressSize(selectedDressSize === size ? 'All' : size)}
                    className={tagClass(selectedDressSize === size)}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>
            <div>
               <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900 mt-6">Shoe Size (EU)</h4>
               <select 
                 value={selectedShoeSize} 
                 onChange={e => setSelectedShoeSize(e.target.value === 'All' ? 'All' : Number(e.target.value))} 
                 className="w-full p-2.5 text-xs border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors"
               >
                 <option value="All">All Sizes</option>
                 {SHOE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
          </div>
       </FilterSection>

       {/* Appearance */}
       <FilterSection title="Appearance">
          <div className="space-y-4">
             <div>
               <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-900">Hair Color</h4>
               <select 
                 value={selectedHairColor} 
                 onChange={e => setSelectedHairColor(e.target.value)} 
                 className="w-full p-2.5 text-xs border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors"
               >
                 <option value="All">All Colors</option>
                 {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div>
               <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-900">Hair Texture</h4>
               <select 
                 value={selectedHairTexture} 
                 onChange={e => setSelectedHairTexture(e.target.value)} 
                 className="w-full p-2.5 text-xs border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors"
               >
                 <option value="All">All Textures</option>
                 {HAIR_TEXTURES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div>
               <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-900">Eye Color</h4>
               <select 
                 value={selectedEyeColor} 
                 onChange={e => setSelectedEyeColor(e.target.value)} 
                 className="w-full p-2.5 text-xs border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors"
               >
                 <option value="All">All Colors</option>
                 {EYE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
          </div>
       </FilterSection>

       {/* Social & Vibe */}
       <FilterSection title="Vibe & Social">
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900">Vibe / Archetype</h4>
            <div className="flex flex-wrap gap-2">
              {VIBES.map(vibe => (
                <button 
                  key={vibe} 
                  onClick={() => toggleArrayFilter(vibe, selectedVibes, setSelectedVibes)}
                  className={tagClass(selectedVibes.includes(vibe))}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
               <span className="text-gray-900 font-medium">Min Followers</span>
               <span className="text-gray-500">{minFollowers >= 1000 ? (minFollowers/1000).toFixed(0) + 'k' : minFollowers}</span>
            </div>
            <input type="range" min="0" max="500000" step="1000" value={minFollowers} onChange={e => setMinFollowers(Number(e.target.value))} className="w-full h-1 bg-gray-200 appearance-none accent-black cursor-pointer rounded-full"/>
          </div>
       </FilterSection>

       {/* Logistics */}
       <FilterSection title="Logistics">
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
               <span className="text-gray-900 font-medium">Max Hourly Rate</span>
               <span className="text-gray-500">NPR {maxPrice.toLocaleString()}</span>
            </div>
            <input type="range" min="1000" max="100000" step="5000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full h-1 bg-gray-200 appearance-none accent-black cursor-pointer rounded-full"/>
          </div>
          <div>
             <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-900">Union Status</h4>
             <select 
               value={unionStatus} 
               onChange={e => setUnionStatus(e.target.value)} 
               className="w-full p-2.5 text-xs border border-gray-200 bg-white focus:outline-none focus:border-black transition-colors"
             >
               <option value="All">All Statuses</option>
               <option value="Non-Union">Non-Union</option>
               <option value="SAG-AFTRA">SAG-AFTRA</option>
               <option value="Equity">Equity</option>
             </select>
          </div>
       </FilterSection>

       {/* NSFW Toggle */}
       <div className="py-4 border-t border-gray-100 mt-4">
          <label className="flex items-center space-x-3 cursor-pointer group select-none">
            <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${selectedCategory === 'NSFW' ? 'bg-red-600 border-red-600' : 'border-gray-300 group-hover:border-red-400 bg-white'}`}>
              {selectedCategory === 'NSFW' && <Check className="w-3 h-3 text-white" />}
            </div>
            <input 
              type="checkbox" 
              checked={selectedCategory === 'NSFW'}
              onChange={(e) => toggleNSFW(e.target.checked)}
              className="hidden"
            />
            <span className={`text-xs uppercase tracking-widest transition-colors ${selectedCategory === 'NSFW' ? 'text-red-600 font-bold' : 'text-gray-500 group-hover:text-red-500'}`}>
              NSFW Only
            </span>
            {selectedCategory === 'NSFW' && <AlertTriangle className="w-3 h-3 text-red-600" />}
          </label>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-20 z-30 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
        <span className="text-xs text-gray-500">{filteredModels.length} Models</span>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
             <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 custom-scrollbar pb-10">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-xl">Filters</span>
                  <button onClick={clearFilters} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black">
                    Clear All
                  </button>
                </div>
                {renderFilterContent()}
             </div>
          </div>

          {/* Mobile Filters Modal */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col">
              <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                 <span className="font-serif text-xl">Filters</span>
                 <button onClick={() => setIsMobileFiltersOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-24">
                 {renderFilterContent()}
              </div>
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-4">
                 <button onClick={clearFilters} className="flex-1 py-3 border border-gray-200 text-xs uppercase tracking-widest">Clear</button>
                 <button onClick={() => setIsMobileFiltersOpen(false)} className="flex-1 py-3 bg-black text-white text-xs uppercase tracking-widest">Show {filteredModels.length} Models</button>
              </div>
            </div>
          )}

          {/* Model Grid */}
          <div className="flex-1">
             {/* Header & Sort */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="relative w-full sm:w-auto">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Search models, tags..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-9 pr-4 py-2 border-b border-gray-200 focus:border-black focus:outline-none bg-transparent w-full sm:w-64 text-sm"
                   />
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                   <span className="text-xs text-gray-400 uppercase tracking-widest hidden sm:inline">{filteredModels.length} Models Found</span>
                   <select 
                     value={sortOption} 
                     onChange={(e) => setSortOption(e.target.value)}
                     className="text-xs uppercase tracking-widest border-none bg-transparent focus:ring-0 cursor-pointer text-right"
                   >
                     <option value="featured">Featured</option>
                     <option value="price-asc">Price: Low to High</option>
                     <option value="price-desc">Price: High to Low</option>
                     <option value="height-desc">Height: Tallest</option>
                     <option value="age-asc">Age: Youngest</option>
                   </select>
                </div>
             </div>

             {/* Grid */}
             {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 animate-pulse">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="aspect-[3/4] bg-gray-100"></div>
                 ))}
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 min-h-[50vh]">
                 {filteredModels.length > 0 ? (
                    filteredModels.map(model => (
                      <ModelCard 
                        key={model.id} 
                        model={model} 
                        onClick={() => handleModelClick(model)}
                      />
                    ))
                 ) : (
                   <div className="col-span-full py-20 text-center">
                     <p className="font-serif text-2xl mb-2">No models found</p>
                     <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
                     <button onClick={clearFilters} className="mt-6 text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                       Reset all filters
                     </button>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedModel && (
        <ModelDetailsModal 
          model={selectedModel} 
          isUnlocked={unlockedModelIds.has(selectedModel.id)}
          onClose={() => setSelectedModel(null)}
          onUnlockRequest={handleUnlockRequest}
        />
      )}

      {showPaymentModal && selectedModel && (
        <PaymentModal 
          price={selectedModel.unlockPrice} 
          modelName={selectedModel.name}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
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