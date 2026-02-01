import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import type { TalentWithDetails, ProfessionalRole } from '../database.types';
import { MODELS } from '../mockData';
import type { Model } from '../../types';

interface UseTalentsOptions {
  role?: ProfessionalRole;
  category?: string;
  search?: string;
  limit?: number;
}

interface UseTalentsResult {
  talents: Model[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Convert DB talent to app Model type for backwards compatibility
function convertToModel(talent: TalentWithDetails): Model {
  return {
    id: talent.id,
    name: talent.name,
    role: talent.professional_role,
    category: talent.category as Model['category'],
    height: talent.height ?? undefined,
    stats: {
      bust: talent.stats?.bust ?? undefined,
      waist: talent.stats?.waist ?? undefined,
      hips: talent.stats?.hips ?? undefined,
      eyeColor: talent.stats?.eye_color ?? undefined,
      hairColor: talent.stats?.hair_color ?? undefined,
      shoeSize: talent.stats?.shoe_size ?? undefined,
      dressSize: talent.stats?.dress_size ?? undefined,
      hairTexture: talent.stats?.hair_texture ?? undefined,
      specialties: talent.stats?.specialties ?? undefined,
      equipment: talent.stats?.equipment ?? undefined,
      styles: talent.stats?.styles ?? undefined,
    },
    imageUrl: talent.image_url,
    price: talent.price,
    priceType: talent.price_type,
    unlockPrice: talent.unlock_price,
    age: talent.age,
    gender: talent.gender,
    ethnicity: talent.ethnicity,
    location: talent.location,
    unionStatus: talent.union_status ?? undefined,
    tags: talent.tags,
    socials: talent.socials.map(s => ({
      platform: s.platform as 'Instagram' | 'TikTok' | 'YouTube' | 'Twitch',
      handle: s.handle,
      followers: s.followers,
    })),
    bio: talent.bio ?? undefined,
  };
}

export function useTalents(options: UseTalentsOptions = {}): UseTalentsResult {
  const [talents, setTalents] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTalents = async () => {
    // If Supabase is not configured, use mock data
    if (!isSupabaseConfigured()) {
      let result = [...MODELS];

      if (options.role) {
        result = result.filter(m => m.role === options.role);
      }
      if (options.category && options.category !== 'All') {
        result = result.filter(m => m.category === options.category);
      }
      if (options.search) {
        const q = options.search.toLowerCase();
        result = result.filter(m =>
          m.name.toLowerCase().includes(q) ||
          m.tags?.some(t => t.toLowerCase().includes(q))
        );
      }
      if (options.limit) {
        result = result.slice(0, options.limit);
      }

      setTalents(result);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('talents')
        .select(`
          *,
          stats:talent_stats(*),
          socials:talent_socials(*)
        `)
        .eq('is_active', true);

      if (options.role) {
        query = query.eq('professional_role', options.role);
      }
      if (options.category && options.category !== 'All') {
        query = query.eq('category', options.category);
      }
      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,tags.cs.{${options.search}}`);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Convert to Model type for backwards compatibility
      const convertedTalents = (data || []).map(t => convertToModel(t as unknown as TalentWithDetails));

      // If no data from Supabase, fall back to mock data for demo purposes
      if (convertedTalents.length === 0) {
        let result = [...MODELS];
        if (options.role) {
          result = result.filter(m => m.role === options.role);
        }
        if (options.category && options.category !== 'All') {
          result = result.filter(m => m.category === options.category);
        }
        if (options.search) {
          const q = options.search.toLowerCase();
          result = result.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.tags?.some(t => t.toLowerCase().includes(q))
          );
        }
        if (options.limit) {
          result = result.slice(0, options.limit);
        }
        setTalents(result);
      } else {
        setTalents(convertedTalents);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch talents'));
      // Fallback to mock data on error
      let result = [...MODELS];
      if (options.role) {
        result = result.filter(m => m.role === options.role);
      }
      setTalents(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, [options.role, options.category, options.search, options.limit]);

  return { talents, loading, error, refetch: fetchTalents };
}

// Note: useUnlockedTalents has been moved to ./useUnlockedTalents.ts
// Import it from there or from the hooks index
