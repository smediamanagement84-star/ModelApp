import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import type { Application, ApplicationStatus, ProfessionalRole } from '../database.types';

interface UseApplicationsResult {
  applications: Application[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateStatus: (id: string, status: ApplicationStatus) => Promise<{ success: boolean; error?: string }>;
}

// Mock applications for development
const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_001',
    first_name: 'Sienna',
    last_name: 'Brooks',
    email: 'sienna.b@example.com',
    phone: '+1 (555) 123-4567',
    address: null,
    dob: '1999-05-15',
    gender: 'Female',
    nationality: 'Canadian',
    city: 'Toronto',
    professional_role: 'Model' as ProfessionalRole,
    height: 177,
    ethnicity: 'White',
    specialties: null,
    bio: null,
    headshot_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
    portfolio_urls: null,
    status: 'pending' as ApplicationStatus,
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2024-03-10T10:30:00Z',
  },
  {
    id: 'app_002',
    first_name: 'Kai',
    last_name: 'Tanaka',
    email: 'kai.t@example.com',
    phone: '+81 90-1234-5678',
    address: null,
    dob: '2001-11-20',
    gender: 'Male',
    nationality: 'Japanese',
    city: 'Tokyo',
    professional_role: 'Model' as ProfessionalRole,
    height: 185,
    ethnicity: 'East Asian',
    specialties: null,
    bio: null,
    headshot_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop',
    portfolio_urls: null,
    status: 'pending' as ApplicationStatus,
    reviewed_by: null,
    reviewed_at: null,
    created_at: '2024-03-11T14:15:00Z',
  },
];

export function useApplications(status?: ApplicationStatus): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = async () => {
    if (!isSupabaseConfigured()) {
      // Use mock data
      let result = [...MOCK_APPLICATIONS];
      if (status) {
        result = result.filter(a => a.status === status);
      }
      setApplications(result);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setApplications((data || []) as Application[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
      setApplications(MOCK_APPLICATIONS);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: ApplicationStatus) => {
    if (!isSupabaseConfigured()) {
      // Mock update
      setApplications(prev => prev.filter(a => a.id !== id));
      return { success: true };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        } as never)
        .eq('id', id);

      if (error) throw error;

      // Refetch to update list
      await fetchApplications();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update status',
      };
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [status]);

  return { applications, loading, error, refetch: fetchApplications, updateStatus };
}

// Application submission data type
interface ApplicationSubmission {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string | null;
  dob: string;
  gender: string;
  nationality?: string | null;
  city: string;
  professional_role: ProfessionalRole;
  height?: number | null;
  ethnicity?: string | null;
  specialties?: string[] | null;
  bio?: string | null;
  headshot_url?: string | null;
  portfolio_urls?: string[] | null;
}

// Hook to submit a new application
export function useSubmitApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: ApplicationSubmission) => {
    if (!isSupabaseConfigured()) {
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);

      const { error: insertError } = await supabase
        .from('applications')
        .insert(data as never);

      if (insertError) throw insertError;
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit application';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
