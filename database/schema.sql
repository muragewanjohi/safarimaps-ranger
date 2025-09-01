-- SafariMap GameWarden Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE severity_level AS ENUM ('Critical', 'High', 'Medium', 'Resolved');
CREATE TYPE incident_status AS ENUM ('Reported', 'In Progress', 'Resolved');
CREATE TYPE location_category AS ENUM ('Wildlife', 'Attraction', 'Hotel', 'Dining', 'Viewpoint');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Wildlife Ranger',
  ranger_id TEXT UNIQUE NOT NULL,
  team TEXT NOT NULL,
  park TEXT NOT NULL DEFAULT 'Masai Mara National Reserve',
  avatar TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parks table
CREATE TABLE parks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  established DATE,
  area TEXT,
  coordinates TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  severity severity_level NOT NULL,
  status incident_status NOT NULL DEFAULT 'Reported',
  description TEXT,
  tourists_affected INTEGER DEFAULT 0,
  operator TEXT,
  transport TEXT,
  medical_condition TEXT,
  infrastructure_details TEXT,
  location TEXT,
  coordinates TEXT,
  reported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table
CREATE TABLE locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category location_category NOT NULL,
  subcategory TEXT,
  description TEXT,
  coordinates TEXT NOT NULL,
  count INTEGER,
  operating_hours TEXT,
  contact TEXT,
  best_time_to_visit TEXT,
  rating TEXT,
  features TEXT[],
  is_endangered BOOLEAN DEFAULT false,
  reported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location photos table
CREATE TABLE location_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table (extends incidents with more details)
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  incident_id UUID REFERENCES incidents(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  severity severity_level NOT NULL,
  status incident_status NOT NULL DEFAULT 'Reported',
  description TEXT,
  tourists_affected INTEGER DEFAULT 0,
  operator TEXT,
  transport TEXT,
  medical_condition TEXT,
  infrastructure_details TEXT,
  location TEXT,
  coordinates TEXT,
  reported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  icon_color TEXT,
  badge_icon TEXT,
  badge_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements junction table
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX idx_incidents_reported_by ON incidents(reported_by);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);

CREATE INDEX idx_locations_reported_by ON locations(reported_by);
CREATE INDEX idx_locations_category ON locations(category);
CREATE INDEX idx_locations_created_at ON locations(created_at);

CREATE INDEX idx_reports_reported_by ON reports(reported_by);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);

CREATE INDEX idx_location_photos_location_id ON location_photos(location_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for incidents
CREATE POLICY "Users can view all incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Users can create incidents" ON incidents FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Users can update own incidents" ON incidents FOR UPDATE USING (auth.uid() = reported_by);
CREATE POLICY "Users can delete own incidents" ON incidents FOR DELETE USING (auth.uid() = reported_by);

-- RLS Policies for locations
CREATE POLICY "Users can view all locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Users can create locations" ON locations FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Users can update own locations" ON locations FOR UPDATE USING (auth.uid() = reported_by);
CREATE POLICY "Users can delete own locations" ON locations FOR DELETE USING (auth.uid() = reported_by);

-- RLS Policies for reports
CREATE POLICY "Users can view all reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Users can update own reports" ON reports FOR UPDATE USING (auth.uid() = reported_by);
CREATE POLICY "Users can delete own reports" ON reports FOR DELETE USING (auth.uid() = reported_by);

-- RLS Policies for location_photos
CREATE POLICY "Users can view all location photos" ON location_photos FOR SELECT USING (true);
CREATE POLICY "Users can create location photos" ON location_photos FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = location_photos.location_id 
    AND locations.reported_by = auth.uid()
  )
);
CREATE POLICY "Users can delete own location photos" ON location_photos FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM locations 
    WHERE locations.id = location_photos.location_id 
    AND locations.reported_by = auth.uid()
  )
);

-- RLS Policies for achievements
CREATE POLICY "Users can view all achievements" ON achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view all user achievements" ON user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data
INSERT INTO parks (name, description, location, established, area, coordinates) VALUES
('Masai Mara National Reserve', 'World-renowned safari destination in Kenya, famous for the Great Migration', 'Narok County, Kenya', '1961-01-01', '1,510 km²', '1.2921° S, 35.5739° E');

INSERT INTO achievements (title, description, icon, icon_color, badge_icon, badge_color) VALUES
('Wildlife Guardian', '500+ wildlife sightings logged', 'pawprint.fill', '#666', 'star.fill', '#FFD700'),
('Emergency Responder', 'Quick response to 50+ incidents', 'exclamationmark.triangle.fill', '#ff6b6b', 'star.fill', '#FFD700'),
('Team Leader', 'Leading conservation efforts', 'person.2.fill', '#4caf50', 'star.fill', '#FFD700'),
('Tech Pioneer', 'Early adopter of SafariMap', 'bolt.fill', '#9c27b0', 'star.fill', '#FFD700');

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, ranger_id, team, park, avatar, join_date, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Wildlife Ranger'),
    COALESCE(NEW.raw_user_meta_data->>'ranger_id', 'TEMP-001'),
    COALESCE(NEW.raw_user_meta_data->>'team', 'Alpha Team'),
    COALESCE(NEW.raw_user_meta_data->>'park', 'Masai Mara National Reserve'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'NU'),
    CURRENT_DATE,
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
