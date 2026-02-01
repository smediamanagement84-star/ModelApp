# Database Setup - Supabase

## Configuration
1. Create Supabase project at https://supabase.com
2. Copy Project URL and anon key to `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Schema
Run `supabase/schema.sql` in Supabase SQL Editor to create:
- `profiles` - User profiles (extends auth.users)
- `talents` - Models, Photographers, MUAs
- `talent_stats` - Measurements, specialties
- `talent_socials` - Social media links
- `applications` - New talent applications
- `unlocked_talents` - Paid access tracking

## Seed Data
Run `supabase/seed.sql` to populate sample data.

## RLS Policies
- Profiles: Public read, owner update
- Talents: Active only visible, admin full access
- Applications: Admin only, anyone can submit
- Unlocked: User's own records only

## Files Created
- `lib/supabase.ts` - Client configuration
- `lib/database.types.ts` - TypeScript types
- `lib/auth.tsx` - Auth context & hooks
- `lib/hooks/useTalents.ts` - Talent data hooks
- `lib/hooks/useApplications.ts` - Application hooks
- `supabase/schema.sql` - Database schema
- `supabase/seed.sql` - Sample data

## Usage
The app works with or without Supabase configured.
Without credentials, it falls back to mock data in `lib/mockData.ts`.
