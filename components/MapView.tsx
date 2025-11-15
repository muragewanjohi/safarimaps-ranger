import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

const { width, height } = Dimensions.get('window');

export interface MapLocation {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  type?: 'wildlife' | 'incident' | 'attraction' | 'hotel' | 'ranger' | 'route' | 'viewpoint' | 'park';
  id?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapViewComponentProps {
  initialRegion?: MapRegion;
  markers?: MapLocation[];
  onLocationSelect?: (location: MapLocation) => void;
  onRegionChange?: (region: MapRegion) => void;
  showUserLocation?: boolean;
  showTrail?: boolean;
  trailCoordinates?: MapLocation[];
  mode?: 'view' | 'select' | 'track';
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain';
}

export default function MapViewComponent({
  initialRegion,
  markers = [],
  onLocationSelect,
  onRegionChange,
  showUserLocation = true,
  showTrail = false,
  trailCoordinates = [],
  mode = 'view',
  onMapPress,
  mapType = 'satellite'
}: MapViewComponentProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<MapRegion>(
    initialRegion || {
      latitude: -1.2921, // Masai Mara coordinates
      longitude: 35.5739,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  );
  const mapRef = useRef<MapView>(null);

  // Update region when initialRegion prop changes
  useEffect(() => {
    if (initialRegion) {
      setRegion(initialRegion);
      // Animate map to new region
      mapRef.current?.animateToRegion(initialRegion, 1000);
    }
  }, [initialRegion]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      if (!initialRegion) {
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      setErrorMsg('Error getting location: ' + error);
    }
  };

  const handleMapPress = (event: any) => {
    if (mode === 'select' && onMapPress) {
      const coordinate = event.nativeEvent.coordinate;
      onMapPress(coordinate);
    }
  };

  const handleMarkerPress = (marker: MapLocation) => {
    if (onLocationSelect) {
      onLocationSelect(marker);
    }
  };

  const handleRegionChangeComplete = (newRegion: MapRegion) => {
    setRegion(newRegion);
    if (onRegionChange) {
      onRegionChange(newRegion);
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'wildlife': return '#4CAF50';
      case 'incident': return '#F44336';
      case 'attraction': return '#2196F3';
      case 'hotel': return '#FF9800';
      case 'ranger': return '#9C27B0';
      case 'route': return '#2E7D32';
      case 'viewpoint': return '#2196F3';
      case 'park': return '#2196F3';
      default: return '#666666';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'wildlife': return 'pawprint.fill';
      case 'incident': return 'exclamationmark.triangle.fill';
      case 'park': return 'tree.fill';
      case 'ranger': return 'person.fill';
      default: return 'mappin.circle.fill';
    }
  };


  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <IconSymbol name="location.slash" size={48} color="#ff6b6b" />
        <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion || region}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={handleMapPress}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType={mapType}
        loadingEnabled={true}
        loadingIndicatorColor="#2E7D32"
        loadingBackgroundColor="#f5f5f5"
        showsTraffic={false}
        showsBuildings={true}
        showsIndoors={false}
      >
        {/* User Location Circle */}
        {location && showUserLocation && (
          <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={100}
            strokeColor="#2E7D32"
            fillColor="rgba(46, 125, 50, 0.1)"
            strokeWidth={2}
          />
        )}

        {/* Trail Path / Routes */}
        {showTrail && trailCoordinates.length > 0 && (
          <Polyline
            coordinates={trailCoordinates}
            strokeColor="#2E7D32"
            strokeWidth={3}
            lineDashPattern={[8, 4]}
          />
        )}

        {/* Markers */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker)}
            pinColor={getMarkerColor(marker.type || 'default')}
          />
        ))}
      </MapView>

      {/* Map Mode Indicator */}
      {mode === 'select' && (
        <View style={styles.modeIndicator}>
          <IconSymbol name="hand.tap" size={20} color="#fff" />
          <ThemedText style={styles.modeText}>Tap to select location</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  modeIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  // Web fallback styles
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  webMapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 16,
    marginBottom: 8,
  },
  webMapSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  webMapInfo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  webMarkersList: {
    width: '100%',
    maxHeight: 200,
  },
  webMarkerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  webMarkerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  webMarkerInfo: {
    flex: 1,
  },
  webMarkerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  webMarkerDescription: {
    fontSize: 14,
    color: '#666',
  },
});
