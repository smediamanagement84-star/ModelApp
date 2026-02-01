-- HIRE THE GLAM Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('agency', 'model', 'admin');
CREATE TYPE professional_role AS ENUM ('Model', 'Photographer', 'Make-up Artist');
CREATE TYPE price_type AS ENUM ('Fixed', 'Negotiable', 'Day Rate');
CREATE TYPE union_status AS ENUM ('SAG-AFTRA', 'Equity', 'Non-Union');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'agency',
  avatar_url TEXT,
  agency_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Talents table (models, photographers, makeup artists)
CREATE TABLE talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  professional_role professional_role NOT NULL,
  category TEXT,
  height INTEGER,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  ethnicity TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  bio TEXT,
  image_url TEXT NOT NULL,
  price INTEGER NOT NULL,
  price_type price_type DEFAULT 'Fixed',
  unlock_price INTEGER NOT NULL,
  union_status union_status,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Talent stats (measurements, specialties)
CREATE TABLE talent_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  bust INTEGER,
  waist INTEGER,
  hips INTEGER,
  eye_color TEXT,
  hair_color TEXT,
  hair_texture TEXT,
  shoe_size INTEGER,
  dress_size TEXT,
  specialties TEXT[],
  equipment TEXT[],
  styles TEXT[],
  UNIQUE(talent_id)
);

-- Talent social links
CREATE TABLE talent_socials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  followers INTEGER DEFAULT 0
);

-- Applications for new talents
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  dob DATE NOT NULL,
  gender TEXT NOT NULL,
  nationality TEXT,
  city TEXT NOT NULL,
  professional_role professional_role NOT NULL,
  height INTEGER,
  ethnicity TEXT,
  specialties TEXT[],
  bio TEXT,
  headshot_url TEXT,
  portfolio_urls TEXT[],
  status application_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unlocked talents (paid access)
CREATE TABLE unlocked_talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
  payment_id TEXT,
  amount_paid INTEGER NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, talent_id)
);

-- Indexes for performance
CREATE INDEX idx_talents_role ON talents(professional_role);
CREATE INDEX idx_talents_category ON talents(category);
CREATE INDEX idx_talents_location ON talents(location);
CREATE INDEX idx_talents_active ON talents(is_active);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_unlocked_user ON unlocked_talents(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocked_talents ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Talents: Everyone can view active talents
CREATE POLICY "Active talents are viewable by everyone"
  ON talents FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all talents"
  ON talents FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Talent Stats: Viewable with talent
CREATE POLICY "Talent stats are viewable by everyone"
  ON talent_stats FOR SELECT USING (true);

-- Talent Socials: Viewable with talent
CREATE POLICY "Talent socials are viewable by everyone"
  ON talent_socials FOR SELECT USING (true);

-- Applications: Only admins can view/manage
CREATE POLICY "Only admins can view applications"
  ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can submit applications"
  ON applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can update applications"
  ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Unlocked Talents: Users can view their own
CREATE POLICY "Users can view own unlocked talents"
  ON unlocked_talents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock talents"
  ON unlocked_talents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'agency')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_talents_updated_at
  BEFORE UPDATE ON talents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
