import React, { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Camera, Instagram, Globe, X } from 'lucide-react';
import { EYE_COLORS, HAIR_COLORS, GENDERS, ETHNICITIES } from '../../lib/mockData';

const JoinPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    nationality: '',
    city: '',
    
    // Step 2: Stats & Look & Price
    height: '',
    bust: '',
    waist: '',
    hips: '',
    shoeSize: '',
    hairColor: '',
    eyeColor: '',
    ethnicity: '',
    hasTattoos: 'No',
    hasPiercings: 'No',
    hourlyRate: '',
    priceType: 'Fixed',

    // Step 3: Social & Portfolio
    instagram: '',
    tiktok: '',
    website: '',
    bio: ''
  });

  const [photos, setPhotos] = useState<Record<string, string | null>>({
    headshot: null,
    sideProfile: null,
    waistUp: null,
    fullBodyFront: null,
    fullBodySide: null,
    creative: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (key: string) => {
    setPhotos(prev => ({ ...prev, [key]: null }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setStep(step + 1);
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for Photos
    const requiredPhotos = ['headshot', 'sideProfile', 'waistUp', 'fullBodyFront', 'fullBodySide'];
    const missingPhotos = requiredPhotos.filter(key => !photos[key]);
    
    if (missingPhotos.length > 0) {
      alert("Incomplete Application: Please upload all 5 required photos for verification.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fadeInUp">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Application Received</h1>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
          Thank you for your interest in the Model App Agency Board. Our scouting team reviews applications weekly. If we see a potential fit, we will contact you directly via email.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-10 py-4 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const PhotoUploadField = ({ id, label, subLabel, required = true }: { id: string, label: string, subLabel: string, required?: boolean }) => {
    const isUploaded = !!photos[id];
    
    return (
      <div className="relative aspect-[3/4] group">
        <input 
          type="file" 
          id={`photo-${id}`}
          accept="image/*"
          onChange={(e) => handlePhotoUpload(id, e)}
          className="hidden"
          disabled={isUploaded}
        />
        
        {isUploaded ? (
          <div className="w-full h-full relative rounded-sm overflow-hidden border border-gray-200">
            <img src={photos[id]!} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <button 
              type="button"
              onClick={() => removePhoto(id)}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 text-center border-t border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3" /> Uploaded
              </span>
            </div>
          </div>
        ) : (
          <label 
            htmlFor={`photo-${id}`}
            className={`w-full h-full border-2 border-dashed rounded-sm flex flex-col items-center justify-center p-4 cursor-pointer transition-all bg-white hover:bg-gray-50 relative
              ${required ? 'border-gray-300' : 'border-gray-200'}
            `}
          >
             <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded ${required ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
               {required ? 'Required' : 'Optional'}
             </span>
             <Camera className="w-8 h-8 text-gray-300 mb-3 group-hover:text-black transition-colors" />
             <span className="text-xs uppercase tracking-widest font-bold text-center group-hover:text-black transition-colors">{label}</span>
             <span className="text-[10px] text-gray-400 mt-1 text-center">{subLabel}</span>
             
             <div className="mt-4 px-4 py-1.5 border border-gray-200 rounded-full text-[10px] uppercase tracking-widest text-gray-400 group-hover:border-black group-hover:text-black transition-all">
               Select Photo
             </div>
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Editorial Image (Desktop Only) */}
      <div className="hidden lg:block w-5/12 relative bg-black overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
          alt="Model Scouting" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 text-white p-6 max-w-lg">
          <p className="text-xs uppercase tracking-widest mb-4 text-gray-300">Scouting Season 2024</p>
          <h2 className="font-serif text-5xl leading-tight mb-6">"We don't just find faces. We build icons."</h2>
          <div className="flex gap-4">
             <div className="h-1 w-12 bg-white rounded-full"></div>
             <div className="h-1 w-2 bg-white/30 rounded-full"></div>
             <div className="h-1 w-2 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-7/12 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-12 lg:px-16 lg:py-20">
          
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">New Faces Division</span>
            <h1 className="font-serif text-4xl mt-2 mb-2">Join the Board</h1>
            <p className="text-gray-500 text-sm">Please complete all fields honestly. No professional experience required.</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-4">
            <div className={`flex flex-col items-start ${step >= 1 ? 'text-black' : 'text-gray-300'}`}>
              <span className="text-[10px] uppercase tracking-widest font-bold mb-1">01. Identity</span>
              <div className={`h-1 w-full rounded-full ${step >= 1 ? 'bg-black' : 'bg-gray-100'}`} />
            </div>
            <div className={`flex flex-col items-start ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>
              <span className="text-[10px] uppercase tracking-widest font-bold mb-1">02. Stats</span>
              <div className={`h-1 w-full rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-100'}`} />
            </div>
            <div className={`flex flex-col items-start ${step >= 3 ? 'text-black' : 'text-gray-300'}`}>
              <span className="text-[10px] uppercase tracking-widest font-bold mb-1">03. Portfolio</span>
              <div className={`h-1 w-full rounded-full ${step >= 3 ? 'bg-black' : 'bg-gray-100'}`} />
            </div>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : handleNext}>
            {/* STEP 1: PERSONAL */}
            {step === 1 && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">First Name *</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleChange} 
                      className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200" placeholder="Jane" />
                  </div>
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Last Name *</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleChange} 
                      className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200" placeholder="Doe" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} 
                    className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200" placeholder="jane@example.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                      className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Date of Birth *</label>
                    <input required type="date" name="dob" value={formData.dob} onChange={handleChange} 
                      className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent text-gray-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Nationality *</label>
                    <input required name="nationality" value={formData.nationality} onChange={handleChange} 
                      className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="e.g. American" />
                  </div>
                  <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Current City *</label>
                    <input required name="city" value={formData.city} onChange={handleChange} 
                      className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent" placeholder="e.g. New York" />
                  </div>
                </div>

                <div className="group">
                   <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Gender Identity *</label>
                   <select required name="gender" value={formData.gender} onChange={handleChange}
                    className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent text-gray-800">
                      <option value="">Select Gender</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                </div>
              </div>
            )}

            {/* STEP 2: STATS */}
            {step === 2 && (
              <div className="space-y-8 animate-fadeInUp">
                 <h3 className="font-serif text-xl border-b border-gray-100 pb-2">Measurements</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div className="group">
                     <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Height (cm) *</label>
                     <input required type="number" name="height" value={formData.height} onChange={handleChange} className="w-full border-b border-gray-200 py-1 focus:outline-none focus:border-black bg-transparent" />
                   </div>
                   <div className="group">
                     <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Bust (cm) *</label>
                     <input required type="number" name="bust" value={formData.bust} onChange={handleChange} className="w-full border-b border-gray-200 py-1 focus:outline-none focus:border-black bg-transparent" />
                   </div>
                   <div className="group">
                     <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Waist (cm) *</label>
                     <input required type="number" name="waist" value={formData.waist} onChange={handleChange} className="w-full border-b border-gray-200 py-1 focus:outline-none focus:border-black bg-transparent" />
                   </div>
                   <div className="group">
                     <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Hips (cm) *</label>
                     <input required type="number" name="hips" value={formData.hips} onChange={handleChange} className="w-full border-b border-gray-200 py-1 focus:outline-none focus:border-black bg-transparent" />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group">
                       <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Eye Color *</label>
                       <select required name="eyeColor" value={formData.eyeColor} onChange={handleChange} className="w-full border-b border-gray-200 py-2 bg-transparent focus:outline-none focus:border-black">
                         <option value="">Select</option>
                         {EYE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="group">
                       <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Hair Color *</label>
                       <select required name="hairColor" value={formData.hairColor} onChange={handleChange} className="w-full border-b border-gray-200 py-2 bg-transparent focus:outline-none focus:border-black">
                         <option value="">Select</option>
                         {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="group">
                       <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Shoe Size (EU) *</label>
                       <input required type="number" name="shoeSize" value={formData.shoeSize} onChange={handleChange} className="w-full border-b border-gray-200 py-2 bg-transparent focus:outline-none focus:border-black" />
                    </div>
                 </div>

                 <div className="group">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Ethnicity</label>
                    <select name="ethnicity" value={formData.ethnicity} onChange={handleChange} className="w-full border-b border-gray-200 py-2 bg-transparent focus:outline-none focus:border-black">
                         <option value="">Select Primary Ethnicity</option>
                         {ETHNICITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>

                 {/* Price & Rates Section */}
                 <div className="pt-8 mt-8 border-t border-gray-100">
                    <h3 className="font-serif text-xl mb-6">Rates & Expectations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black">Hourly Rate (NPR)</label>
                            <input 
                              type="number" 
                              name="hourlyRate" 
                              value={formData.hourlyRate} 
                              onChange={handleChange}
                              className="w-full border-b border-gray-200 py-2 text-lg focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-200" 
                              placeholder="15000" 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4 group-focus-within:text-black">Price Flexibility</label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-3 cursor-pointer group/radio">
                                    <div className={`w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${formData.priceType === 'Fixed' ? 'border-black' : 'group-hover/radio:border-gray-400'}`}>
                                        {formData.priceType === 'Fixed' && <div className="w-2 h-2 bg-black rounded-full" />}
                                    </div>
                                    <input type="radio" name="priceType" value="Fixed" checked={formData.priceType === 'Fixed'} onChange={handleChange} className="hidden" />
                                    <span className="text-sm text-gray-700">Fixed Rate</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group/radio">
                                    <div className={`w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${formData.priceType === 'Negotiable' ? 'border-black' : 'group-hover/radio:border-gray-400'}`}>
                                        {formData.priceType === 'Negotiable' && <div className="w-2 h-2 bg-black rounded-full" />}
                                    </div>
                                    <input type="radio" name="priceType" value="Negotiable" checked={formData.priceType === 'Negotiable'} onChange={handleChange} className="hidden" />
                                    <span className="text-sm text-gray-700">Negotiable</span>
                                </label>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            )}

            {/* STEP 3: PORTFOLIO */}
            {step === 3 && (
              <div className="space-y-8 animate-fadeInUp">
                <div className="mb-8">
                  <h3 className="font-serif text-xl mb-2">Digital Portfolio</h3>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">
                    Simple snaps are preferred. No filters, no makeup. Natural light.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <PhotoUploadField id="headshot" label="Headshot" subLabel="Face forward, neutral expression" />
                  <PhotoUploadField id="sideProfile" label="Side Profile" subLabel="Left or right profile view" />
                  <PhotoUploadField id="waistUp" label="Waist Up" subLabel="Mid-shot, arms relaxed" />
                  <PhotoUploadField id="fullBodyFront" label="Full Body" subLabel="Front view, feet visible" />
                  <PhotoUploadField id="fullBodySide" label="Full Body Side" subLabel="Side view, posture check" />
                  <PhotoUploadField id="creative" label="Creative" subLabel="Show us your personality" required={false} />
                </div>

                <div className="pt-8 border-t border-gray-100">
                  <h3 className="font-serif text-xl mb-6">Social Presence</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group relative">
                        <Instagram className="absolute left-0 top-3 w-4 h-4 text-gray-400" />
                        <input name="instagram" value={formData.instagram} onChange={handleChange} 
                          className="w-full border-b border-gray-200 py-2 pl-8 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Instagram Handle" />
                      </div>
                      <div className="group relative">
                        <Globe className="absolute left-0 top-3 w-4 h-4 text-gray-400" />
                        <input name="website" value={formData.website} onChange={handleChange} 
                          className="w-full border-b border-gray-200 py-2 pl-8 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Website / Portfolio URL" />
                      </div>
                    </div>
                    <div className="group">
                       <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Short Bio</label>
                       <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange}
                        className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black bg-transparent rounded-sm" placeholder="Tell us about yourself..." />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                   <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div></div>}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-black text-white px-8 py-3 flex items-center gap-2 text-xs uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : step === 3 ? 'Submit Application' : 'Next Step'}
                {!isSubmitting && step !== 3 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;