import { AppConfig } from '../config/appConfig';
import { supabase } from '../lib/supabase';
import {
  Achievement,
  ApiResponse,
  DashboardStats,
  EmergencyAlert,
  ImpactStats,
  Incident,
  Location,
  NewLocation,
  PaginatedResponse,
  Park,
  Ranger,
  Report
} from '../types';

// Import mock data
import {
  mockAchievements,
  mockDashboardStats,
  mockEmergencyAlerts,
  mockImpactStats,
  mockPark,
  mockRanger,
  mockRecentIncidents,
  mockRecentLocations,
  mockReports
} from '../data/mockData';

// Configuration for switching between mock and real data
const USE_MOCK_DATA = AppConfig.USE_MOCK_DATA;

// Simulated API delay for realistic testing
const API_DELAY = 500; // milliseconds

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
const createMockResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  message: 'Success'
});

const createMockPaginatedResponse = <T>(data: T[]): PaginatedResponse<T> => ({
  data,
  total: data.length,
  page: 1,
  limit: 10,
  hasMore: false
});

// Data Service Class
export class DataService {
  private static instance: DataService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = USE_MOCK_DATA ? 'mock' : process.env.EXPO_PUBLIC_API_URL || 'https://api.safarimap.com';
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Dashboard Data
  async getRangerData(): Promise<ApiResponse<Ranger>> {
    console.log('getRangerData called with USE_MOCK_DATA:', USE_MOCK_DATA);
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data for ranger data');
      await delay(API_DELAY);
      return createMockResponse(mockRanger);
    }
    
