import MapViewComponent from '@/components/MapView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {
    mockAttractionCategories,
    mockBestTimeOptions,
    mockCategoryOptions,
    mockDiningCategories,
    mockHotelCategories,
    mockViewpointCategories,
    mockWildlifeSpecies
} from '@/data/mockData';
import { useAddLocation } from '@/hooks/useDataService';
import { locationService } from '@/services/locationService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function AddLocationScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Wildlife');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedAttraction, setSelectedAttraction] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedDining, setSelectedDining] = useState('');
  const [selectedViewpoint, setSelectedViewpoint] = useState('');
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);
  const [showAttractionDropdown, setShowAttractionDropdown] = useState(false);
  const [showHotelDropdown, setShowHotelDropdown] = useState(false);
  const [showDiningDropdown, setShowDiningDropdown] = useState(false);
  const [showViewpointDropdown, setShowViewpointDropdown] = useState(false);
  const [showBestTimeDropdown, setShowBestTimeDropdown] = useState(false);
  const [count, setCount] = useState('');
  const [description, setDescription] = useState('');
  const [attractionName, setAttractionName] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [contact, setContact] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Use data service hook
  const { addLocation, loading, error } = useAddLocation();

  // Get current location on mount
  useEffect(() => {
    const getLocation = async () => {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        setSelectedLocation(location);
      }
    };
    getLocation();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleAddPhoto = () => {
    if (photos.length >= 3) {
      Alert.alert('Photo Limit', 'You can only add up to 3 photos.');
      return;
    }
    Alert.alert('Add Photo', 'Camera/Gallery integration coming soon!');
    // Mock adding a photo
    setPhotos([...photos, `photo_${photos.length + 1}.jpg`]);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Reset all dropdowns when category changes
    setShowSpeciesDropdown(false);
    setShowAttractionDropdown(false);
    setShowHotelDropdown(false);
    setShowDiningDropdown(false);
    setShowViewpointDropdown(false);
    setShowBestTimeDropdown(false);
    // Reset selections
    setSelectedSpecies('');
    setSelectedAttraction('');
    setSelectedHotel('');
    setSelectedDining('');
    setSelectedViewpoint('');
    setBestTimeToVisit('');
    // Reset additional fields
    setAttractionName('');
    setOperatingHours('');
    setHotelName('');
    setContact('');
  };

  const handleAddLocation = async () => {
    let selectedSubcategory = '';
    switch (selectedCategory) {
      case 'Wildlife':
        selectedSubcategory = selectedSpecies;
        break;
      case 'Attractions':
        selectedSubcategory = selectedAttraction;
        break;
      case 'Hotels':
        selectedSubcategory = selectedHotel;
        break;
      case 'Dining':
        selectedSubcategory = selectedDining;
        break;
      case 'Viewpoints':
        selectedSubcategory = selectedViewpoint;
        break;
    }

    if (!selectedSubcategory) {
      Alert.alert('Missing Information', 'Please select a category option.');
      return;
    }

    // Prepare location data
    const coordinates = selectedLocation 
      ? `${selectedLocation.latitude.toFixed(6)}°, ${selectedLocation.longitude.toFixed(6)}°`
      : 'Location not selected';

    const locationData = {
      category: selectedCategory as any,
      subcategory: selectedSubcategory,
      description,
      photos,
      coordinates,
      latitude: selectedLocation?.latitude,
      longitude: selectedLocation?.longitude,
      ...(selectedCategory === 'Wildlife' && count && { count }),
      ...(selectedCategory === 'Attractions' && {
        attractionName,
        operatingHours
      }),
      ...((selectedCategory === 'Hotels' || selectedCategory === 'Dining') && {
        hotelName,
        contact
      }),
      ...(selectedCategory === 'Viewpoints' && bestTimeToVisit && {
        bestTimeToVisit
      })
    };

    // Add location using data service
    const result = await addLocation(locationData);
    
    if (result) {
      Alert.alert(
        'Location Added',
        `Successfully added ${selectedCategory}: ${selectedSubcategory}`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } else if (error) {
      Alert.alert('Error', error);
    }
  };

  const getCurrentSelection = () => {
    switch (selectedCategory) {
      case 'Wildlife':
        return selectedSpecies || 'Select species';
      case 'Attractions':
        return selectedAttraction || 'Select attraction type';
      case 'Hotels':
        return selectedHotel || 'Select hotel type';
      case 'Dining':
        return selectedDining || 'Select dining type';
      case 'Viewpoints':
        return selectedViewpoint || 'Select viewpoint type';
      default:
        return 'Select option';
    }
  };

  const getCurrentOptions = () => {
    switch (selectedCategory) {
      case 'Wildlife':
        return mockWildlifeSpecies;
      case 'Attractions':
        return mockAttractionCategories;
      case 'Hotels':
        return mockHotelCategories;
      case 'Dining':
        return mockDiningCategories;
      case 'Viewpoints':
        return mockViewpointCategories;
      default:
        return [];
    }
  };

  const getCurrentDropdownState = () => {
    switch (selectedCategory) {
      case 'Wildlife':
        return showSpeciesDropdown;
      case 'Attractions':
        return showAttractionDropdown;
      case 'Hotels':
        return showHotelDropdown;
      case 'Dining':
        return showDiningDropdown;
      case 'Viewpoints':
        return showViewpointDropdown;
      default:
        return false;
    }
  };

  const setCurrentDropdownState = (state: boolean) => {
    switch (selectedCategory) {
      case 'Wildlife':
        setShowSpeciesDropdown(state);
        break;
      case 'Attractions':
        setShowAttractionDropdown(state);
        break;
      case 'Hotels':
        setShowHotelDropdown(state);
        break;
      case 'Dining':
        setShowDiningDropdown(state);
        break;
      case 'Viewpoints':
        setShowViewpointDropdown(state);
        break;
    }
  };

  const handleOptionSelect = (option: string) => {
    switch (selectedCategory) {
      case 'Wildlife':
        setSelectedSpecies(option);
        setShowSpeciesDropdown(false);
        break;
      case 'Attractions':
        setSelectedAttraction(option);
        setShowAttractionDropdown(false);
        break;
      case 'Hotels':
        setSelectedHotel(option);
        setShowHotelDropdown(false);
        break;
      case 'Dining':
        setSelectedDining(option);
        setShowDiningDropdown(false);
        break;
      case 'Viewpoints':
        setSelectedViewpoint(option);
        setShowViewpointDropdown(false);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Bar */}
        <View style={styles.titleBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <IconSymbol name="chevron.left" size={20} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.titleBarText}>Add New Location</ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Add New Location</ThemedText>
          <ThemedText style={styles.subtitle}>
            Add a new point of interest to Masai Mara National Reserve using your current GPS coordinates.
          </ThemedText>
        </View>

        {/* Category Selection */}
        <View style={styles.categorySection}>
          <ThemedText style={styles.sectionTitle}>Category</ThemedText>
          <View style={styles.categoryGrid}>
            {mockCategoryOptions.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategoryButton
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <IconSymbol 
                  name={category.icon} 
                  size={20} 
                  color={selectedCategory === category.id ? '#fff' : '#666'} 
                />
                <ThemedText style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Species/Type Selection */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.inputLabel}>
            {selectedCategory === 'Wildlife' ? 'Species' : 
             selectedCategory === 'Attractions' ? 'Attraction Type' :
             selectedCategory === 'Hotels' ? 'Hotel Type' :
             selectedCategory === 'Dining' ? 'Dining Type' :
             selectedCategory === 'Viewpoints' ? 'Viewpoint Type' : 'Type'}
          </ThemedText>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setCurrentDropdownState(!getCurrentDropdownState())}
          >
            <ThemedText style={styles.dropdownText}>{getCurrentSelection()}</ThemedText>
            <IconSymbol name="chevron.down" size={16} color="#666" />
          </TouchableOpacity>
          
          {getCurrentDropdownState() && (
            <View style={styles.dropdown}>
              {getCurrentOptions().map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownOption}
                  onPress={() => handleOptionSelect(option)}
                >
                  <ThemedText style={styles.dropdownOptionText}>{option}</ThemedText>
                  {(selectedCategory === 'Wildlife' && selectedSpecies === option) ||
                   (selectedCategory === 'Attractions' && selectedAttraction === option) ||
                   (selectedCategory === 'Hotels' && selectedHotel === option) ||
                   (selectedCategory === 'Dining' && selectedDining === option) ||
                   (selectedCategory === 'Viewpoints' && selectedViewpoint === option) ? (
                    <IconSymbol name="checkmark" size={16} color="#2E7D32" />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Count Input (for Wildlife) */}
        {selectedCategory === 'Wildlife' && (
          <View style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>Count</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Number of animals spotted"
              value={count}
              onChangeText={setCount}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Attraction Name and Operating Hours (for Attractions) */}
        {selectedCategory === 'Attractions' && (
          <>
            <View style={styles.inputSection}>
              <ThemedText style={styles.inputLabel}>Attraction Name</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Enter attraction name"
                value={attractionName}
                onChangeText={setAttractionName}
              />
            </View>
            <View style={styles.inputSection}>
              <ThemedText style={styles.inputLabel}>Operating Hours</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 9:00 AM - 5:00 PM"
                value={operatingHours}
                onChangeText={setOperatingHours}
              />
            </View>
          </>
        )}

        {/* Hotel/Dining Name and Contact (for Hotels and Dining) */}
        {(selectedCategory === 'Hotels' || selectedCategory === 'Dining') && (
          <>
            <View style={styles.inputSection}>
              <ThemedText style={styles.inputLabel}>
                {selectedCategory === 'Hotels' ? 'Hotel Name' : 'Restaurant Name'}
              </ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder={`Enter ${selectedCategory === 'Hotels' ? 'hotel' : 'restaurant'} name`}
                value={hotelName}
                onChangeText={setHotelName}
              />
            </View>
            <View style={styles.inputSection}>
              <ThemedText style={styles.inputLabel}>Contact</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Phone number or email"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
              />
            </View>
          </>
        )}

        {/* Best Time to Visit (for Viewpoints) */}
        {selectedCategory === 'Viewpoints' && (
          <View style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>Best Time to Visit</ThemedText>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowBestTimeDropdown(!showBestTimeDropdown)}
            >
              <ThemedText style={styles.dropdownText}>
                {bestTimeToVisit || 'Select best time'}
              </ThemedText>
              <IconSymbol name="chevron.down" size={16} color="#666" />
            </TouchableOpacity>
            
            {showBestTimeDropdown && (
              <View style={styles.dropdown}>
                {mockBestTimeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setBestTimeToVisit(option);
                      setShowBestTimeDropdown(false);
                    }}
                  >
                    <ThemedText style={styles.dropdownOptionText}>{option}</ThemedText>
                    {bestTimeToVisit === option && (
                      <IconSymbol name="checkmark" size={16} color="#2E7D32" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Description Input */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.inputLabel}>Description</ThemedText>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            placeholder="Additional details and notes..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Photo Upload Section */}
        <View style={styles.photoSection}>
          <ThemedText style={styles.inputLabel}>Photos (Optional)</ThemedText>
          <ThemedText style={styles.photoSubtitle}>Add up to 3 photos to document the location</ThemedText>
          
          <View style={styles.photoContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <View style={styles.photoPlaceholder}>
                  <IconSymbol name="camera.fill" size={24} color="#666" />
                  <ThemedText style={styles.photoText}>{photo}</ThemedText>
                </View>
                <TouchableOpacity 
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <IconSymbol name="xmark" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            
            {photos.length < 3 && (
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <IconSymbol name="plus" size={24} color="#666" />
                <ThemedText style={styles.addPhotoText}>Add Photo</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Location Selection */}
        <View style={styles.locationSection}>
          <ThemedText style={styles.inputLabel}>Location</ThemedText>
          <ThemedText style={styles.locationSubtitle}>
            {selectedLocation 
              ? `Selected: ${selectedLocation.latitude.toFixed(6)}°, ${selectedLocation.longitude.toFixed(6)}°`
              : 'Use current location or select on map'
            }
          </ThemedText>
          
          <View style={styles.locationButtons}>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={() => {
                if (currentLocation) {
                  setSelectedLocation(currentLocation);
                } else {
                  Alert.alert('Location Error', 'Current location not available. Please select on map.');
                }
              }}
            >
              <IconSymbol name="location.fill" size={16} color="#2E7D32" />
              <ThemedText style={styles.locationButtonText}>Use Current</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.locationButton, showMap && styles.locationButtonActive]}
              onPress={() => setShowMap(!showMap)}
            >
              <IconSymbol name="map.fill" size={16} color={showMap ? "#fff" : "#666"} />
              <ThemedText style={[styles.locationButtonText, showMap && styles.locationButtonTextActive]}>
                {showMap ? 'Hide Map' : 'Select on Map'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Map for location selection */}
          {showMap && (
            <View style={styles.mapContainer}>
              <MapViewComponent
                initialRegion={selectedLocation ? {
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                } : {
                  latitude: -1.2921,
                  longitude: 35.5739,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                markers={selectedLocation ? [{
                  id: 'selected',
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  title: 'Selected Location',
                  description: 'Tap to confirm this location',
                  type: 'ranger'
                }] : []}
                onMapPress={(coordinate) => {
                  setSelectedLocation(coordinate);
                }}
                mode="select"
                showUserLocation={true}
              />
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>
            <IconSymbol name="camera.fill" size={16} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add Location</ThemedText>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  titleBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 28,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  categorySection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    gap: 8,
    minWidth: '45%',
    justifyContent: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: '#2E7D32',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  inputSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#000',
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 14,
    color: '#000',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  photoSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    position: 'relative',
    width: '30%',
    aspectRatio: 1,
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  photoText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  addPhotoText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  locationSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  locationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    gap: 8,
  },
  locationButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  locationButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationButtonTextActive: {
    color: '#fff',
  },
  mapContainer: {
    height: height * 0.3, // 30% of screen height
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
