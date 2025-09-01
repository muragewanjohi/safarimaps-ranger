import {
    Achievement,
    CategoryOption,
    DashboardStats,
    EmergencyAlert,
    FilterOption,
    ImpactStats,
    Incident,
    Location,
    Park,
    Ranger,
    Report
} from '../types';

// Mock Ranger Data
export const mockRanger: Ranger = {
  id: 'ranger_001',
  name: 'Sarah Johnson',
  role: 'Senior Wildlife Ranger',
  rangerId: 'RGR-001',
  team: 'Alpha Team',
  joinDate: '2019-03-15',
  currentLocation: 'Sector A-12',
  avatar: 'SJ'
};

// Mock Park Data
export const mockPark: Park = {
  id: 'park_001',
  name: 'Masai Mara National Reserve',
  description: 'World-renowned safari destination in Kenya, famous for the Great Migration',
  location: 'Narok County, Kenya',
  established: '1961',
  area: '1,510 km²',
  coordinates: '-1.5053°, 35.1442°'
};

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  activeIncidents: 7,
  wildlifeTracked: 234,
  touristLocations: 42,
  rangersActive: 12,
  hotelsLodges: 8,
  reportsToday: 18
};

// Mock Emergency Alerts
export const mockEmergencyAlerts: EmergencyAlert[] = [
  {
    id: 1,
    type: 'Tour Van Stuck',
    severity: 'High',
    description: '8 Tourists',
    location: 'Swamp Trail Junction',
    timeAgo: '15 min ago',
    status: 'Active'
  },
  {
    id: 2,
    type: 'Missing Family',
    severity: 'Critical',
    description: 'Lost on Trail',
    location: 'Elephant Valley Trail',
    timeAgo: '25 min ago',
    status: 'Active',
    urgent: true
  }
];

// Mock Recent Incidents
export const mockRecentIncidents: Incident[] = [
  {
    id: 1,
    type: 'Tour Van Stuck',
    description: '8 Tourists',
    location: 'Swamp Trail Junction',
    timeAgo: '15 min ago',
    severity: 'High',
    status: 'Active'
  },
  {
    id: 2,
    type: 'Missing Family',
    description: 'Lost on Trail',
    location: 'Elephant Valley Trail',
    timeAgo: '25 min ago',
    severity: 'Critical',
    status: 'Active'
  },
  {
    id: 3,
    type: 'Road Closure',
    description: 'Main Safari Route',
    location: 'Main Safari Route KM',
    timeAgo: '30 min',
    severity: 'High',
    status: 'Active'
  }
];

