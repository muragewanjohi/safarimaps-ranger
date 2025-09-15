import { supabase } from '@/lib/supabase';

export interface Park {
  id: string;
  name: string;
  description?: string;
  location?: string;
  established?: string;
  area?: string;
  size?: string; // Park size in km²
  coordinates?: string;
  operating_hours?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  admission_fees?: {
    adults?: string;
    children?: string;
    students?: string;
  };
  rules_and_regulations?: string[];
  emergency_contacts?: {
    ranger_station?: string;
    emergency?: string;
    medical?: string;
  };
  photos?: string[]; // Array of photo URLs
  created_at?: string;
  updated_at?: string;
}

export interface ParkEntry {
  id: string;
  park_id: string;
  name: string;
  entry_type: 'Entry' | 'Exit';
  status: 'Primary' | 'Secondary' | 'Emergency';
  coordinates: string;
  description?: string;
  facilities?: string[];
  is_accessible: boolean;
  created_at?: string;
  updated_at?: string;
}

export class ParkService {
  /**
   * Get all parks
   */
  static async getParks(): Promise<Park[]> {
    try {
      console.log('Fetching parks from database...');
      console.log('Supabase client status:', supabase ? 'Available' : 'NULL');
      
      // Check if Supabase client is available
      if (!supabase) {
        console.warn('Supabase client is not available, returning empty array');
        return [];
      }
      
      const { data, error } = await supabase
        .from('parks')
        .select('*')
        .order('name');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Parks fetched successfully:', data?.length || 0, 'parks');
      console.log('Raw parks data:', JSON.stringify(data, null, 2));
      return data || [];
    } catch (error) {
      console.error('Error fetching parks:', error);
      throw error;
    }
  }

