import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

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
  markers = [],
  routes = [],
  onPress,
}: Readonly<ParkMapCardProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/explore');
    }
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
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={isExpanded ? 'chevron.down' : 'chevron.down'}
              size={16}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Web fallback for map */}
        <View style={[styles.mapContainer, isExpanded && styles.mapContainerExpanded]}>
          <View style={styles.webFallback}>
            <IconSymbol name="map.fill" size={36} color="#2E7D32" />
            <ThemedText style={styles.webFallbackTitle}>Interactive Map</ThemedText>
            <ThemedText style={styles.webFallbackSubtitle}>
              Maps are available on mobile devices
            </ThemedText>
            <ThemedText style={styles.webFallbackInfo}>
              {markers.length} locations &bull; {routes.length} routes
            </ThemedText>
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
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f5f0',
    padding: 20,
  },
  webFallbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 12,
    marginBottom: 4,
  },
  webFallbackSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  webFallbackInfo: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
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
