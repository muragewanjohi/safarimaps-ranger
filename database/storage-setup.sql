-- Supabase Storage Configuration for SafariMap GameWarden
-- Run this SQL in your Supabase SQL Editor after creating the main schema

-- Create storage bucket for location photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'location-photos',
  'location-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create storage bucket for incident photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'incident-photos',
  'incident-photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
);

-- Storage policies for location-photos bucket
CREATE POLICY "Users can view all location photos" ON storage.objects
FOR SELECT USING (bucket_id = 'location-photos');

CREATE POLICY "Users can upload location photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'location-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'locations'
);

CREATE POLICY "Users can update own location photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'location-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'locations'
);

CREATE POLICY "Users can delete own location photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'location-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'locations'
);

-- Storage policies for incident-photos bucket
CREATE POLICY "Users can view all incident photos" ON storage.objects
FOR SELECT USING (bucket_id = 'incident-photos');

CREATE POLICY "Users can upload incident photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'incident-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'incidents'
);

CREATE POLICY "Users can update own incident photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'incident-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'incidents'
);

CREATE POLICY "Users can delete own incident photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'incident-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'incidents'
);
