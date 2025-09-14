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
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockRanger);
    }
    
    try {
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
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      // In a real app, you would filter by parkId
      return createMockResponse(mockDashboardStats);
    }
    
    try {
      // Get counts from various tables
      const [incidentsResult, locationsResult, reportsResult] = await Promise.all([
        supabase!.from('incidents').select('id', { count: 'exact' }),
        supabase!.from('locations').select('id', { count: 'exact' }),
        supabase!.from('reports').select('id', { count: 'exact' })
      ]);

      const activeIncidents = incidentsResult.count || 0;
      const wildlifeTracked = locationsResult.count || 0;
      const reportsToday = reportsResult.count || 0;

      const stats: DashboardStats = {
        activeIncidents,
        wildlifeTracked,
        touristLocations: wildlifeTracked, // Using locations as tourist locations for now
        rangersActive: 1, // Default to 1 for current user
        hotelsLodges: 0, // Would need to count from locations where category = 'Hotel'
        reportsToday
      };

      return createMockResponse(stats);
    } catch (error) {
      return { success: false, data: null as any, error: 'Failed to fetch dashboard stats' };
    }
  }

  async getEmergencyAlerts(parkId?: string): Promise<ApiResponse<EmergencyAlert[]>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      // In a real app, you would filter by parkId
      return createMockResponse(mockEmergencyAlerts);
    }
    
    // Real API call would go here
    // return this.apiCall<EmergencyAlert[]>('/alerts/emergency');
    throw new Error('Real API not implemented yet');
  }

  async getRecentIncidents(parkId?: string): Promise<ApiResponse<Incident[]>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      // In a real app, you would filter by parkId
      return createMockResponse(mockRecentIncidents);
    }
    
    try {
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
        type: incident.category,
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
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      // In a real app, you would filter by parkId
      return createMockResponse(mockRecentLocations);
    }
    
    try {
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
        type: location.category,
        location: location.coordinates,
        timeAgo: this.getTimeAgo(location.created_at),
        reportedBy: location.reported_by,
        count: location.count
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
  async addLocation(location: NewLocation): Promise<ApiResponse<Location>> {
    if (USE_MOCK_DATA) {
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
      
      return createMockResponse(newLocation);
    }
    
    // Real API call would go here
    // return this.apiCall<Location>('/locations', 'POST', location);
    throw new Error('Real API not implemented yet');
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