    try {
      console.log('Using Supabase for ranger data');
      // Get current user from Supabase auth
      const { data: { user } } = await supabase!.auth.getUser();
      if (!user) {
        return { success: false, data: null as any, error: 'User not authenticated' };
      }

      // Get user profile from profiles table
      const { data: profile, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        return { success: false, data: null as any, error: 'Profile not found' };
      }

      const rangerData: Ranger = {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        rangerId: profile.ranger_id,
        team: profile.team,
        park: profile.park,
        avatar: profile.avatar,
        joinDate: profile.join_date,
        isActive: profile.is_active
      };

      return createMockResponse(rangerData);
    } catch (error) {
      return { success: false, data: null as any, error: 'Failed to fetch ranger data' };
    }
  }

  async getParkData(): Promise<ApiResponse<Park>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockPark);
    }
    
    try {
      // Get park data from parks table
      const { data: parks, error } = await supabase!
        .from('parks')
        .select('*')
        .limit(1);

      if (error || !parks || parks.length === 0) {
        return { success: false, data: null as any, error: 'Park data not found' };
      }

      const park = parks[0];
      const parkData: Park = {
        id: park.id,
        name: park.name,
        description: park.description,
        location: park.location,
        established: park.established,
        area: park.area,
        coordinates: park.coordinates
      };

      return createMockResponse(parkData);
    } catch (error) {
      return { success: false, data: null as any, error: 'Failed to fetch park data' };
    }
  }

  async getDashboardStats(parkId?: string): Promise<ApiResponse<DashboardStats>> {
    console.log('getDashboardStats called with USE_MOCK_DATA:', USE_MOCK_DATA, 'parkId:', parkId);
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data for dashboard stats');
      await delay(API_DELAY);
      // In a real app, you would filter by parkId
      return createMockResponse(mockDashboardStats);
    }
    
    try {
      console.log('Using Supabase for dashboard stats');
      // Get counts from various tables with proper filtering
      const [incidentsResult, locationsResult, reportsResult, wildlifeResult, hotelsResult, rangersResult] = await Promise.all([
        supabase!.from('incidents').select('id', { count: 'exact' }).eq('status', 'Reported'),
        supabase!.from('locations').select('id', { count: 'exact' }),
        supabase!.from('reports').select('id', { count: 'exact' }),
        supabase!.from('locations').select('id', { count: 'exact' }).eq('category', 'Wildlife'),
        supabase!.from('locations').select('id', { count: 'exact' }).eq('category', 'Hotel'),
        supabase!.from('profiles').select('id', { count: 'exact' }).eq('role', 'Ranger').eq('is_active', true)
      ]);

      const activeIncidents = incidentsResult.count || 0;
      const totalLocations = locationsResult.count || 0;
      const reportsToday = reportsResult.count || 0;
      const wildlifeTracked = wildlifeResult.count || 0;
      const hotelsLodges = hotelsResult.count || 0;
      const rangersActive = rangersResult.count || 1; // Default to 1 if no rangers found

      const stats: DashboardStats = {
        activeIncidents,
        wildlifeTracked,
        touristLocations: totalLocations, // All locations can be tourist locations
        rangersActive,
        hotelsLodges,
        reportsToday
      };

      console.log('Dashboard stats from Supabase:', stats);
      return createMockResponse(stats);
    } catch (error) {
      return { success: false, data: null as any, error: 'Failed to fetch dashboard stats' };
    }
  }

  async getEmergencyAlerts(parkId?: string): Promise<ApiResponse<EmergencyAlert[]>> {
    console.log('getEmergencyAlerts called with USE_MOCK_DATA:', USE_MOCK_DATA, 'parkId:', parkId);
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data for emergency alerts');
      await delay(API_DELAY);
      // In a real app, you would filter by parkId
      return createMockResponse(mockEmergencyAlerts);
    }
    
    try {
      console.log('Using Supabase for emergency alerts');
      // Get emergency alerts from incidents table where severity is Critical or High
      const { data: incidents, error } = await supabase!
        .from('incidents')
        .select('*')
        .in('severity', ['Critical', 'High'])
        .eq('status', 'Reported')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        return { success: false, data: null as any, error: 'Failed to fetch emergency alerts' };
      }

      const alertsData: EmergencyAlert[] = (incidents || []).map(incident => ({
        id: incident.id,
        type: incident.type,
        description: incident.description || '',
        location: incident.location || '',
        timeAgo: this.getTimeAgo(incident.created_at),
        severity: incident.severity,
        urgent: incident.severity === 'Critical'
      }));

      return createMockResponse(alertsData);
    } catch (error) {
      return { success: false, data: null as any, error: 'Failed to fetch emergency alerts' };
    }
  }

  async getRecentIncidents(parkId?: string): Promise<ApiResponse<Incident[]>> {
    console.log('getRecentIncidents called with USE_MOCK_DATA:', USE_MOCK_DATA, 'parkId:', parkId);
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data for recent incidents');
      await delay(API_DELAY);
      // In a real app, you would filter by parkId
      return createMockResponse(mockRecentIncidents);
    }
    
    try {
      console.log('Using Supabase for recent incidents');
      // Get recent incidents from incidents table
      const { data: incidents, error } = await supabase!
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        return { success: false, data: null as any, error: 'Failed to fetch incidents' };
      }

      const incidentsData: Incident[] = (incidents || []).map(incident => ({
        id: incident.id,
        type: incident.type,
        description: incident.description || '',
        location: incident.location || '',
        timeAgo: this.getTimeAgo(incident.created_at),
        severity: incident.severity,
        status: incident.status
      }));

      return createMockResponse(incidentsData);
    } catch (error) {
      return { success: false, data: null as any, error: 'Failed to fetch recent incidents' };
    }
  }

  async getRecentLocations(parkId?: string): Promise<ApiResponse<Location[]>> {
    console.log('getRecentLocations called with USE_MOCK_DATA:', USE_MOCK_DATA, 'parkId:', parkId);
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data for recent locations');
      await delay(API_DELAY);
      // In a real app, you would filter by parkId
      return createMockResponse(mockRecentLocations);
    }
    
    try {
      console.log('Using Supabase for recent locations');
      // Get recent locations from locations table
      const { data: locations, error } = await supabase!
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        return { success: false, data: null as any, error: 'Failed to fetch locations' };
      }

      const locationsData: Location[] = (locations || []).map(location => ({
        id: location.id,
        title: location.title || location.name, // Handle both title and name fields
        category: location.category,
        description: location.description || '',
        coordinates: location.coordinates,
        reportedBy: 'Ranger', // Default since we don't have user names in the query
        timeAgo: this.getTimeAgo(location.created_at),
        icon: this.getIconForCategory(location.category),
        iconColor: this.getColorForCategory(location.category)
      }));

      return createMockResponse(locationsData);
    } catch (error) {
      return { success: false, data: null as any, error: 'Failed to fetch recent locations' };
    }
  }

  // Reports Data
  async getReports(): Promise<ApiResponse<Report[]>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockReports);
    }
    
    // Real API call would go here
    // return this.apiCall<Report[]>('/reports');
    throw new Error('Real API not implemented yet');
  }

  async getReportById(id: number): Promise<ApiResponse<Report>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      const report = mockReports.find(r => r.id === id);
      if (!report) {
        return { success: false, data: null as any, error: 'Report not found' };
      }
      return createMockResponse(report);
    }
    
    // Real API call would go here
    // return this.apiCall<Report>(`/reports/${id}`);
    throw new Error('Real API not implemented yet');
  }

  // Profile Data
  async getImpactStats(): Promise<ApiResponse<ImpactStats>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockImpactStats);
    }
    
    // Real API call would go here
    // return this.apiCall<ImpactStats>('/profile/impact');
    throw new Error('Real API not implemented yet');
  }

  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockAchievements);
    }
    
    // Real API call would go here
    // return this.apiCall<Achievement[]>('/profile/achievements');
    throw new Error('Real API not implemented yet');
  }

  // Location Management
  async addLocation(location: NewLocation, parkId?: string): Promise<ApiResponse<Location>> {
    console.log('DataService.addLocation called with USE_MOCK_DATA:', USE_MOCK_DATA);
    console.log('Location data received:', location);
    
    if (USE_MOCK_DATA) {
      console.log('Using mock data for addLocation');
      await delay(API_DELAY);
      // Create a mock location from the new location data
      const newLocation: Location = {
        id: Date.now(), // Simple ID generation
        title: location.attractionName || location.hotelName || location.subcategory,
        category: location.category === 'Attractions' ? 'Attraction' : 
                 location.category === 'Hotels' ? 'Hotel' : 
                 location.category === 'Dining' ? 'Dining' : 
                 location.category === 'Viewpoints' ? 'Viewpoint' : 'Wildlife',
        description: location.description,
        coordinates: location.coordinates,
        reportedBy: 'Current User', // Would come from auth context
        icon: this.getIconForCategory(location.category),
        iconColor: this.getColorForCategory(location.category),
        timeAgo: 'Just now',
        ...(location.operatingHours && { operatingHours: location.operatingHours }),
        ...(location.contact && { contact: location.contact }),
        ...(location.count && { count: location.count }),
        ...(location.photos.length > 0 && { photos: location.photos })
      };
      
      console.log('Created mock location:', newLocation);
      const response = createMockResponse(newLocation);
      console.log('Mock response:', response);
      return response;
    }
    
    try {
      console.log('Using Supabase for addLocation');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase!.auth.getUser();
      if (userError || !user) {
        console.error('Error getting user:', userError);
        return { success: false, data: null as any, error: 'User not authenticated' };
      }

      console.log('Current user ID:', user.id);
      console.log('Current user email:', user.email);

      // Check user's profile and role
      const { data: profile, error: profileError } = await supabase!
        .from('profiles')
        .select('id, name, role, ranger_id, team')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error getting user profile:', profileError);
        return { success: false, data: null as any, error: 'User profile not found' };
      }

      console.log('User profile:', profile);
      console.log('User role:', profile.role);

      // Check if user has permission to insert locations
      if (!['Ranger', 'Admin', 'Park_Manager'].includes(profile.role)) {
        console.error('User does not have permission to insert locations. Role:', profile.role);
        return { success: false, data: null as any, error: `User role '${profile.role}' does not have permission to add locations` };
      }

      // Use provided park ID or get the first park as default
      let targetParkId = parkId;
      
      if (!targetParkId) {
        const { data: parks, error: parksError } = await supabase!
          .from('parks')
          .select('id')
          .limit(1);
        
        if (parksError || !parks || parks.length === 0) {
          console.error('Error getting parks:', parksError);
          return { success: false, data: null as any, error: 'No parks available' };
        }

        targetParkId = parks[0].id;
      }
      
      console.log('Using park ID:', targetParkId);

      // Map category to database enum
      const categoryMap: { [key: string]: string } = {
        'Wildlife': 'Wildlife',
        'Attractions': 'Attraction',
        'Hotels': 'Hotel',
        'Dining': 'Dining',
        'Viewpoints': 'Viewpoint'
      };

      const dbCategory = categoryMap[location.category] || 'Wildlife';

      // Try to insert with just the essential fields first
      console.log('Attempting to insert location with minimal fields...');
      console.log('User ID for reported_by:', user.id);
      console.log('User ID type:', typeof user.id);
      
      const insertData: any = {
        park_id: targetParkId,
        name: location.attractionName || location.hotelName || location.subcategory || 'Wildlife Sighting',
        title: location.attractionName || location.hotelName || location.subcategory || 'Wildlife Sighting',
        category: dbCategory,
        subcategory: location.subcategory,
        description: location.description,
        coordinates: location.coordinates,
        // Optional fields based on category
        ...(location.count ? { count: Number(location.count) } : {}),
        ...(location.operatingHours ? { operating_hours: location.operatingHours } : {}),
        ...(location.contact ? { contact: location.contact } : {}),
        ...(location.bestTimeToVisit ? { best_time_to_visit: location.bestTimeToVisit } : {}),
        reported_by: user.id
      };

      console.log('Insert data:', insertData);
      console.log('Insert data reported_by:', insertData.reported_by);
      console.log('Insert data reported_by type:', typeof insertData.reported_by);

      // Double-check auth status right before insert
      const { data: { user: currentUser }, error: authError } = await supabase!.auth.getUser();
      console.log('Current user before insert:', currentUser?.id);
      console.log('Auth error before insert:', authError);

      // Test RLS policy with a simple query first
      console.log('Testing RLS policy with auth.uid()...');
      const { data: testData, error: testError } = await supabase!
        .from('locations')
        .select('id')
        .limit(1);
      console.log('Test query result:', testData, 'Test error:', testError);

      const { data: newLocation, error: insertError } = await supabase!
        .from('locations')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting location:', insertError);
        return { success: false, data: null as any, error: insertError.message };
      }

      console.log('Location inserted successfully:', newLocation);

      // If there are photos, ensure we store valid public URLs
      const uploadedPhotoUrls: string[] = [];
      if (location.photos && location.photos.length > 0) {
        const bucket = 'location-photos';
        for (let i = 0; i < location.photos.length; i += 1) {
          const sourceUri = location.photos[i];
          try {
            if (sourceUri.startsWith('http://') || sourceUri.startsWith('https://')) {
              uploadedPhotoUrls.push(sourceUri);
              continue;
            }

            if (sourceUri.startsWith('file://') || sourceUri.startsWith('content://')) {
              const response = await fetch(sourceUri);
              const contentTypeHeader = response.headers.get('Content-Type') || 'image/jpeg';
              const arrayBuffer = await response.arrayBuffer();
              const bytes = new Uint8Array(arrayBuffer);

              // Try to infer a sensible extension from the uri or content type
              const uriExtMatch = sourceUri.match(/\.([a-zA-Z0-9]+)$/);
              const extFromUri = uriExtMatch ? uriExtMatch[1] : undefined;
              const extFromType = contentTypeHeader.split('/')?.[1] || 'jpg';
              const finalExt = (extFromUri || extFromType || 'jpg').toLowerCase();
              const objectPath = `${newLocation.id}/${Date.now()}_${i}.${finalExt}`;

              const { error: uploadError } = await supabase!
                .storage
                .from(bucket)
                .upload(objectPath, bytes, { contentType: contentTypeHeader, upsert: true });

              if (uploadError) {
                console.error('Photo upload failed:', uploadError);
                continue;
              }

              const { data: publicUrlData } = supabase!
                .storage
                .from(bucket)
                .getPublicUrl(objectPath);

              if (publicUrlData?.publicUrl) {
                uploadedPhotoUrls.push(publicUrlData.publicUrl);
              }
            }
          } catch (e) {
            console.error('Error processing photo for upload:', e);
          }
        }

        if (uploadedPhotoUrls.length > 0) {
          const photoInserts = uploadedPhotoUrls.map(photoUrl => ({
            location_id: newLocation.id,
            photo_url: photoUrl,
            taken_by: user.id
          }));

          const { error: photosError } = await supabase!
            .from('location_photos')
            .insert(photoInserts);

          if (photosError) {
            console.error('Error inserting photos:', photosError);
            // Don't fail the whole operation for photo errors
          } else {
            console.log('Photos inserted successfully');
          }
        } else {
          console.log('No valid photo URLs to insert (skipping photo records).');
        }
      }

      // Convert database location to app Location format
      const appLocation: Location = {
        id: newLocation.id,
        title: location.attractionName || location.hotelName || location.subcategory || 'Wildlife Sighting',
        category: newLocation.category,
        description: newLocation.description,
        coordinates: newLocation.coordinates,
        reportedBy: user.email || 'Unknown User',
        icon: this.getIconForCategory(location.category),
        iconColor: this.getColorForCategory(location.category),
        timeAgo: 'Just now',
        ...(location.operatingHours && { operatingHours: location.operatingHours }),
        ...(location.contact && { contact: location.contact }),
        ...(location.count && { count: Number(location.count) }),
        ...(uploadedPhotoUrls.length > 0
          ? { photos: uploadedPhotoUrls }
          : (location.photos.length > 0 ? { photos: location.photos } : {}))
      };

      console.log('Converted to app location:', appLocation);
      return { success: true, data: appLocation, message: 'Location added successfully' };

    } catch (error) {
      console.error('Unexpected error in addLocation:', error);
      return { success: false, data: null as any, error: 'An unexpected error occurred' };
    }
  }

  // Helper methods
  private getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  private getIconForCategory(category: string): string {
    const iconMap: Record<string, string> = {
      'Wildlife': 'pawprint.fill',
      'Attractions': 'eye.fill',
      'Hotels': 'building.2.fill',
      'Dining': 'fork.knife',
      'Viewpoints': 'eye.fill'
    };
    return iconMap[category] || 'location.fill';
  }

  private getColorForCategory(category: string): string {
    const colorMap: Record<string, string> = {
      'Wildlife': '#4CAF50',
      'Attractions': '#FF9800',
      'Hotels': '#9C27B0',
      'Dining': '#FF5722',
      'Viewpoints': '#2196F3'
    };
    return colorMap[category] || '#666';
  }

  // Real API call method (for future use)
  private async apiCall<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
          // 'Authorization': `Bearer ${authToken}`
        }
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          data: null as any,
          error: result.message || 'API call failed'
        };
      }

      return {
        success: true,
        data: result.data || result,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }
}

// Export singleton instance
export const dataService = DataService.getInstance();
