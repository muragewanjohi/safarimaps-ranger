import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

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
