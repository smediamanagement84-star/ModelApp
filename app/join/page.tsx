
import React, { useState } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Camera, Instagram, Globe, X, User, Users, Palette, Phone, Mail, MapPin } from 'lucide-react';
import { EYE_COLORS, HAIR_COLORS, GENDERS, ETHNICITIES, PHOTO_STYLES, MUA_SPECIALTIES } from '../../lib/mockData';
import { ProfessionalRole } from '../../types';

const JoinPage: React.FC = () => {
  const [step, setStep] = useState(0); // 0 is Role Selection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [role, setRole] = useState<ProfessionalRole | null>(null);

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
    bust: '',
    waist: '',
    hips: '',
    shoeSize: '',
    hairColor: '',
    eyeColor: '',
    ethnicity: '',
    hourlyRate: '',
    priceType: 'Fixed',
    instagram: '',
    bio: ''
  });

  const [photos, setPhotos] = useState<Record<string, string | null>>({
    headshot: null,
    sideProfile: null,
    portfolio1: null,
    portfolio2: null,
    portfolio3: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fadeInUp">
        <CheckCircle className="w-16 h-16 text-green-600 mb-6" />
        <h1 className="font-serif text-4xl mb-4">Application Received</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Thank you for applying as a {role}. Our creative directors review submissions weekly.
        </p>
        <button onClick={() => window.location.href = '/'} className="px-10 py-4 bg-black text-white text-xs uppercase tracking-widest">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:block w-5/12 relative bg-black">
        <img 
          src={role === 'Photographer' ? "https://images.unsplash.com/photo-1554080353-a576cf803bda" : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"} 
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
                      onClick={() => { setRole(r.id as ProfessionalRole); handleNext(); }}
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
            <form onSubmit={step === 2 ? handleSubmit : handleNext} className="animate-fadeInUp">
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
                        <label className="text-xs uppercase tracking-widest text-gray-400 mb-4 block font-bold">{role === 'Photographer' ? 'Photography Styles' : 'MUA Specialties'}</label>
                        <div className="flex flex-wrap gap-2">
                           {(role === 'Photographer' ? PHOTO_STYLES : MUA_SPECIALTIES).map(s => (
                             <button 
                               type="button" 
                               key={s} 
                               className="px-4 py-2 border border-gray-100 text-[10px] uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all"
                             >
                               {s}
                             </button>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
              ) : (
                <div className="space-y-8">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="aspect-[3/4] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 hover:border-black transition-colors cursor-pointer group">
                         <Camera className="w-8 h-8 text-gray-300 mb-2 group-hover:text-black transition-colors" />
                         <span className="text-[10px] uppercase tracking-widest font-bold group-hover:text-black">Main Portfolio Shot</span>
                      </div>
                      <div className="aspect-[3/4] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 hover:border-black transition-colors cursor-pointer group">
                         <Camera className="w-8 h-8 text-gray-300 mb-2 group-hover:text-black transition-colors" />
                         <span className="text-[10px] uppercase tracking-widest font-bold group-hover:text-black">Alt Profile Shot</span>
                      </div>
                   </div>
                   <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about your professional background and experience..." rows={4} className="w-full border border-gray-100 p-6 text-sm focus:outline-none focus:border-black bg-gray-50" />
                </div>
              )}

              <div className="mt-16 flex justify-between items-center">
                 <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors font-bold">
                   <ChevronLeft className="w-4 h-4" /> Back
                 </button>
                 <button type="submit" className="bg-black text-white px-12 py-4 text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-all shadow-xl">
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
