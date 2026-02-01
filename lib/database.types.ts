export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'agency' | 'model' | 'admin';
export type ProfessionalRole = 'Model' | 'Photographer' | 'Make-up Artist';
export type PriceType = 'Fixed' | 'Negotiable' | 'Day Rate';
export type UnionStatus = 'SAG-AFTRA' | 'Equity' | 'Non-Union';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          avatar_url: string | null;
          agency_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          agency_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          agency_name?: string | null;
          updated_at?: string;
        };
      };
      talents: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          professional_role: ProfessionalRole;
          category: string | null;
          height: number | null;
          age: number;
          gender: string;
          ethnicity: string[];
          location: string;
          bio: string | null;
          image_url: string;
          price: number;
          price_type: PriceType;
          unlock_price: number;
          union_status: UnionStatus | null;
          tags: string[];
          is_active: boolean;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          professional_role: ProfessionalRole;
          category?: string | null;
          height?: number | null;
          age: number;
          gender: string;
          ethnicity?: string[];
          location: string;
          bio?: string | null;
          image_url: string;
          price: number;
          price_type?: PriceType;
          unlock_price: number;
          union_status?: UnionStatus | null;
          tags?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          name?: string;
          professional_role?: ProfessionalRole;
          category?: string | null;
          height?: number | null;
          age?: number;
          gender?: string;
          ethnicity?: string[];
          location?: string;
          bio?: string | null;
          image_url?: string;
          price?: number;
          price_type?: PriceType;
          unlock_price?: number;
          union_status?: UnionStatus | null;
          tags?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          updated_at?: string;
        };
      };
      talent_stats: {
        Row: {
          id: string;
          talent_id: string;
          bust: number | null;
          waist: number | null;
          hips: number | null;
          eye_color: string | null;
          hair_color: string | null;
          hair_texture: string | null;
          shoe_size: number | null;
          dress_size: string | null;
          specialties: string[] | null;
          equipment: string[] | null;
          styles: string[] | null;
        };
        Insert: {
          id?: string;
          talent_id: string;
          bust?: number | null;
          waist?: number | null;
          hips?: number | null;
          eye_color?: string | null;
          hair_color?: string | null;
          hair_texture?: string | null;
          shoe_size?: number | null;
          dress_size?: string | null;
          specialties?: string[] | null;
          equipment?: string[] | null;
          styles?: string[] | null;
        };
        Update: {
          talent_id?: string;
          bust?: number | null;
          waist?: number | null;
          hips?: number | null;
          eye_color?: string | null;
          hair_color?: string | null;
          hair_texture?: string | null;
          shoe_size?: number | null;
          dress_size?: string | null;
          specialties?: string[] | null;
          equipment?: string[] | null;
          styles?: string[] | null;
        };
      };
      talent_socials: {
        Row: {
          id: string;
          talent_id: string;
          platform: string;
          handle: string;
          followers: number;
        };
        Insert: {
          id?: string;
          talent_id: string;
          platform: string;
          handle: string;
          followers?: number;
        };
        Update: {
          talent_id?: string;
          platform?: string;
          handle?: string;
          followers?: number;
        };
      };
      applications: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          address: string | null;
          dob: string;
          gender: string;
          nationality: string | null;
          city: string;
          professional_role: ProfessionalRole;
          height: number | null;
          ethnicity: string | null;
          specialties: string[] | null;
          bio: string | null;
          headshot_url: string | null;
          portfolio_urls: string[] | null;
          status: ApplicationStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
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
          status?: ApplicationStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          address?: string | null;
          dob?: string;
          gender?: string;
          nationality?: string | null;
          city?: string;
          professional_role?: ProfessionalRole;
          height?: number | null;
          ethnicity?: string | null;
          specialties?: string[] | null;
          bio?: string | null;
          headshot_url?: string | null;
          portfolio_urls?: string[] | null;
          status?: ApplicationStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
      };
      unlocked_talents: {
        Row: {
          id: string;
          user_id: string;
          talent_id: string;
          payment_id: string | null;
          amount_paid: number;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          talent_id: string;
          payment_id?: string | null;
          amount_paid: number;
          unlocked_at?: string;
        };
        Update: {
          user_id?: string;
          talent_id?: string;
          payment_id?: string | null;
          amount_paid?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      professional_role: ProfessionalRole;
      price_type: PriceType;
      union_status: UnionStatus;
      application_status: ApplicationStatus;
    };
  };
}

// Convenience types for use in components
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Talent = Database['public']['Tables']['talents']['Row'];
export type TalentStats = Database['public']['Tables']['talent_stats']['Row'];
export type TalentSocial = Database['public']['Tables']['talent_socials']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type UnlockedTalent = Database['public']['Tables']['unlocked_talents']['Row'];

// Combined talent with stats and socials
export interface TalentWithDetails extends Talent {
  stats: TalentStats | null;
  socials: TalentSocial[];
}
