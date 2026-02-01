-- Seed data for HIRE THE GLAM
-- Run this after schema.sql to populate sample data

-- Insert sample talents
INSERT INTO talents (name, professional_role, category, height, age, gender, ethnicity, location, image_url, price, price_type, unlock_price, union_status, tags, is_active, is_verified)
VALUES
  ('Elena V.', 'Model', 'Women', 178, 24, 'Female', ARRAY['White', 'Latinx'], 'New York', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop', 35000, 'Negotiable', 4900, 'Non-Union', ARRAY['High Fashion', 'Editorial'], true, true),
  ('Marcus T.', 'Model', 'Men', 188, 28, 'Male', ARRAY['Black'], 'Los Angeles', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop', 40000, 'Fixed', 3900, 'SAG-AFTRA', ARRAY['Athletic', 'Streetwear'], true, true),
  ('Viktor Reznov', 'Photographer', NULL, NULL, 32, 'Male', ARRAY['White'], 'Paris', 'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1887&auto=format&fit=crop', 85000, 'Day Rate', 2500, NULL, ARRAY['Cinema', 'High Contrast'], true, true),
  ('Anya Taylor', 'Make-up Artist', NULL, NULL, 27, 'Female', ARRAY['White'], 'London', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop', 25000, 'Fixed', 1500, NULL, ARRAY['Minimalist', 'Glow'], true, true);

-- Get talent IDs for stats/socials
DO $$
DECLARE
  elena_id UUID;
  marcus_id UUID;
  viktor_id UUID;
  anya_id UUID;
BEGIN
  SELECT id INTO elena_id FROM talents WHERE name = 'Elena V.';
  SELECT id INTO marcus_id FROM talents WHERE name = 'Marcus T.';
  SELECT id INTO viktor_id FROM talents WHERE name = 'Viktor Reznov';
  SELECT id INTO anya_id FROM talents WHERE name = 'Anya Taylor';

  -- Insert talent stats
  INSERT INTO talent_stats (talent_id, bust, waist, hips, eye_color, hair_color, shoe_size, dress_size, hair_texture)
  VALUES
    (elena_id, 85, 60, 90, 'Blue', 'Dark Brown', 39, 'S', 'Straight'),
    (marcus_id, 100, 82, 98, 'Brown', 'Black', 44, 'L', 'Coily');

  INSERT INTO talent_stats (talent_id, styles, equipment)
  VALUES
    (viktor_id, ARRAY['Editorial', 'Commercial', 'Film'], ARRAY['Sony A7R V', 'Leica M11']);

  INSERT INTO talent_stats (talent_id, specialties)
  VALUES
    (anya_id, ARRAY['High Fashion', 'SFX', 'Bridal']);

  -- Insert talent socials
  INSERT INTO talent_socials (talent_id, platform, handle, followers)
  VALUES
    (elena_id, 'Instagram', '@elena_v', 15000),
    (marcus_id, 'Instagram', '@marcus_fit', 45000),
    (viktor_id, 'Instagram', '@viktor_v', 42000),
    (anya_id, 'Instagram', '@anya_mua', 12000);
END $$;

-- Insert sample applications
INSERT INTO applications (first_name, last_name, email, phone, dob, gender, nationality, city, professional_role, height, ethnicity, headshot_url, status)
VALUES
  ('Sienna', 'Brooks', 'sienna.b@example.com', '+1 (555) 123-4567', '1999-05-15', 'Female', 'Canadian', 'Toronto', 'Model', 177, 'White', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop', 'pending'),
  ('Kai', 'Tanaka', 'kai.t@example.com', '+81 90-1234-5678', '2001-11-20', 'Male', 'Japanese', 'Tokyo', 'Model', 185, 'East Asian', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop', 'pending'),
  ('Zara', 'Mendez', 'zara.m@example.com', '+34 600 000 000', '2000-02-14', 'Female', 'Spanish', 'Barcelona', 'Model', 172, 'Latinx', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop', 'pending');