  /**
   * Get park by ID
   */
  static async getParkById(id: string): Promise<Park | null> {
    try {
      console.log('Fetching park by ID:', id);
      const { data, error } = await supabase
        .from('parks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error fetching park:', error);
        throw error;
      }
      
      console.log('Park fetched successfully:', data?.name);
      return data;
    } catch (error) {
      console.error('Error fetching park:', error);
      throw error;
    }
  }

  /**
   * Update park details
   */
  static async updatePark(id: string, updates: Partial<Park>): Promise<Park> {
    try {
      const { data, error } = await supabase
        .from('parks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating park:', error);
      throw error;
    }
  }

  /**
   * Get park entries for a specific park
   */
  static async getParkEntries(parkId: string): Promise<ParkEntry[]> {
    try {
      const { data, error } = await supabase
        .from('park_entries')
        .select('*')
        .eq('park_id', parkId)
        .order('status', { ascending: false })
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching park entries:', error);
      throw error;
    }
  }

  /**
   * Create a new park entry
   */
  static async createParkEntry(entry: Omit<ParkEntry, 'id' | 'created_at' | 'updated_at'>): Promise<ParkEntry> {
    try {
      const { data, error } = await supabase
        .from('park_entries')
        .insert(entry)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating park entry:', error);
      throw error;
    }
  }

  /**
   * Update a park entry
   */
  static async updateParkEntry(id: string, updates: Partial<ParkEntry>): Promise<ParkEntry> {
    try {
      const { data, error } = await supabase
        .from('park_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating park entry:', error);
      throw error;
    }
  }

  /**
   * Delete a park entry
   */
  static async deleteParkEntry(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('park_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting park entry:', error);
      throw error;
    }
  }

  /**
   * Get park statistics
   */
  static async getParkStats(parkId: string): Promise<{
    totalEntries: number;
    primaryEntries: number;
    primaryExits: number;
    totalCapacity: number;
    accessibleEntries: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('park_entries')
        .select('status, entry_type, capacity, is_accessible')
        .eq('park_id', parkId);

      if (error) throw error;

      const stats = {
        totalEntries: data.length,
        primaryEntries: data.filter(entry => entry.status === 'Primary' && (entry.entry_type === 'Entry' || entry.entry_type === 'Both')).length,
        primaryExits: data.filter(entry => entry.status === 'Primary' && (entry.entry_type === 'Exit' || entry.entry_type === 'Both')).length,
        totalCapacity: data.reduce((sum, entry) => sum + (entry.capacity || 0), 0),
        accessibleEntries: data.filter(entry => entry.is_accessible).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching park stats:', error);
      throw error;
    }
  }

  /**
   * Validate park entry data
   */
  static validateParkEntry(entry: Partial<ParkEntry>): string[] {
    const errors: string[] = [];

    if (!entry.name?.trim()) {
      errors.push('Entry name is required');
    }

    if (!entry.coordinates?.trim()) {
      errors.push('Coordinates are required');
    } else if (!entry.coordinates.match(/^-?\d+\.?\d*°\s*[NS],\s*-?\d+\.?\d*°\s*[EW]$/)) {
      errors.push('Invalid coordinates format. Use format: "1.4000° S, 35.6000° E"');
    }

    if (entry.capacity && entry.capacity < 0) {
      errors.push('Capacity must be a positive number');
    }

    return errors;
  }

  /**
   * Add photo to park
   */
  static async addParkPhoto(parkId: string, photoUri: string): Promise<string> {
    try {
      // Upload photo to Supabase Storage
      const fileName = `park-${parkId}-${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('park-photos')
        .upload(fileName, {
          uri: photoUri,
          type: 'image/jpeg',
          name: fileName,
        } as any);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('park-photos')
        .getPublicUrl(fileName);

      // Add photo URL to park photos array
      const { data: park } = await supabase
        .from('parks')
        .select('photos')
        .eq('id', parkId)
        .single();

      const currentPhotos = park?.photos || [];
      const updatedPhotos = [...currentPhotos, publicUrl];

      await supabase
        .from('parks')
        .update({ photos: updatedPhotos })
        .eq('id', parkId);

      return publicUrl;
    } catch (error) {
      console.error('Error adding park photo:', error);
      throw error;
    }
  }

  /**
   * Remove photo from park
   */
  static async removeParkPhoto(parkId: string, photoUrl: string): Promise<void> {
    try {
      // Get current photos
      const { data: park } = await supabase
        .from('parks')
        .select('photos')
        .eq('id', parkId)
        .single();

      if (!park) throw new Error('Park not found');

      // Remove photo from array
      const updatedPhotos = park.photos?.filter(url => url !== photoUrl) || [];

      // Update park
      await supabase
        .from('parks')
        .update({ photos: updatedPhotos })
        .eq('id', parkId);

      // Delete from storage
      const fileName = photoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('park-photos')
          .remove([fileName]);
      }
    } catch (error) {
      console.error('Error removing park photo:', error);
      throw error;
    }
  }

  /**
   * Get current location coordinates
   */
  static async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }

  /**
   * Format coordinates for display
   */
  static formatCoordinates(latitude: number, longitude: number): string {
    const latDir = latitude >= 0 ? 'N' : 'S';
    const lonDir = longitude >= 0 ? 'E' : 'W';
    const lat = Math.abs(latitude).toFixed(4);
    const lon = Math.abs(longitude).toFixed(4);
    return `${lat}° ${latDir}, ${lon}° ${lonDir}`;
  }

  /**
   * Validate park data
   */
  static validatePark(park: Partial<Park>): string[] {
    const errors: string[] = [];

    if (!park.name?.trim()) {
      errors.push('Park name is required');
    }

    if (park.coordinates && !park.coordinates.match(/^-?\d+\.?\d*°\s*[NS],\s*-?\d+\.?\d*°\s*[EW]$/)) {
      errors.push('Invalid coordinates format. Use format: "1.4000° S, 35.6000° E"');
    }

    if (park.area && !park.area.match(/^\d+.*km²$/)) {
      errors.push('Invalid area format. Use format: "1,510 km²"');
    }

    return errors;
  }
}

export const parkService = ParkService;
