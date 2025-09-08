-- Update incidents table to include additional fields for the add-report form
-- Run this SQL in your Supabase SQL Editor

-- Add missing columns to incidents table
ALTER TABLE incidents 
ADD COLUMN IF NOT EXISTS tour_operator TEXT,
ADD COLUMN IF NOT EXISTS contact_info TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS photos TEXT[],
ADD COLUMN IF NOT EXISTS reported_by_name TEXT;

-- Update the severity_level enum to include 'Low' if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Low' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'severity_level')) THEN
        ALTER TYPE severity_level ADD VALUE 'Low';
    END IF;
END $$;

-- Update the incident_status enum to include 'Open' and 'Escalated' if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Open' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'incident_status')) THEN
        ALTER TYPE incident_status ADD VALUE 'Open';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Escalated' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'incident_status')) THEN
        ALTER TYPE incident_status ADD VALUE 'Escalated';
    END IF;
END $$;

-- Add RLS policies for incidents table
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert incidents
CREATE POLICY "Users can insert incidents" ON incidents
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy to allow users to view all incidents
CREATE POLICY "Users can view incidents" ON incidents
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policy to allow users to update incidents they reported
CREATE POLICY "Users can update their incidents" ON incidents
    FOR UPDATE USING (auth.uid() = reported_by);

-- Policy to allow users to delete incidents they reported
CREATE POLICY "Users can delete their incidents" ON incidents
    FOR DELETE USING (auth.uid() = reported_by);
