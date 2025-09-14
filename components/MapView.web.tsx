import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

const { width, height } = Dimensions.get('window');

export interface MapLocation {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  type?: 'wildlife' | 'incident' | 'park' | 'ranger';
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
}

export default function MapViewComponent({
  markers = [],
  onLocationSelect,
  mode = 'view',
}: MapViewComponentProps) {
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'wildlife': return '#4CAF50';
      case 'incident': return '#F44336';
      case 'park': return '#2196F3';
      case 'ranger': return '#FF9800';
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

  return (
    <View style={styles.container}>
      <View style={styles.webMapFallback}>
        <IconSymbol name="map.fill" size={48} color="#2E7D32" />
        <ThemedText style={styles.webMapTitle}>Interactive Map</ThemedText>
        <ThemedText style={styles.webMapSubtitle}>
          Maps are available on mobile devices
        </ThemedText>
        <ThemedText style={styles.webMapInfo}>
          {markers.length > 0 && `${markers.length} locations available`}
        </ThemedText>
        {markers.length > 0 && (
          <View style={styles.webMarkersList}>
            {markers.map((marker, index) => (
              <TouchableOpacity
                key={marker.id || index}
                style={styles.webMarkerItem}
                onPress={() => onLocationSelect?.(marker)}
              >
                <View style={[styles.webMarkerIcon, { backgroundColor: getMarkerColor(marker.type || 'default') }]}>
                  <IconSymbol name={getMarkerIcon(marker.type || 'default')} size={16} color="#fff" />
                </View>
                <View style={styles.webMarkerInfo}>
                  <ThemedText style={styles.webMarkerTitle}>{marker.title}</ThemedText>
                  <ThemedText style={styles.webMarkerDescription}>{marker.description}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {mode === 'select' && (
          <View style={styles.modeIndicator}>
            <IconSymbol name="hand.tap" size={20} color="#fff" />
            <ThemedText style={styles.modeText}>Location selection available on mobile</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
});
