import MapViewComponent, { MapLocation, MapRegion } from '@/components/MapView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePark } from '@/contexts/ParkContext';
import { locationService } from '@/services/locationService';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert, Dimensions, Image, Platform, ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function MapScreen() {
  const { selectedPark } = usePark();
  const [selectedFilter, setSelectedFilter] = useState('All Locations');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [mapMarkers, setMapMarkers] = useState<MapLocation[]>([]);
  const [mapRoutes, setMapRoutes] = useState<MapLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: -1.2921, // Masai Mara coordinates
    longitude: 35.5739,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showMap, setShowMap] = useState(true);

  // Get park-specific map data (same as home page)
  const getParkMapData = (parkId: string): any[] => {
    switch (parkId) {
      case '3467cff0-ca7d-4c6c-ad28-2d202f2372ce': // Masai Mara
        return [
          // Camps & Lodges
          { id: 'camp-1', title: 'Mara Ngenche', category: 'Hotel', description: 'Luxury safari camp', coordinates: '-1.4056, 35.1136', icon: 'building.2.fill', iconColor: '#9C27B0', reportedBy: 'Park Management' },
          { id: 'camp-2', title: 'Matira Bush Camp', category: 'Hotel', description: 'Authentic bush camp experience', coordinates: '-1.4067, 35.1156', icon: 'building.2.fill', iconColor: '#9C27B0', reportedBy: 'Park Management' },
          { id: 'camp-3', title: 'Ashnil Mara Camp', category: 'Hotel', description: 'Premium tented camp', coordinates: '-1.4078, 35.1176', icon: 'building.2.fill', iconColor: '#9C27B0', reportedBy: 'Park Management' },
          { id: 'camp-4', title: 'Ishara Mara', category: 'Hotel', description: 'Boutique safari camp', coordinates: '-1.4089, 35.1196', icon: 'building.2.fill', iconColor: '#9C27B0', reportedBy: 'Park Management' },
          { id: 'camp-5', title: 'Julia\'s River Camp', category: 'Hotel', description: 'Riverside camp', coordinates: '-1.4100, 35.1216', icon: 'building.2.fill', iconColor: '#9C27B0', reportedBy: 'Park Management' },
          { id: 'camp-6', title: 'Fig Tree Camp', category: 'Hotel', description: 'Classic safari camp', coordinates: '-1.4111, 35.1236', icon: 'building.2.fill', iconColor: '#9C27B0', reportedBy: 'Park Management' },
          { id: 'camp-7', title: 'Basecamp Maasai Mara', category: 'Hotel', description: 'Eco-friendly camp', coordinates: '-1.4122, 35.1256', icon: 'building.2.fill', iconColor: '#9C27B0', reportedBy: 'Park Management' },
          { id: 'camp-8', title: 'AA Lodge Masai Mara', category: 'Hotel', description: 'Comfortable lodge accommodation', coordinates: '-1.4133, 35.1276', icon: 'building.2.fill', iconColor: '#9C27B0', reportedBy: 'Park Management' },
          // Wildebeest Crossings
          { id: 'crossing-1', title: 'Kuni Beach Wildebeest Crossing', category: 'Attraction', description: 'Major wildebeest migration crossing point', coordinates: '-1.4144, 35.1296', icon: 'eye.fill', iconColor: '#2196F3', reportedBy: 'Park Management' },
          { id: 'crossing-2', title: 'Entim Wildebeest Crossing Point', category: 'Attraction', description: 'Wildebeest migration route', coordinates: '-1.4155, 35.1316', icon: 'eye.fill', iconColor: '#2196F3', reportedBy: 'Park Management' },
          // Viewpoints & Lookouts
          { id: 'viewpoint-1', title: 'Leopard Lookout', category: 'Viewpoint', description: 'Scenic viewpoint for wildlife watching', coordinates: '-1.4166, 35.1336', icon: 'eye.fill', iconColor: '#2196F3', reportedBy: 'Park Management' },
          { id: 'viewpoint-2', title: 'Viewpoint over the Mara River', category: 'Viewpoint', description: 'Panoramic view of the Mara River', coordinates: '-1.4177, 35.1356', icon: 'eye.fill', iconColor: '#2196F3', reportedBy: 'Park Management' },
          { id: 'viewpoint-3', title: 'Lookout Hill', category: 'Viewpoint', description: 'Elevated viewpoint', coordinates: '-1.4188, 35.1376', icon: 'eye.fill', iconColor: '#2196F3', reportedBy: 'Park Management' },
          // Other Landmarks
          { id: 'landmark-1', title: 'Maasai Mara National Reserve', category: 'Attraction', description: 'Main reserve entrance', coordinates: '-1.4199, 35.1396', icon: 'mappin.circle.fill', iconColor: '#FF9800', reportedBy: 'Park Management' },
          { id: 'landmark-2', title: 'Amos Transmara Point', category: 'Attraction', description: 'Key geographical marker', coordinates: '-1.4210, 35.1416', icon: 'mappin.circle.fill', iconColor: '#FF9800', reportedBy: 'Park Management' },
          { id: 'landmark-3', title: 'Masai Village', category: 'Attraction', description: 'Traditional Maasai village', coordinates: '-1.4221, 35.1436', icon: 'mappin.circle.fill', iconColor: '#FF9800', reportedBy: 'Park Management' },
          { id: 'landmark-4', title: 'Balloons Take-off Point', category: 'Attraction', description: 'Hot air balloon launch site', coordinates: '-1.4232, 35.1456', icon: 'mappin.circle.fill', iconColor: '#FF9800', reportedBy: 'Park Management' },
          // River Crossings
          { id: 'river-1', title: 'River Crossing Point', category: 'Attraction', description: 'Vehicle river crossing', coordinates: '-1.4243, 35.1476', icon: 'mappin.circle.fill', iconColor: '#FF9800', reportedBy: 'Park Management' },
          // Wildlife Sightings
          { id: 'wildlife-1', title: 'Lion Pride', category: 'Wildlife', description: 'Large pride spotted', coordinates: '-1.3956, 35.1000', icon: 'pawprint.fill', iconColor: '#4CAF50', reportedBy: 'Ranger Team' },
          { id: 'wildlife-2', title: 'Elephant Herd', category: 'Wildlife', description: 'Family of 8 elephants', coordinates: '-1.3967, 35.1020', icon: 'pawprint.fill', iconColor: '#4CAF50', reportedBy: 'Ranger Team' }
        ];
      default:
        return [];
    }
  };

  const filterOptions = [
    'All Locations',
    'Wildlife Only',
    'Attractions',
    'Hotels & Lodges',
    'Restaurants',
    'Viewpoints',
    'Campsites'
  ];

  // Use park-specific locations or fallback to default
  const defaultLocations = [
    {
      id: 1,
      title: 'African Elephant Herd',
      category: 'Wildlife',
      description: 'Large herd of 12 elephants near watering hole',
      coordinates: '-2.1534, 34.6857',
      reportedBy: 'Sarah Johnson',
      icon: 'pawprint.fill' as const,
      iconColor: '#4CAF50'
    },
    {
      id: 2,
      title: 'Black Rhino Mother & Calf',
      category: 'Wildlife',
      description: 'Mother rhino with healthy calf',
      coordinates: '-2.1234, 34.7123',
      reportedBy: 'Sarah Johnson',
      icon: 'pawprint.fill' as const,
      iconColor: '#4CAF50',
      isEndangered: true,
      timeAgo: '2 hours ago'
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
      icon: 'eye.fill' as const,
      iconColor: '#FF9800'
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
      icon: 'eye.fill' as const,
      iconColor: '#2196F3'
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
      icon: 'building.2.fill' as const,
      iconColor: '#9C27B0'
    }
  ];
  
  // Memoize locations to prevent infinite re-renders
  const locations = useMemo(() => {
    const parkLocations = selectedPark ? getParkMapData(selectedPark.id) : [];
    return parkLocations.length > 0 ? parkLocations : defaultLocations;
  }, [selectedPark?.id]);

  // Convert locations to map markers
  const convertToMapMarkers = useCallback((locations: any[]): MapLocation[] => {
    return locations.map(location => {
      if (!location.coordinates) {
        console.warn('Location missing coordinates:', location);
        return null;
      }
      
      const [lat, lng] = location.coordinates.split(', ').map(Number);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid coordinates for location:', location.title, location.coordinates);
        return null;
      }
      
      // Map category to type
      let type: MapLocation['type'] = 'park';
      const category = location.category?.toLowerCase() || '';
      if (category === 'wildlife') {
        type = 'wildlife';
      } else if (category === 'hotel') {
        type = 'hotel';
      } else if (category === 'attraction' || category === 'viewpoint') {
        type = category === 'viewpoint' ? 'viewpoint' : 'attraction';
      } else if (category === 'incident') {
        type = 'incident';
      } else if (category === 'ranger') {
        type = 'ranger';
      }
      
      return {
        id: location.id?.toString() || `marker-${lat}-${lng}`,
        latitude: lat,
        longitude: lng,
        title: location.title,
        description: location.description,
        type: type
      };
    }).filter((marker): marker is MapLocation => marker !== null);
  }, []);

  // Get park routes (same as home page)
  const getParkRoutes = (parkId: string): MapLocation[] => {
    switch (parkId) {
      case '3467cff0-ca7d-4c6c-ad28-2d202f2372ce': // Masai Mara
        return [
          { latitude: -1.2921, longitude: 35.5739 },
          { latitude: -1.2850, longitude: 35.5800 },
          { latitude: -1.3000, longitude: 35.5600 },
          { latitude: -1.2750, longitude: 35.5900 },
          { latitude: -1.2900, longitude: 35.5750 },
          { latitude: -1.2921, longitude: 35.5739 }
        ];
      case '0dba0933-f39f-4c78-a943-45584f383d20': // Nairobi National Park
        return [
          { latitude: -1.3733, longitude: 36.8129 },
          { latitude: -1.3800, longitude: 36.8200 },
          { latitude: -1.3700, longitude: 36.8100 },
          { latitude: -1.3733, longitude: 36.8129 }
        ];
      case 'dc9b8bdc-7e14-4219-a35a-0ab1fb0a4513': // Meru National Park
        return [
          { latitude: 0.0833, longitude: 38.2000 },
          { latitude: 0.1000, longitude: 38.2200 },
          { latitude: 0.0833, longitude: 38.2000 }
        ];
      default:
        return [];
    }
  };

  // Get park region helper function
  const getParkRegion = (parkId: string): MapRegion => {
    switch (parkId) {
      case '3467cff0-ca7d-4c6c-ad28-2d202f2372ce': // Masai Mara
        return {
          latitude: -1.4065,
          longitude: 35.1228,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        };
      case '0dba0933-f39f-4c78-a943-45584f383d20': // Nairobi National Park
        return {
          latitude: -1.3733,
          longitude: 36.8129,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
      case 'dc9b8bdc-7e14-4219-a35a-0ab1fb0a4513': // Meru National Park
        return {
          latitude: 0.0833,
          longitude: 38.2000,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
      default:
        return mapRegion;
    }
  };

  // Initialize map markers and routes when park changes
  useEffect(() => {
    const markers = convertToMapMarkers(locations);
    console.log('Map markers converted:', markers.length, 'from', locations.length, 'locations');
    setMapMarkers(markers);
    
    // Set routes for the selected park
    if (selectedPark) {
      const routes = getParkRoutes(selectedPark.id);
      setMapRoutes(routes);
    } else {
      setMapRoutes([]);
    }
  }, [locations, convertToMapMarkers, selectedPark?.id]);

  // Update map region when park changes
  useEffect(() => {
    if (selectedPark) {
      setMapRegion(getParkRegion(selectedPark.id));
    }
  }, [selectedPark?.id]);

  // Get current location
  useEffect(() => {
    const getLocation = async () => {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    };
    getLocation();
  }, []);

  const handleAddLocation = () => {
    router.push('/add-location');
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  const openDirections = async (latitude: number, longitude: number, title?: string) => {
    try {
      const lat = latitude;
      const lng = longitude;
      
      // For rangers in the field, using external maps is the best practice because:
      // - Native apps have better offline support and battery efficiency
      // - Turn-by-turn navigation with voice guidance
      // - Real-time traffic and road condition updates
      // - Users already have their preferred maps app configured
      
      // Use Google Maps URL scheme that works on both iOS and Android
      const url = Platform.select({
        ios: `maps://app?daddr=${lat},${lng}&directionsmode=driving`,
        android: `google.navigation:q=${lat},${lng}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      });

      // Try to open the native app first
      const canOpen = await Linking.canOpenURL(url as string);
      
      if (canOpen) {
        await Linking.openURL(url as string);
      } else {
        // Fallback to web-based Google Maps
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Error opening directions:', error);
      Alert.alert(
        'Directions Unavailable',
        'Unable to open directions. Please check that a maps application is installed on your device.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLocationPress = (location: any) => {
    // Parse coordinates and open directions in external maps app
    // This follows best practices for field operations apps where:
    // - Reliability and offline support are critical
    // - Battery efficiency matters during long field work
    // - Native navigation features are more robust
    const [lat, lng] = location.coordinates.split(', ').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      openDirections(lat, lng, location.title);
    } else {
      Alert.alert('Invalid Coordinates', 'Unable to get directions for this location.');
    }
  };
  
  const handleMapMarkerPress = (marker: MapLocation) => {
    // Open directions to the marker location
    openDirections(marker.latitude, marker.longitude, marker.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Bar */}
        <View style={styles.titleBar}>
          <View style={styles.titleBarContent}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.titleBarLogo}
              resizeMode="contain"
            />
            <ThemedText style={styles.titleBarText}>SafariMap GameWarden</ThemedText>
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.title}>Map View</ThemedText>
            <ThemedText style={styles.subtitle}>
              {selectedPark ? `${selectedPark.name} - Locations & Points of Interest` : 'Loading park data...'}
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.addLocationButton} onPress={handleAddLocation}>
            <IconSymbol name="plus" size={16} color="#fff" />
            <ThemedText style={styles.addLocationText}>Add Location</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Filter and Layers Bar */}
        <View style={styles.filterBar}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <IconSymbol name="location.fill" size={16} color="#666" />
            <ThemedText style={styles.filterText}>{selectedFilter}</ThemedText>
            <IconSymbol name="chevron.down" size={14} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.layersButton}>
            <IconSymbol name="doc.text.fill" size={16} color="#666" />
            <ThemedText style={styles.layersText}>Layers</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Filter Dropdown */}
        {showFilterDropdown && (
          <View style={styles.filterDropdown}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.filterOption}
                onPress={() => handleFilterSelect(option)}
              >
                <ThemedText style={styles.filterOptionText}>{option}</ThemedText>
                {selectedFilter === option && (
                  <IconSymbol name="checkmark" size={16} color="#2E7D32" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Map Toggle */}
        <View style={styles.mapToggleContainer}>
          <TouchableOpacity 
            style={[styles.mapToggleButton, showMap && styles.mapToggleButtonActive]}
            onPress={() => setShowMap(!showMap)}
          >
            <IconSymbol name="map.fill" size={16} color={showMap ? "#fff" : "#666"} />
            <ThemedText style={[styles.mapToggleText, showMap && styles.mapToggleTextActive]}>
              {showMap ? 'Hide Map' : 'Show Map'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Google Maps */}
        {showMap && (
          <View style={styles.mapContainer}>
            <MapViewComponent
              initialRegion={mapRegion}
              markers={mapMarkers}
              trailCoordinates={mapRoutes}
              showTrail={mapRoutes.length > 0}
              onLocationSelect={handleMapMarkerPress}
              onRegionChange={(region) => setMapRegion(region)}
              showUserLocation={true}
              mode="view"
              mapType="standard"
            />
          </View>
        )}

        {/* Locations List */}
        <View style={styles.locationsSection}>
          <ThemedText style={styles.locationsTitle}>Locations ({locations.length})</ThemedText>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.locationCard}
              onPress={() => handleLocationPress(location)}
            >
              <View style={styles.locationCardHeader}>
                <View style={[styles.locationIcon, { backgroundColor: location.iconColor }]}>
                  <IconSymbol name={location.icon} size={20} color="#fff" />
                </View>
                <View style={styles.locationInfo}>
                  <View style={styles.locationTitleRow}>
                    <ThemedText style={styles.locationTitle}>{location.title}</ThemedText>
                    <View style={styles.badgeContainer}>
                      <View style={styles.categoryBadge}>
                        <ThemedText style={styles.categoryText}>{location.category}</ThemedText>
                      </View>
                      {location.isEndangered && (
                        <View style={styles.endangeredBadge}>
                          <ThemedText style={styles.endangeredText}>ENDANGERED</ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                  <ThemedText style={styles.locationDescription}>{location.description}</ThemedText>
                  
                  {location.rating && (
                    <ThemedText style={styles.locationRating}>{location.rating}</ThemedText>
                  )}
                  
                  {location.operatingHours && (
                    <View style={styles.locationMeta}>
                      <IconSymbol name="clock.fill" size={12} color="#666" />
                      <ThemedText style={styles.locationMetaText}>{location.operatingHours}</ThemedText>
                    </View>
                  )}
                  
                  {location.contact && (
                    <View style={styles.locationMeta}>
                      <IconSymbol name="phone.fill" size={12} color="#666" />
                      <ThemedText style={styles.locationMetaText}>{location.contact}</ThemedText>
                    </View>
                  )}
                  
                  {location.features && (
                    <View style={styles.featuresContainer}>
                      {location.features.map((feature, index) => (
                        <View key={index} style={styles.featureTag}>
                          <ThemedText style={styles.featureText}>{feature}</ThemedText>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <View style={styles.locationMeta}>
                    <IconSymbol name="location.fill" size={12} color="#666" />
                    <ThemedText style={styles.locationMetaText}>{location.coordinates}</ThemedText>
                  </View>
                  
                  <View style={styles.locationMeta}>
                    <IconSymbol name="clock.fill" size={12} color="#666" />
                    <ThemedText style={styles.locationMetaText}>Last updated: {location.timeAgo}</ThemedText>
                  </View>
                  
                  <ThemedText style={styles.reportedBy}>by {location.reportedBy}</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  titleBar: {
    backgroundColor: '#2E7D32',
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderBottomWidth: 0,
  },
  titleBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  titleBarLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 4,
  },
  titleBarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addLocationButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  addLocationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  layersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
  },
  layersText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterDropdown: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#000',
  },
  mapToggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  mapToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  mapToggleButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  mapToggleText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  mapToggleTextActive: {
    color: '#fff',
  },
  mapContainer: {
    height: height * 0.4, // 40% of screen height
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationsSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  locationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  locationsList: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  locationCardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  endangeredBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  endangeredText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  locationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  locationRating: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
    marginBottom: 8,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationMetaText: {
    fontSize: 12,
    color: '#666',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 8,
  },
  featureTag: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  reportedBy: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});