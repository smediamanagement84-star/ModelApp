import React, { useState, useEffect } from 'react';
import { Check, X, Search, ShieldAlert, User, Calendar, Mail, Phone, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import StudioSignature from '../../components/StudioSignature';
import { useApplications } from '../../lib/hooks/useApplications';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Application } from '../../lib/database.types';

// Transform Application to display format
interface DisplayApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  nationality: string;
  city: string;
  height: number | null;
  ethnicity: string | null;
  specialties: string[] | null;
  bio: string | null;
  professionalRole: string;
  submittedAt: string;
  photos: {
    headshot: string;
    fullBody: string | null;
  };
  // Measurements
  bust: number | null;
  waist: number | null;
  hips: number | null;
  shoeSize: string | null;
  hairColor: string | null;
  eyeColor: string | null;
}

const transformApplication = (app: Application): DisplayApplication => ({
  id: app.id,
  firstName: app.first_name,
  lastName: app.last_name,
  email: app.email,
  phone: app.phone,
  dob: app.dob || '',
  gender: app.gender || 'Not specified',
  nationality: app.nationality || 'Not specified',
  city: app.city || 'Not specified',
  height: app.height,
  ethnicity: app.ethnicity,
  specialties: app.specialties,
  bio: app.bio,
  professionalRole: app.professional_role,
  submittedAt: app.created_at,
  photos: {
    headshot: app.headshot_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    fullBody: app.portfolio_urls?.[0] || null
  },
  // These fields are collected later during talent onboarding
  bust: null,
  waist: null,
  hips: null,
  shoeSize: null,
  hairColor: null,
  eyeColor: null,
});

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [selectedApp, setSelectedApp] = useState<DisplayApplication | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch applications from Supabase
  const { applications: rawApplications, loading, error, refetch, updateStatus } = useApplications('pending');

  // Transform applications to display format
  const applications = rawApplications.map(transformApplication);

  // Filter by search
  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.firstName.toLowerCase().includes(q) ||
      app.lastName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.city.toLowerCase().includes(q)
    );
  });

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = async (id: string) => {
    if (!selectedApp) return;
    setIsProcessing(true);

    try {
      // First, create talent profile from application
      if (isSupabaseConfigured()) {
        const app = rawApplications.find(a => a.id === id);
        if (app) {
          // Insert into talents table
          const { error: talentError } = await supabase.from('talents').insert({
            name: `${app.first_name} ${app.last_name}`,
            role: app.professional_role,
            category: app.professional_role === 'Model' ? 'New Faces' : null,
            image_url: app.headshot_url,
            price: 25000,
            price_type: 'Negotiable',
            unlock_price: 2500,
            age: app.dob ? new Date().getFullYear() - new Date(app.dob).getFullYear() : null,
            gender: app.gender,
            ethnicity: app.ethnicity ? [app.ethnicity] : null,
            location: app.city,
            tags: app.specialties || [],
            bio: app.bio,
          } as never);

          if (talentError) {
            console.error('Error creating talent:', talentError);
            showNotification('Error creating talent profile: ' + talentError.message, 'error');
            setIsProcessing(false);
            return;
          }
        }
      }

      // Update application status to approved
      const result = await updateStatus(id, 'approved');

      if (result.success) {
        setSelectedApp(null);
        showNotification('Application approved and talent profile created successfully!', 'success');
      } else {
        showNotification(result.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showNotification('An error occurred during approval', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);

    try {
      const result = await updateStatus(id, 'rejected');

      if (result.success) {
        setSelectedApp(null);
        showNotification('Application rejected.', 'error');
      } else {
        showNotification(result.error || 'Failed to reject application', 'error');
      }
    } catch (err) {
      showNotification('An error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex animate-fadeInUp">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-8 border-b border-gray-100">
           <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs">
              <ShieldAlert className="w-4 h-4" /> Admin Portal
           </div>
           <h1 className="font-serif text-2xl mt-2">Dashboard</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'pending' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Pending Applications
            <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{filteredApplications.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'active' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Active Models
          </button>
        </nav>
        
        {/* Sidebar Footer with GTdevS Signature */}
        <div className="mt-auto">
          <div className="p-6 border-t border-gray-100">
             <div className="text-xs text-gray-400">
                <p>Logged in as:</p>
                <p className="font-bold text-gray-800 mt-1">admin@hiretheglam.com</p>
             </div>
          </div>
          <StudioSignature variant="admin" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
         {/* Notification Toast */}
         {notification && (
            <div className={`fixed top-24 right-8 z-50 px-6 py-4 rounded shadow-lg flex items-center gap-3 animate-fadeInUp ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="text-sm font-medium">{notification.message}</span>
            </div>
         )}

         <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h2 className="font-serif text-3xl">{activeTab === 'pending' ? 'New Applications' : 'Active Database'}</h2>
              <button
                onClick={() => refetch()}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="relative">
               <input
                 type="text"
                 placeholder="Search..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black w-64"
               />
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
         </div>

         {/* Content Area */}
         {activeTab === 'pending' ? (
           <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Applicant</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Details</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Submitted</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                        <p className="text-gray-400 mt-2">Loading applications...</p>
                      </td>
                    </tr>
                  )}
                  {!loading && filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <img src={app.photos.headshot} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                             <div>
                                <div className="font-bold text-gray-900">{app.firstName} {app.lastName}</div>
                                <div className="text-xs text-gray-500">{app.email}</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                             <span className="block">{app.city}, {app.nationality}</span>
                             <span className="text-xs text-gray-400">{app.height}cm • {calculateAge(app.dob)}yo</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(app.submittedAt).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="text-xs font-bold uppercase tracking-widest text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                          >
                            Review
                          </button>
                       </td>
                    </tr>
                  ))}
                  {!loading && filteredApplications.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                           {searchQuery ? 'No applications match your search.' : 'No pending applications found.'}
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
           </div>
         ) : (
           <div className="bg-white p-12 text-center border border-gray-200 rounded-lg">
              <p className="text-gray-500">Active database management is read-only in this demo.</p>
           </div>
         )}
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
           <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-lg flex flex-col md:flex-row animate-fadeInUp">
              {/* Left: Photos */}
              <div className="w-full md:w-5/12 bg-gray-100 p-6 flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Submitted Photos</h3>
                  <div className="aspect-[3/4] bg-gray-200 rounded overflow-hidden">
                     <img src={selectedApp.photos.headshot} className="w-full h-full object-cover" alt="Headshot" />
                  </div>
                  {selectedApp.photos.fullBody && (
                    <div className="aspect-[3/4] bg-gray-200 rounded overflow-hidden">
                       <img src={selectedApp.photos.fullBody} className="w-full h-full object-cover" alt="Full Body" />
                    </div>
                  )}
              </div>
              
              {/* Right: Data */}
              <div className="w-full md:w-7/12 p-8 flex flex-col">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="font-serif text-3xl mb-1">{selectedApp.firstName} {selectedApp.lastName}</h2>
                        <div className="flex gap-2 text-xs text-gray-500">
                           <span>{selectedApp.city}</span> • <span>{selectedApp.nationality}</span>
                        </div>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-100 rounded-full">
                       <X className="w-5 h-5" />
                    </button>
                 </div>

                 <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-3 bg-gray-50 rounded">
                          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Contact</div>
                          <div className="text-sm font-medium flex items-center gap-2"><Mail className="w-3 h-3"/> {selectedApp.email}</div>
                          <div className="text-sm font-medium flex items-center gap-2 mt-1"><Phone className="w-3 h-3"/> {selectedApp.phone}</div>
                       </div>
                       <div className="p-3 bg-gray-50 rounded">
                          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Personal</div>
                          <div className="text-sm font-medium flex items-center gap-2"><Calendar className="w-3 h-3"/> {selectedApp.dob}</div>
                          <div className="text-sm font-medium flex items-center gap-2 mt-1"><User className="w-3 h-3"/> {selectedApp.gender}</div>
                       </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-2 mb-3">Measurements</h3>
                        <div className="grid grid-cols-3 gap-y-4 text-sm">
                           <div><span className="text-gray-400 text-xs block">Height</span>{selectedApp.height ? `${selectedApp.height}cm` : 'N/A'}</div>
                           <div><span className="text-gray-400 text-xs block">Bust</span>{selectedApp.bust ? `${selectedApp.bust}cm` : 'N/A'}</div>
                           <div><span className="text-gray-400 text-xs block">Waist</span>{selectedApp.waist ? `${selectedApp.waist}cm` : 'N/A'}</div>
                           <div><span className="text-gray-400 text-xs block">Hips</span>{selectedApp.hips ? `${selectedApp.hips}cm` : 'N/A'}</div>
                           <div><span className="text-gray-400 text-xs block">Shoe</span>{selectedApp.shoeSize || 'N/A'}</div>
                           <div><span className="text-gray-400 text-xs block">Hair</span>{selectedApp.hairColor || 'N/A'}</div>
                           <div><span className="text-gray-400 text-xs block">Eyes</span>{selectedApp.eyeColor || 'N/A'}</div>
                           <div><span className="text-gray-400 text-xs block">Ethnicity</span>{selectedApp.ethnicity || 'N/A'}</div>
                        </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                    <button
                       onClick={() => handleReject(selectedApp.id)}
                       disabled={isProcessing}
                       className="flex-1 py-3 border border-red-200 text-red-600 text-xs uppercase tracking-widest font-bold hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {isProcessing ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                       onClick={() => handleApprove(selectedApp.id)}
                       disabled={isProcessing}
                       className="flex-[2] py-3 bg-black text-white text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {isProcessing ? (
                         <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                       ) : (
                         <><Check className="w-4 h-4" /> Verify & Approve</>
                       )}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
