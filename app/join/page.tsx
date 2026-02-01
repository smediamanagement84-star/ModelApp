import React, { useState, useRef } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Camera, Users, Palette, Phone, Mail, MapPin, X, Check, AlertCircle } from 'lucide-react';
import { ETHNICITIES, PHOTO_STYLES, MUA_SPECIALTIES } from '../../lib/mockData';
import { ProfessionalRole } from '../../types';
import { useSubmitApplication } from '../../lib/hooks/useApplications';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { uploadBase64Image } from '../../lib/storage';

const JoinPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [role, setRole] = useState<ProfessionalRole | null>(null);

  // Supabase submission hook
  const { submit, loading: isSubmitting, error: hookError } = useSubmitApplication();

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    nationality: '',
    city: '',
    height: '',
    ethnicity: '',
    bio: ''
  });

  // Selected styles/specialties for Photographer and MUA
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // Photo uploads
  const [photos, setPhotos] = useState<{ main: string | null; alt: string | null }>({
    main: null,
    alt: null
  });

  const mainPhotoRef = useRef<HTMLInputElement>(null);
  const altPhotoRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStyleToggle = (e: React.MouseEvent, style: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handlePhotoUpload = (type: 'main' | 'alt', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (type: 'main' | 'alt') => {
    setPhotos(prev => ({ ...prev, [type]: null }));
  };

  const handleNext = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      // Upload photos to Supabase Storage if available
      let headshotUrl: string | null = null;
      let portfolioUrls: string[] | null = null;

      if (photos.main) {
        const { url, error } = await uploadBase64Image(photos.main, 'headshots');
        if (error) {
          console.warn('Headshot upload failed:', error);
          // Fall back to base64 if upload fails
          headshotUrl = photos.main;
        } else {
          headshotUrl = url;
        }
      }

      if (photos.alt) {
        const { url, error } = await uploadBase64Image(photos.alt, 'portfolios');
        if (error) {
          console.warn('Portfolio upload failed:', error);
          portfolioUrls = [photos.alt];
        } else if (url) {
          portfolioUrls = [url];
        }
      }

      // Prepare application data
      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || null,
        dob: formData.dob || new Date().toISOString().split('T')[0],
        gender: formData.gender || 'Not specified',
        nationality: formData.nationality || null,
        city: formData.city || 'Not specified',
        professional_role: role as ProfessionalRole,
        height: role === 'Model' && formData.height ? parseInt(formData.height) : null,
        ethnicity: role === 'Model' ? formData.ethnicity || null : null,
        specialties: role !== 'Model' ? selectedStyles : null,
        bio: formData.bio || null,
        headshot_url: headshotUrl,
        portfolio_urls: portfolioUrls,
      };

      const result = await submit(applicationData);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setSubmitError(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmitError(message);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fadeInUp">
        <CheckCircle className="w-16 h-16 text-green-600 mb-6" />
        <h1 className="font-serif text-4xl mb-4">Application Received</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Thank you for applying as a {role}. Our creative directors review submissions weekly.
        </p>
        <button onClick={() => window.location.hash = '/'} className="px-10 py-4 bg-black text-white text-xs uppercase tracking-widest">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:block w-5/12 relative bg-black">
        <img
          src={role === 'Photographer' ? "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1887&auto=format&fit=crop" : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1887&auto=format&fit=crop"}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          alt="Scouting"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-12 left-12 text-white p-6 max-w-lg">
          <h2 className="font-serif text-5xl mb-6">"Elite talent for the global stage."</h2>
        </div>
      </div>

      <div className="w-full lg:w-7/12 p-8 lg:p-20 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {step === 0 ? (
            <div className="animate-fadeInUp">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Step 01</span>
              <h1 className="font-serif text-4xl mt-2 mb-8">Join the Board</h1>
              <p className="text-gray-500 mb-12">Select the role you are applying for to continue.</p>

              <div className="space-y-4">
                {[
                  { id: 'Model', icon: Users, desc: 'Fashion, Commercial, and New Faces.' },
                  { id: 'Photographer', icon: Camera, desc: 'Editorial, Film, and Studio Photographers.' },
                  { id: 'Make-up Artist', icon: Palette, desc: 'High Fashion, SFX, and Bridal MUAs.' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => { setRole(r.id as ProfessionalRole); setSelectedStyles([]); handleNext(); }}
                    className="w-full flex items-center justify-between p-6 border border-gray-100 hover:border-black transition-all group text-left"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                        <r.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{r.id}</h3>
                        <p className="text-sm text-gray-400">{r.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="animate-fadeInUp">
              <div className="mb-12">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Joining as {role}</span>
                <h1 className="font-serif text-4xl mt-2">Professional Details</h1>
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black bg-transparent" />
                    <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-black bg-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <Mail className="absolute left-0 top-3 w-4 h-4 text-gray-300" />
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full border-b border-gray-200 py-3 pl-7 focus:outline-none focus:border-black bg-transparent" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-0 top-3 w-4 h-4 text-gray-300" />
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border-b border-gray-200 py-3 pl-7 focus:outline-none focus:border-black bg-transparent" />
                    </div>
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-0 top-3 w-4 h-4 text-gray-300" />
                    <input required name="address" value={formData.address} onChange={handleChange} placeholder="Mailing / Studio Address" className="w-full border-b border-gray-200 py-3 pl-7 focus:outline-none focus:border-black bg-transparent" />
                  </div>

                  {role === 'Model' ? (
                    <div className="grid grid-cols-2 gap-6 pt-4">
                      <input name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" className="border-b border-gray-200 py-3 focus:outline-none focus:border-black bg-transparent" />
                      <select name="ethnicity" value={formData.ethnicity} onChange={handleChange} className="border-b border-gray-200 py-3 focus:outline-none focus:border-black bg-transparent text-gray-500">
                        <option value="">Select Ethnicity</option>
                        {ETHNICITIES.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <label className="text-xs uppercase tracking-widest text-gray-400 mb-4 block font-bold">
                        {role === 'Photographer' ? 'Photography Styles' : 'MUA Specialties'}
                        {selectedStyles.length > 0 && (
                          <span className="ml-2 text-black">({selectedStyles.length} selected)</span>
                        )}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(role === 'Photographer' ? PHOTO_STYLES : MUA_SPECIALTIES).map(s => {
                          const isSelected = selectedStyles.includes(s);
                          return (
                            <button
                              type="button"
                              key={s}
                              onClick={(e) => handleStyleToggle(e, s)}
                              className={`px-4 py-2 border text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                                isSelected
                                  ? 'border-black bg-black text-white'
                                  : 'border-gray-200 hover:border-black hover:bg-black hover:text-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              {s}
                            </button>
                          );
                        })}
                      </div>
                      {selectedStyles.length === 0 && (
                        <p className="text-xs text-gray-400 mt-2">Please select at least one {role === 'Photographer' ? 'style' : 'specialty'}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Main Photo Upload */}
                    <div
                      onClick={() => !photos.main && mainPhotoRef.current?.click()}
                      className={`aspect-[3/4] border-2 border-dashed flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group relative overflow-hidden ${
                        photos.main ? 'border-black' : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      {photos.main ? (
                        <>
                          <img src={photos.main} alt="Main" className="absolute inset-0 w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removePhoto('main'); }}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-red-50"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-gray-300 mb-2 group-hover:text-black transition-colors" />
                          <span className="text-[10px] uppercase tracking-widest font-bold group-hover:text-black text-center">Main Portfolio Shot</span>
                          <span className="text-[9px] text-gray-400 mt-1">Click to upload</span>
                        </>
                      )}
                      <input
                        ref={mainPhotoRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload('main', e)}
                        className="hidden"
                      />
                    </div>

                    {/* Alt Photo Upload */}
                    <div
                      onClick={() => !photos.alt && altPhotoRef.current?.click()}
                      className={`aspect-[3/4] border-2 border-dashed flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group relative overflow-hidden ${
                        photos.alt ? 'border-black' : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      {photos.alt ? (
                        <>
                          <img src={photos.alt} alt="Alt" className="absolute inset-0 w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removePhoto('alt'); }}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-red-50"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-gray-300 mb-2 group-hover:text-black transition-colors" />
                          <span className="text-[10px] uppercase tracking-widest font-bold group-hover:text-black text-center">Alt Profile Shot</span>
                          <span className="text-[9px] text-gray-400 mt-1">Click to upload</span>
                        </>
                      )}
                      <input
                        ref={altPhotoRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload('alt', e)}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about your professional background and experience..."
                    rows={4}
                    className="w-full border border-gray-100 p-6 text-sm focus:outline-none focus:border-black bg-gray-50"
                  />
                </div>
              )}

              {/* Error Display */}
              {(submitError || hookError) && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium text-sm">Submission Failed</p>
                    <p className="text-red-600 text-xs mt-1">{submitError || hookError}</p>
                  </div>
                </div>
              )}

              <div className="mt-16 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors font-bold"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={(step === 1 && role !== 'Model' && selectedStyles.length === 0) || isSubmitting}
                  className="bg-black text-white px-12 py-4 text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing Application...' : step === 2 ? 'Submit Application' : 'Continue to Portfolio'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