// Mock Recent Locations
export const mockRecentLocations: Location[] = [
  {
    id: 1,
    title: 'African Elephant Herd',
    category: 'Wildlife',
    description: 'Large herd of 12 elephants near watering hole',
    coordinates: '-2.1534, 34.6857',
    reportedBy: 'Sarah Johnson',
    icon: 'pawprint.fill',
    iconColor: '#4CAF50',
    type: 'African Elephant',
    count: '12',
    location: 'Grid C-8',
    timeAgo: '1 hour ago'
  },
  {
    id: 2,
    title: 'Black Rhino Mother & Calf',
    category: 'Wildlife',
    description: 'Mother rhino with healthy calf',
    coordinates: '-2.1234, 34.7123',
    reportedBy: 'Sarah Johnson',
    icon: 'pawprint.fill',
    iconColor: '#4CAF50',
    isEndangered: true,
    timeAgo: '2 hours ago',
    type: 'Black Rhino',
    count: '2',
    location: 'Grid D-3'
  },
  {
    id: 3,
    title: 'Baby Hippo Feeding Area',
    category: 'Attraction',
    description: 'Popular spot for visitors to observe and feed baby hippos under ranger supervision',
    operatingHours: '9:00 AM - 5:00 PM',
    features: ['Viewing Platform', 'Educational Signs', 'Feeding Sessions'],
    coordinates: '-2.1734, 34.6657',
    reportedBy: 'Park Management',
    icon: 'eye.fill',
    iconColor: '#FF9800',
    type: 'Baby Hippo Feeding Area',
    location: 'Tourist Zone A',
    timeAgo: '2 hours ago'
  },
  {
    id: 4,
    title: 'Lion Rock Viewpoint',
    category: 'Viewpoint',
    description: 'Elevated viewpoint offering panoramic views of the savannah and frequent lion sightings',
    operatingHours: '6:00 AM - 7:00 PM',
    features: ['Viewing Platform', 'Binoculars Rental', 'Rest Area'],
    coordinates: '-2.1834, 34.6757',
    reportedBy: 'Park Management',
    icon: 'eye.fill',
    iconColor: '#2196F3',
    type: 'Lion Rock Viewpoint',
    location: 'Viewpoint Zone B',
    timeAgo: '3 hours ago'
  },
  {
    id: 5,
    title: 'Safari Lodge & Spa',
    category: 'Hotel',
    rating: '4.8 ⭐',
    description: 'Luxury eco-lodge with spa facilities and guided safari tours',
    contact: '+254-700-555-0123',
    features: ['Spa', 'Pool', 'Restaurant', 'Bar'],
    coordinates: '-2.1934, 34.6857',
    reportedBy: 'Park Management',
    icon: 'building.2.fill',
    iconColor: '#9C27B0',
    type: 'Safari Lodge & Spa',
    location: 'Accommodation Zone',
    timeAgo: '1 day ago'
  }
];

// Mock Reports Data
export const mockReports: Report[] = [
  {
    id: 1,
    title: 'Vehicle Breakdown - Tour Group',
    category: 'Infrastructure',
    severity: 'High',
    status: 'In Progress',
    description: 'Safari van broke down with 8 tourists on board. No injuries reported.',
    touristsAffected: 8,
    operator: 'Mara Safari Tours',
    transport: 'Toyota Land Cruiser',
    medicalCondition: 'None',
    infrastructureDetails: 'Engine failure, needs towing',
    location: 'Swamp Trail Junction',
    dateTime: '2024-01-15 14:30',
    photos: ['breakdown_1.jpg', 'breakdown_2.jpg'],
    reportedBy: 'Sarah Johnson'
  },
  {
    id: 2,
    title: 'Missing Family - Lost on Trail',
    category: 'Visitor Safety',
    severity: 'Critical',
    status: 'Active',
    description: 'Family of 4 lost on Elephant Valley Trail. Last seen 2 hours ago.',
    touristsAffected: 4,
    operator: 'Self-guided',
    transport: 'Walking',
    medicalCondition: 'Unknown',
    infrastructureDetails: 'Trail markers missing in section C',
    location: 'Elephant Valley Trail',
    dateTime: '2024-01-15 12:15',
    photos: ['trail_1.jpg'],
    reportedBy: 'Ranger Smith'
  }
];

// Mock Impact Stats
export const mockImpactStats: ImpactStats = {
  incidentsReported: 247,
  wildlifeTracked: 1342,
  patrolsCompleted: 156,
  daysActive: 1847
};

// Mock Achievements
export const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: 'Wildlife Guardian',
    description: '500+ wildlife sightings logged',
    icon: 'pawprint.fill',
    iconColor: '#666',
    badgeIcon: 'star.fill',
    badgeColor: '#FFD700'
  },
  {
    id: 2,
    title: 'Emergency Responder',
    description: 'Quick response to 50+ incidents',
    icon: 'exclamationmark.triangle.fill',
    iconColor: '#ff6b6b',
    badgeIcon: 'star.fill',
    badgeColor: '#FFD700'
  },
  {
    id: 3,
    title: 'Team Leader',
    description: 'Leading conservation efforts',
    icon: 'person.2.fill',
    iconColor: '#4caf50',
    badgeIcon: 'star.fill',
    badgeColor: '#FFD700'
  },
  {
    id: 4,
    title: 'Tech Pioneer',
    description: 'Early adopter of SafariMap',
    icon: 'bolt.fill',
    iconColor: '#9c27b0',
    badgeIcon: 'star.fill',
    badgeColor: '#FFD700'
  }
];

