import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

const { width } = Dimensions.get('window');

export interface ParkMapLocation {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  type?: 'wildlife' | 'incident' | 'attraction' | 'hotel' | 'ranger' | 'route';
  id?: string;
}

export interface ParkMapCardProps {
  parkName: string;
  parkRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: ParkMapLocation[];
  routes?: ParkMapLocation[];
  onPress?: () => void;
}

export default function ParkMapCard({
  parkName,
  parkRegion,
  markers = [],
  routes = [],
  onPress
}: ParkMapCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'wildlife': return '#4CAF50';
      case 'incident': return '#F44336';
      case 'attraction': return '#2196F3';
      case 'hotel': return '#FF9800';
      case 'ranger': return '#9C27B0';
      case 'route': return '#2E7D32';
      default: return '#666666';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'wildlife': return 'pawprint.fill';
      case 'incident': return 'exclamationmark.triangle.fill';
      case 'attraction': return 'eye.fill';
      case 'hotel': return 'building.2.fill';
      case 'ranger': return 'person.fill';
      case 'route': return 'road.lanes';
      default: return 'mappin.circle.fill';
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/explore');
    }
  };

  const handleExpandPress = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <IconSymbol name="map.fill" size={20} color="#2E7D32" />
              <ThemedText style={styles.title}>{parkName} Map</ThemedText>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{markers.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Locations</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{routes.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Routes</ThemedText>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={handleExpandPress}
            activeOpacity={0.7}
          >
            <IconSymbol 
              name={isExpanded ? "chevron.up" : "chevron.down"} 
              size={16} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        {/* Map Container */}
        <View style={[styles.mapContainer, isExpanded && styles.mapContainerExpanded]}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={parkRegion}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            showsScale={false}
            mapType="standard"
            loadingEnabled={true}
            loadingIndicatorColor="#2E7D32"
            loadingBackgroundColor="#f5f5f5"
            showsTraffic={false}
            showsBuildings={true}
            showsIndoors={false}
          >
            {/* Park Routes */}
            {routes.length > 0 && (
              <Polyline
                coordinates={routes}
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
                pinColor={getMarkerColor(marker.type || 'default')}
              />
            ))}
          </MapView>

          {/* Map Overlay Info */}
          <View style={styles.mapOverlay}>
            <View style={styles.overlayContent}>
              <ThemedText style={styles.overlayText}>
                {markers.length} locations • {routes.length} routes
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <IconSymbol name="eye.fill" size={16} color="#2E7D32" />
            <ThemedText style={styles.actionButtonText}>View Full Map</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/add-location')}
          >
            <IconSymbol name="plus.circle.fill" size={16} color="#2E7D32" />
            <ThemedText style={styles.actionButtonText}>Add Location</ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  expandButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapContainerExpanded: {
    height: 300,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
});
