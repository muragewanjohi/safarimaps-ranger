import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback values
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ukwhaovrofmbcynkiemc.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrd2hhb3Zyb2ZtYmN5bmtpZW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDc3MTksImV4cCI6MjA3MTA4MzcxOX0.YccJtxnJQdwL_wtuCKn6Hh_2zvi7QLI4GBy3nqPLMx8';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined');

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
  console.warn('Supabase features will be disabled.');
}

// Only create Supabase client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? (() => {
      console.log('Creating Supabase client with URL:', supabaseUrl);
      try {
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          },
        });
        console.log('Supabase client created successfully');
        return client;
      } catch (error) {
        console.error('Error creating Supabase client:', error);
        return null;
      }
    })()
  : (() => {
      console.log('Cannot create Supabase client - missing credentials');
      return null;
    })();

console.log('Final supabase client status:', supabase ? 'SUCCESS' : 'NULL');

// Export types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: string;
          ranger_id: string;
          team: string;
          park: string;
          avatar: string | null;
          join_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: string;
          ranger_id: string;
          team: string;
          park?: string;
          avatar?: string | null;
          join_date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          ranger_id?: string;
          team?: string;
          park?: string;
          avatar?: string | null;
          join_date?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      parks: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          location: string | null;
          established: string | null;
          area: string | null;
          coordinates: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          location?: string | null;
          established?: string | null;
          area?: string | null;
          coordinates?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          location?: string | null;
          established?: string | null;
          area?: string | null;
          coordinates?: string | null;
          created_at?: string;
        };
      };
      incidents: {
        Row: {
          id: string;
          title: string;
          category: string;
          severity: 'Critical' | 'High' | 'Medium' | 'Resolved';
          status: 'Reported' | 'In Progress' | 'Resolved';
          description: string | null;
          tourists_affected: number;
          operator: string | null;
          transport: string | null;
          medical_condition: string | null;
          infrastructure_details: string | null;
          location: string | null;
          coordinates: string | null;
          reported_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          severity: 'Critical' | 'High' | 'Medium' | 'Resolved';
          status?: 'Reported' | 'In Progress' | 'Resolved';
          description?: string | null;
          tourists_affected?: number;
          operator?: string | null;
          transport?: string | null;
          medical_condition?: string | null;
          infrastructure_details?: string | null;
          location?: string | null;
          coordinates?: string | null;
          reported_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          severity?: 'Critical' | 'High' | 'Medium' | 'Resolved';
          status?: 'Reported' | 'In Progress' | 'Resolved';
          description?: string | null;
          tourists_affected?: number;
          operator?: string | null;
          transport?: string | null;
          medical_condition?: string | null;
          infrastructure_details?: string | null;
          location?: string | null;
          coordinates?: string | null;
          reported_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          title: string;
          category: 'Wildlife' | 'Attraction' | 'Hotel' | 'Dining' | 'Viewpoint';
          subcategory: string | null;
          description: string | null;
          coordinates: string;
          count: number | null;
          operating_hours: string | null;
          contact: string | null;
          best_time_to_visit: string | null;
          rating: string | null;
          features: string[] | null;
          is_endangered: boolean;
          reported_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: 'Wildlife' | 'Attraction' | 'Hotel' | 'Dining' | 'Viewpoint';
          subcategory?: string | null;
          description?: string | null;
          coordinates: string;
          count?: number | null;
          operating_hours?: string | null;
          contact?: string | null;
          best_time_to_visit?: string | null;
          rating?: string | null;
          features?: string[] | null;
          is_endangered?: boolean;
          reported_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: 'Wildlife' | 'Attraction' | 'Hotel' | 'Dining' | 'Viewpoint';
          subcategory?: string | null;
          description?: string | null;
          coordinates?: string;
          count?: number | null;
          operating_hours?: string | null;
          contact?: string | null;
          best_time_to_visit?: string | null;
          rating?: string | null;
          features?: string[] | null;
          is_endangered?: boolean;
          reported_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      location_photos: {
        Row: {
          id: string;
          location_id: string;
          photo_url: string;
          photo_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          photo_url: string;
          photo_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          photo_url?: string;
          photo_name?: string | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          incident_id: string | null;
          title: string;
          category: string;
          severity: 'Critical' | 'High' | 'Medium' | 'Resolved';
          status: 'Reported' | 'In Progress' | 'Resolved';
          description: string | null;
          tourists_affected: number;
          operator: string | null;
          transport: string | null;
          medical_condition: string | null;
          infrastructure_details: string | null;
          location: string | null;
          coordinates: string | null;
          reported_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          incident_id?: string | null;
          title: string;
          category: string;
          severity: 'Critical' | 'High' | 'Medium' | 'Resolved';
          status?: 'Reported' | 'In Progress' | 'Resolved';
          description?: string | null;
          tourists_affected?: number;
          operator?: string | null;
          transport?: string | null;
          medical_condition?: string | null;
          infrastructure_details?: string | null;
          location?: string | null;
          coordinates?: string | null;
          reported_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          incident_id?: string | null;
          title?: string;
          category?: string;
          severity?: 'Critical' | 'High' | 'Medium' | 'Resolved';
          status?: 'Reported' | 'In Progress' | 'Resolved';
          description?: string | null;
          tourists_affected?: number;
          operator?: string | null;
          transport?: string | null;
          medical_condition?: string | null;
          infrastructure_details?: string | null;
          location?: string | null;
          coordinates?: string | null;
          reported_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          icon: string | null;
          icon_color: string | null;
          badge_icon: string | null;
          badge_color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          icon?: string | null;
          icon_color?: string | null;
          badge_icon?: string | null;
          badge_color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          icon?: string | null;
          icon_color?: string | null;
          badge_icon?: string | null;
          badge_color?: string | null;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          earned_at?: string;
        };
      };
    };
  };
};
