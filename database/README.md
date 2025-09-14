# SafariMap GameWarden Database

This directory contains the complete database schema for the SafariMap GameWarden application.

## Files

- `schema.sql` - Complete and updated database schema
- `README.md` - This file

## Setup Instructions

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Run the SQL script

## Schema Overview

The database includes the following main tables:

- **parks** - Park information including photos, size, and contact details
- **park_entries** - Entry and exit points for each park
- **profiles** - User profiles extending Supabase auth
- **ranger_parks** - Many-to-many relationship between rangers and parks
- **incidents** - Security and wildlife incident reports
- **locations** - Wildlife sightings and points of interest
- **location_photos** - Photos associated with locations
- **reports** - Ranger reports and documentation
- **achievements** - Gamification system
- **user_achievements** - User achievement tracking

## Key Features

- Row Level Security (RLS) policies for data protection
- Automatic user profile creation via triggers
- Photo storage integration with Supabase Storage
- Comprehensive indexing for performance
- Support for park photos and entry/exit management
- Location-based data with coordinate validation

## Storage

The schema includes setup for a `park-photos` storage bucket for managing park images.