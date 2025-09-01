import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All Locations');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = [
    'All Locations',
    'Wildlife Only',
    'Attractions',
    'Hotels & Lodges',
    'Restaurants',
    'Viewpoints',
    'Campsites'
  ];

  const locations = [
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
      iconColor: '#4CAF50'
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

  const handleAddLocation = () => {
    Alert.alert('Add Location', 'Add new location feature coming soon!');
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  const handleLocationPress = (location: any) => {
    Alert.alert(location.title, `${location.description}\n\nCoordinates: ${location.coordinates}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Bar */}
        <View style={styles.titleBar}>
          <ThemedText style={styles.titleBarText}>SafariMap GameWarden</ThemedText>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ThemedText style={styles.title}>Map View</ThemedText>
            <ThemedText style={styles.subtitle}>Masai Mara National Reserve - Locations & Points of Interest</ThemedText>
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

        {/* Map Area */}
        <View style={styles.mapContainer}>
          <View style={styles.mapArea}>
            <View style={styles.mapLabel}>
              <ThemedText style={styles.mapLabelTitle}>Masai Mara National Reserve</ThemedText>
              <ThemedText style={styles.mapLabelSubtitle}>Narok County, Kenya</ThemedText>
            </View>
            
            {/* Map Markers */}
            <View style={styles.mapMarkers}>
              <View style={[styles.marker, { top: 20, left: 50 }]}>
                <IconSymbol name="pawprint.fill" size={16} color="#fff" />
              </View>
              <View style={[styles.marker, { top: 80, left: 120 }]}>
                <IconSymbol name="pawprint.fill" size={16} color="#fff" />
              </View>
              <View style={[styles.marker, styles.selectedMarker, { top: 140, left: 80 }]}>
                <IconSymbol name="eye.fill" size={16} color="#fff" />
              </View>
              <View style={[styles.marker, { top: 200, left: 150 }]}>
                <IconSymbol name="eye.fill" size={16} color="#fff" />
              </View>
              <View style={[styles.marker, { top: 260, left: 100 }]}>
                <IconSymbol name="building.2.fill" size={16} color="#fff" />
              </View>
              <View style={[styles.marker, { top: 320, left: 60 }]}>
                <IconSymbol name="plus" size={16} color="#fff" />
              </View>
            </View>
          </View>
        </View>

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
                    <View style={styles.categoryBadge}>
                      <ThemedText style={styles.categoryText}>{location.category}</ThemedText>
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
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  titleBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
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
  mapContainer: {
    height: 300,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#C8E6C9',
    position: 'relative',
  },
  mapLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapLabelTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  mapLabelSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  mapMarkers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedMarker: {
    backgroundColor: '#FF9800',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  locationsSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
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