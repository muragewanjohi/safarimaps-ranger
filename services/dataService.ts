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
const USE_MOCK_DATA = true; // Set to false when ready to use real API

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
    
    // Real API call would go here
    // return this.apiCall<Ranger>('/ranger/profile');
    throw new Error('Real API not implemented yet');
  }

  async getParkData(): Promise<ApiResponse<Park>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockPark);
    }
    
    // Real API call would go here
    // return this.apiCall<Park>('/park/current');
    throw new Error('Real API not implemented yet');
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockDashboardStats);
    }
    
    // Real API call would go here
    // return this.apiCall<DashboardStats>('/dashboard/stats');
    throw new Error('Real API not implemented yet');
  }

  async getEmergencyAlerts(): Promise<ApiResponse<EmergencyAlert[]>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockEmergencyAlerts);
    }
    
    // Real API call would go here
    // return this.apiCall<EmergencyAlert[]>('/alerts/emergency');
    throw new Error('Real API not implemented yet');
  }

  async getRecentIncidents(): Promise<ApiResponse<Incident[]>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockRecentIncidents);
    }
    
    // Real API call would go here
    // return this.apiCall<Incident[]>('/incidents/recent');
    throw new Error('Real API not implemented yet');
  }

  async getRecentLocations(): Promise<ApiResponse<Location[]>> {
    if (USE_MOCK_DATA) {
      await delay(API_DELAY);
      return createMockResponse(mockRecentLocations);
    }
    
    // Real API call would go here
    // return this.apiCall<Location[]>('/locations/recent');
    throw new Error('Real API not implemented yet');
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
