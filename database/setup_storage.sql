-- Setup Supabase Storage for incident photos
-- Run this SQL in your Supabase SQL Editor

-- Create storage bucket for incident photos (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-photos', 'incident-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for incident photos (drop existing ones first)
DROP POLICY IF EXISTS "Users can upload incident photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view incident photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their incident photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their incident photos" ON storage.objects;

-- Create storage policies for incident photos
CREATE POLICY "Users can upload incident photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'incident-photos' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can view incident photos" ON storage.objects
FOR SELECT USING (bucket_id = 'incident-photos');

CREATE POLICY "Users can update their incident photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'incident-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their incident photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'incident-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
