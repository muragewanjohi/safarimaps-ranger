// Core data types for SafariMap GameWarden App

export interface Ranger {
  id: string;
  name: string;
  role: string;
  rangerId: string;
  team: string;
  joinDate: string;
  currentLocation: string;
  avatar: string;
}

export interface Park {
  id: string;
  name: string;
  description: string;
  location: string;
  established: string;
  area: string;
  coordinates: string;
}

export interface DashboardStats {
  activeIncidents: number;
  wildlifeTracked: number;
  touristLocations: number;
  rangersActive: number;
  hotelsLodges: number;
  reportsToday: number;
}

export interface EmergencyAlert {
  id: number;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Resolved';
  description: string;
  location: string;
  timeAgo: string;
  status: 'Active' | 'In Progress' | 'Resolved';
  urgent?: boolean;
}

export interface Incident {
  id: number;
  type: string;
  description: string;
  location: string;
  timeAgo: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Resolved';
  status: 'Active' | 'In Progress' | 'Resolved';
}

export interface Location {
  id: number;
  title: string;
  category: 'Wildlife' | 'Attraction' | 'Hotel' | 'Dining' | 'Viewpoint';
  description: string;
  coordinates: string;
  reportedBy: string;
  icon: string;
  iconColor: string;
  isEndangered?: boolean;
  timeAgo?: string;
  rating?: string;
  operatingHours?: string;
  features?: string[];
  contact?: string;
  // Additional fields for compatibility
  type?: string;
  count?: string;
  location?: string;
}

export interface Report {
  id: number;
  title: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Resolved';
  status: 'Reported' | 'In Progress' | 'Resolved';
  description: string;
  touristsAffected: number;
  operator: string;
  transport: string;
  medicalCondition: string;
  infrastructureDetails: string;
  location: string;
  dateTime: string;
  photos: string[];
  reportedBy: string;
}

export interface ImpactStats {
  incidentsReported: number;
  wildlifeTracked: number;
  patrolsCompleted: number;
  daysActive: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  badgeIcon: string;
  badgeColor: string;
}

export interface QuickAction {
  id: number;
  title: string;
  icon: string;
  iconColor: string;
  isDestructive?: boolean;
  action: () => void;
}

// New location creation types
export interface NewLocation {
  category: 'Wildlife' | 'Attractions' | 'Hotels' | 'Dining' | 'Viewpoints';
  subcategory: string;
  count?: string;
  description: string;
  attractionName?: string;
  operatingHours?: string;
  hotelName?: string;
  contact?: string;
  bestTimeToVisit?: string;
  photos: string[];
  coordinates: string;
}

// Filter and dropdown options
export interface FilterOption {
  value: string;
  label: string;
}

export interface CategoryOption {
  id: string;
  label: string;
  icon: string;
}

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  rangerId: string;
  team: string;
  park: string;
  avatar: string;
  joinDate: string;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  rangerId: string;
  team: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

// API Response types (for future database integration)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
