import React, { useState } from 'react';
import { Check, X, Search, ShieldAlert, User, Calendar, Mail, Phone, AlertCircle } from 'lucide-react';

// MOCK PENDING APPLICATIONS
const MOCK_APPLICATIONS = [
  {
    id: 'app_001',
    firstName: 'Sienna',
    lastName: 'Brooks',
    email: 'sienna.b@example.com',
    phone: '+1 (555) 123-4567',
    dob: '1999-05-15',
    gender: 'Female',
    nationality: 'Canadian',
    city: 'Toronto',
    height: 177,
    bust: 85,
    waist: 60,
    hips: 90,
    shoeSize: 39,
    hairColor: 'Blonde',
    eyeColor: 'Blue',
    ethnicity: 'White',
    submittedAt: '2024-03-10T10:30:00',
    photos: {
      headshot: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
      fullBody: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop'
    }
  },
  {
    id: 'app_002',
    firstName: 'Kai',
    lastName: 'Tanaka',
    email: 'kai.t@example.com',
    phone: '+81 90-1234-5678',
    dob: '2001-11-20',
    gender: 'Male',
    nationality: 'Japanese',
    city: 'Tokyo',
    height: 185,
    bust: 98,
    waist: 75,
    hips: 92,
    shoeSize: 43,
    hairColor: 'Black',
    eyeColor: 'Brown',
    ethnicity: 'East Asian',
    submittedAt: '2024-03-11T14:15:00',
    photos: {
      headshot: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
      fullBody: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048&auto=format&fit=crop'
    }
  },
  {
    id: 'app_003',
    firstName: 'Zara',
    lastName: 'Mendez',
    email: 'zara.m@example.com',
    phone: '+34 600 000 000',
    dob: '2000-02-14',
    gender: 'Female',
    nationality: 'Spanish',
    city: 'Barcelona',
    height: 172,
    bust: 88,
    waist: 62,
    hips: 93,
    shoeSize: 38,
    hairColor: 'Brunette',
    eyeColor: 'Hazel',
    ethnicity: 'Latinx',
    submittedAt: '2024-03-12T09:45:00',
    photos: {
      headshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
      fullBody: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop'
    }
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState<typeof MOCK_APPLICATIONS[0] | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

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

  const handleApprove = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    setSelectedApp(null);
    showNotification('Application verified and model profile created successfully.', 'success');
  };

  const handleReject = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    setSelectedApp(null);
    showNotification('Application rejected.', 'error');
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
            <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{applications.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'active' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Active Models
          </button>
        </nav>
        <div className="p-6 border-t border-gray-100">
           <div className="text-xs text-gray-400">
              <p>Logged in as:</p>
              <p className="font-bold text-gray-800 mt-1">admin@modelapp.com</p>
           </div>
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
            <h2 className="font-serif text-3xl">{activeTab === 'pending' ? 'New Applications' : 'Active Database'}</h2>
            <div className="relative">
               <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black w-64" />
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
                  {applications.map((app) => (
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
                  {applications.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                           No pending applications found.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
           </div>
         ) : (
           <div className="bg-white p-12 text-center border border-gray-200 rounded-lg">
              <p className="text-gray-500">Active Models database management is read-only in this demo.</p>
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
                  <div className="aspect-[3/4] bg-gray-200 rounded overflow-hidden">
                     <img src={selectedApp.photos.fullBody} className="w-full h-full object-cover" alt="Full Body" />
                  </div>
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
                           <div><span className="text-gray-400 text-xs block">Height</span>{selectedApp.height}cm</div>
                           <div><span className="text-gray-400 text-xs block">Bust</span>{selectedApp.bust}cm</div>
                           <div><span className="text-gray-400 text-xs block">Waist</span>{selectedApp.waist}cm</div>
                           <div><span className="text-gray-400 text-xs block">Hips</span>{selectedApp.hips}cm</div>
                           <div><span className="text-gray-400 text-xs block">Shoe</span>{selectedApp.shoeSize}</div>
                           <div><span className="text-gray-400 text-xs block">Hair</span>{selectedApp.hairColor}</div>
                           <div><span className="text-gray-400 text-xs block">Eyes</span>{selectedApp.eyeColor}</div>
                           <div><span className="text-gray-400 text-xs block">Ethnicity</span>{selectedApp.ethnicity}</div>
                        </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                    <button 
                       onClick={() => handleReject(selectedApp.id)}
                       className="flex-1 py-3 border border-red-200 text-red-600 text-xs uppercase tracking-widest font-bold hover:bg-red-50 transition-colors"
                    >
                       Reject
                    </button>
                    <button 
                       onClick={() => handleApprove(selectedApp.id)}
                       className="flex-[2] py-3 bg-black text-white text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                       <Check className="w-4 h-4" /> Verify & Approve
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