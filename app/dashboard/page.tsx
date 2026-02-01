import React, { useState, useEffect, useRef } from 'react';
import {
  User, Camera, Edit3, Save, X, Calendar, MapPin, Phone, Mail,
  Instagram, Facebook, Twitter, ExternalLink, Plus, Trash2, Loader2, CheckCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { uploadBase64Image } from '../../lib/storage';

interface TalentProfile {
  id: string;
  name: string;
  role: string;
  category: string | null;
  image_url: string | null;
  price: number | null;
  age: number | null;
  gender: string | null;
  ethnicity: string[] | null;
  location: string | null;
  tags: string[] | null;
  bio: string | null;
  height?: number | null;
}

interface TalentStats {
  bust: number | null;
  waist: number | null;
  hips: number | null;
  shoe_size: number | null;
  dress_size: string | null;
  eye_color: string | null;
  hair_color: string | null;
  hair_texture: string | null;
}

interface TalentSocial {
  id: string;
  platform: string;
  handle: string;
  followers: number | null;
}

const ModelDashboard: React.FC = () => {
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [stats, setStats] = useState<TalentStats | null>(null);
  const [socials, setSocials] = useState<TalentSocial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<TalentProfile & TalentStats>>({});
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);

    if (!isSupabaseConfigured()) {
      // Mock data for demo
      setProfile({
        id: 'demo-1',
        name: 'Demo Model',
        role: 'Model',
        category: 'New Faces',
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
        price: 25000,
        age: 24,
        gender: 'Female',
        ethnicity: ['White'],
        location: 'New York',
        tags: ['Editorial', 'Commercial'],
        bio: 'Professional model with 3 years experience in high fashion and editorial shoots.',
        height: 178,
      });
      setStats({
        bust: 85,
        waist: 60,
        hips: 90,
        shoe_size: 39,
        dress_size: 'S',
        eye_color: 'Blue',
        hair_color: 'Blonde',
        hair_texture: 'Straight',
      });
      setSocials([
        { id: '1', platform: 'Instagram', handle: '@demomodel', followers: 15000 },
      ]);
      setLoading(false);
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch talent profile linked to user email
      if (!user.email) {
        setLoading(false);
        return;
      }

      const { data: talent, error: talentError } = await supabase
        .from('talents')
        .select('*')
        .eq('email', user.email)
        .single();

      if (talentError && talentError.code !== 'PGRST116') {
        console.error('Error fetching talent:', talentError);
      }

      if (talent) {
        const talentProfile = talent as TalentProfile;
        setProfile(talentProfile);

        // Fetch stats
        const { data: statsData } = await supabase
          .from('talent_stats')
          .select('*')
          .eq('talent_id', talentProfile.id)
          .single();

        if (statsData) {
          setStats(statsData as TalentStats);
        }

        // Fetch socials
        const { data: socialsData } = await supabase
          .from('talent_socials')
          .select('*')
          .eq('talent_id', talentProfile.id);

        if (socialsData) {
          setSocials(socialsData as TalentSocial[]);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const startEditing = () => {
    setEditForm({
      ...profile,
      ...stats,
    });
    setNewPhoto(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditForm({});
    setNewPhoto(null);
    setIsEditing(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      let imageUrl = profile.image_url;

      // Upload new photo if changed
      if (newPhoto) {
        const { url, error } = await uploadBase64Image(newPhoto, 'profiles');
        if (url) {
          imageUrl = url;
        } else if (error) {
          console.warn('Photo upload failed:', error);
        }
      }

      if (isSupabaseConfigured()) {
        // Update talent profile
        const { error: updateError } = await supabase
          .from('talents')
          .update({
            name: editForm.name,
            bio: editForm.bio,
            location: editForm.location,
            image_url: imageUrl,
          } as never)
          .eq('id', profile.id);

        if (updateError) {
          showNotification('Failed to save: ' + updateError.message, 'error');
          setSaving(false);
          return;
        }

        // Update stats if exists
        if (stats) {
          await supabase
            .from('talent_stats')
            .update({
              bust: editForm.bust,
              waist: editForm.waist,
              hips: editForm.hips,
              shoe_size: editForm.shoe_size,
              dress_size: editForm.dress_size,
              eye_color: editForm.eye_color,
              hair_color: editForm.hair_color,
            } as never)
            .eq('talent_id', profile.id);
        }
      }

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        name: editForm.name || prev.name,
        bio: editForm.bio || prev.bio,
        location: editForm.location || prev.location,
        image_url: imageUrl,
      } : null);

      setStats(prev => prev ? {
        ...prev,
        bust: editForm.bust ?? prev.bust,
        waist: editForm.waist ?? prev.waist,
        hips: editForm.hips ?? prev.hips,
        shoe_size: editForm.shoe_size ?? prev.shoe_size,
        dress_size: editForm.dress_size ?? prev.dress_size,
        eye_color: editForm.eye_color ?? prev.eye_color,
        hair_color: editForm.hair_color ?? prev.hair_color,
      } : null);

      setIsEditing(false);
      setNewPhoto(null);
      showNotification('Profile updated successfully!', 'success');
    } catch (err) {
      showNotification('An error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-4 text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h1 className="font-serif text-3xl mb-4">No Profile Found</h1>
          <p className="text-gray-500 mb-8">
            Your application may still be under review, or you need to apply first.
          </p>
          <button
            onClick={() => window.location.hash = '/join'}
            className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest"
          >
            Apply Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-8 z-50 px-6 py-4 rounded shadow-lg flex items-center gap-3 animate-fadeInUp ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">My Portfolio</span>
            <h1 className="font-serif text-4xl">Dashboard</h1>
          </div>
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-6 py-3 border border-black text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-xs uppercase tracking-widest font-bold hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Photo */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={newPhoto || profile.image_url || 'https://via.placeholder.com/400x533'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-8 h-8" />
                  </button>
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="flex-1 border-b border-gray-200 py-1 focus:outline-none focus:border-black"
                      placeholder="Location"
                    />
                  ) : (
                    <span>{profile.location || 'Not specified'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{profile.age ? `${profile.age} years old` : 'Age not specified'}</span>
                </div>
              </div>

              {/* Social Links */}
              {socials.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Social Media</h3>
                  <div className="space-y-2">
                    {socials.map((social) => (
                      <div key={social.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {social.platform === 'Instagram' && <Instagram className="w-4 h-4" />}
                          {social.platform === 'Facebook' && <Facebook className="w-4 h-4" />}
                          {social.platform === 'Twitter' && <Twitter className="w-4 h-4" />}
                          <span>{social.handle}</span>
                        </div>
                        {social.followers && (
                          <span className="text-gray-400 text-xs">{(social.followers / 1000).toFixed(1)}K</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Name & Bio */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-black text-white text-[10px] uppercase tracking-widest font-bold rounded-full">
                  {profile.role}
                </span>
                {profile.category && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-widest font-bold rounded-full">
                    {profile.category}
                  </span>
                )}
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="font-serif text-3xl w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black mb-4"
                  placeholder="Your Name"
                />
              ) : (
                <h2 className="font-serif text-3xl mb-4">{profile.name}</h2>
              )}

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editForm.bio || ''}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-black"
                    placeholder="Tell agencies about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
                )}
              </div>

              {profile.tags && profile.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Measurements */}
            {stats && profile.role === 'Model' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6">Measurements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Height', value: profile.height, unit: 'cm', key: 'height' },
                    { label: 'Bust', value: stats.bust, unit: 'cm', key: 'bust' },
                    { label: 'Waist', value: stats.waist, unit: 'cm', key: 'waist' },
                    { label: 'Hips', value: stats.hips, unit: 'cm', key: 'hips' },
                    { label: 'Shoe Size', value: stats.shoe_size, unit: '', key: 'shoe_size' },
                    { label: 'Dress Size', value: stats.dress_size, unit: '', key: 'dress_size' },
                    { label: 'Eye Color', value: stats.eye_color, unit: '', key: 'eye_color' },
                    { label: 'Hair Color', value: stats.hair_color, unit: '', key: 'hair_color' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                      {isEditing && typeof item.value === 'number' ? (
                        <input
                          type="number"
                          value={(editForm as Record<string, unknown>)[item.key] as number || ''}
                          onChange={(e) => setEditForm({ ...editForm, [item.key]: e.target.value ? parseInt(e.target.value) : null })}
                          className="w-full border-b border-gray-200 py-1 focus:outline-none focus:border-black"
                        />
                      ) : isEditing && typeof item.value === 'string' ? (
                        <input
                          type="text"
                          value={(editForm as Record<string, unknown>)[item.key] as string || ''}
                          onChange={(e) => setEditForm({ ...editForm, [item.key]: e.target.value })}
                          className="w-full border-b border-gray-200 py-1 focus:outline-none focus:border-black"
                        />
                      ) : (
                        <div className="font-medium">
                          {item.value ?? '-'}{item.unit && item.value ? item.unit : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties (for Photographers/MUAs) */}
            {profile.tags && profile.role !== 'Model' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">
                  {profile.role === 'Photographer' ? 'Photography Styles' : 'Specialties'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-black text-white text-xs uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rate Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Rate Information</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl">
                  {profile.price ? `NPR ${profile.price.toLocaleString()}` : 'Negotiable'}
                </span>
                <span className="text-gray-400 text-sm">/ day rate</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Contact rates are visible to verified agencies only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDashboard;