// Filter Options
export const mockFilterOptions: FilterOption[] = [
  { value: 'All Locations', label: 'All Locations' },
  { value: 'Wildlife Only', label: 'Wildlife Only' },
  { value: 'Attractions', label: 'Attractions' },
  { value: 'Hotels & Lodges', label: 'Hotels & Lodges' },
  { value: 'Restaurants', label: 'Restaurants' },
  { value: 'Viewpoints', label: 'Viewpoints' },
  { value: 'Campsites', label: 'Campsites' }
];

// Category Options for Add Location
export const mockCategoryOptions: CategoryOption[] = [
  { id: 'Wildlife', label: 'Wildlife', icon: 'pawprint.fill' },
  { id: 'Attractions', label: 'Attractions', icon: 'eye.fill' },
  { id: 'Hotels', label: 'Hotels', icon: 'building.2.fill' },
  { id: 'Dining', label: 'Dining', icon: 'fork.knife' },
  { id: 'Viewpoints', label: 'Viewpoints', icon: 'eye.fill' }
];

// Species and Category Options
export const mockWildlifeSpecies = [
  'African Elephant',
  'Black Rhino',
  'White Rhino',
  'Lion',
  'Leopard',
  'Cheetah',
  'Buffalo',
  'Giraffe',
  'Zebra',
  'Hippo',
  'Wildebeest',
  'Impala',
  'Gazelle',
  'Warthog',
  'Hyena',
  'Jackal',
  'Baboon',
  'Vervet Monkey',
  'Ostrich',
  'Secretary Bird',
  'Eagle',
  'Vulture',
  'Flamingo',
  'Pelican',
  'Crocodile',
  'Monitor Lizard',
  'Python',
  'Cobra',
  'Mamba',
  'Other'
];

export const mockAttractionCategories = [
  'Wildlife Viewing',
  'Bird Watching',
  'Photography Spot',
  'Educational Center',
  'Cultural Site',
  'Historical Site',
  'Natural Wonder',
  'Waterfall',
  'Hot Spring',
  'Cave',
  'Rock Formation',
  'Tree Species',
  'Flower Garden',
  'Butterfly Garden',
  'Reptile House',
  'Other'
];

export const mockHotelCategories = [
  'Luxury Lodge',
  'Tented Camp',
  'Eco Lodge',
  'Budget Hotel',
  'Mid-range Hotel',
  'Boutique Hotel',
  'Safari Camp',
  'Glamping Site',
  'Backpacker Hostel',
  'Guest House',
  'Self-catering',
  'All-inclusive Resort',
  'Conference Center',
  'Wedding Venue',
  'Other'
];

export const mockDiningCategories = [
  'Fine Dining Restaurant',
  'Casual Restaurant',
  'Fast Food',
  'Café',
  'Coffee Shop',
  'Bar & Grill',
  'Pizza Place',
  'Seafood Restaurant',
  'Vegetarian Restaurant',
  'Local Cuisine',
  'International Cuisine',
  'Street Food',
  'Food Truck',
  'Picnic Area',
  'BBQ Spot',
  'Other'
];

export const mockViewpointCategories = [
  'Scenic Overlook',
  'Sunrise Point',
  'Sunset Point',
  'Wildlife Observation',
  'Bird Watching',
  'Photography Spot',
  'Panoramic View',
  'Mountain View',
  'Valley View',
  'Water View',
  'Forest View',
  'Savannah View',
  'Desert View',
  'Cultural View',
  'Historical View',
  'Other'
];

export const mockBestTimeOptions = [
  'Sunrise (5:30-7:00 AM)',
  'Morning (7:00-11:00 AM)',
  'Afternoon (12:00-4:00 PM)',
  'Sunset (5:00-7:30 PM)',
  'Anytime'
];
