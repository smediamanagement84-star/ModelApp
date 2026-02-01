import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

interface UnlockResult {
  success: boolean;
  error?: string;
}

export function useUnlockedTalents() {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnlockedTalents();
  }, []);

  const fetchUnlockedTalents = async () => {
    if (!isSupabaseConfigured()) {
      // Load from localStorage for demo
      const stored = localStorage.getItem('unlockedTalents');
      if (stored) {
        setUnlockedIds(new Set(JSON.parse(stored)));
      }
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('unlocked_talents')
        .select('talent_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching unlocked talents:', error);
      } else if (data) {
        setUnlockedIds(new Set(data.map((d: { talent_id: string }) => d.talent_id)));
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const unlockTalent = async (talentId: string, price: number): Promise<UnlockResult> => {
    if (!isSupabaseConfigured()) {
      // Demo mode - just add to localStorage
      const newUnlocked = new Set(unlockedIds);
      newUnlocked.add(talentId);
      setUnlockedIds(newUnlocked);
      localStorage.setItem('unlockedTalents', JSON.stringify([...newUnlocked]));
      return { success: true };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Please log in to unlock contacts' };
      }

      // Check if already unlocked
      if (unlockedIds.has(talentId)) {
        return { success: true };
      }

      // Insert unlock record
      const { error } = await supabase
        .from('unlocked_talents')
        .insert({
          user_id: user.id,
          talent_id: talentId,
          amount_paid: price,
          payment_method: 'demo', // TODO: Integrate real payment
        } as never);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      const newUnlocked = new Set(unlockedIds);
      newUnlocked.add(talentId);
      setUnlockedIds(newUnlocked);

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to unlock contact' };
    }
  };

  const isUnlocked = (talentId: string): boolean => {
    return unlockedIds.has(talentId);
  };

  return {
    unlockedIds,
    loading,
    unlockTalent,
    isUnlocked,
    refetch: fetchUnlockedTalents,
  };
}

// Booking request types and hook
export interface BookingRequest {
  id: string;
  talent_id: string;
  talent_name: string;
  agency_id: string;
  project_name: string;
  project_description: string;
  shoot_date: string;
  duration_days: number;
  budget: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
}

export function useBookingRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    if (!isSupabaseConfigured()) {
      // Demo data
      setRequests([]);
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch booking requests (assuming table exists)
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .or(`agency_id.eq.${user.id},talent_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRequests(data as BookingRequest[]);
      }
    } catch (err) {
      console.error('Error fetching booking requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBookingRequest = async (
    talentId: string,
    talentName: string,
    projectName: string,
    description: string,
    shootDate: string,
    durationDays: number,
    budget: number
  ): Promise<UnlockResult> => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      const newRequest: BookingRequest = {
        id: `demo-${Date.now()}`,
        talent_id: talentId,
        talent_name: talentName,
        agency_id: 'demo-agency',
        project_name: projectName,
        project_description: description,
        shoot_date: shootDate,
        duration_days: durationDays,
        budget: budget,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      setRequests(prev => [newRequest, ...prev]);
      return { success: true };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Please log in to send booking requests' };
      }

      const { error } = await supabase
        .from('booking_requests')
        .insert({
          talent_id: talentId,
          agency_id: user.id,
          project_name: projectName,
          project_description: description,
          shoot_date: shootDate,
          duration_days: durationDays,
          budget: budget,
          status: 'pending',
        } as never);

      if (error) {
        return { success: false, error: error.message };
      }

      await fetchRequests();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to send booking request' };
    }
  };

  return {
    requests,
    loading,
    createBookingRequest,
    refetch: fetchRequests,
  };
}
