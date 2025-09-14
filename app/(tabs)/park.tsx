import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { usePark } from '@/contexts/ParkContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useParkDetails, useParkEntries } from '@/hooks/useParkData';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ParkEntry {
  id: string;
  name: string;
  entry_type: 'Entry' | 'Exit' | 'Both';
  status: 'Primary' | 'Secondary' | 'Emergency';
  coordinates: string;
  description?: string;
  operating_hours?: string;
  facilities?: string[];
  capacity?: number;
  is_accessible: boolean;
  contact_info?: any;
}

export default function ParkScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { selectedPark, setSelectedPark, availableParks, isLoading: parkLoading, error: parkContextError } = usePark();
  
  // Use hooks for data management
  const { park, loading: parkDetailsLoading, error: parkDetailsError, updatePark } = useParkDetails(selectedPark?.id || '');
  const { entries: parkEntries, loading: entriesLoading, error: entriesError, createEntry, updateEntry, deleteEntry } = useParkEntries(selectedPark?.id || '');
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ParkEntry | null>(null);

  // Form state for editing park details
  const [parkForm, setParkForm] = useState({
    name: '',
    description: '',
    location: '',
    established: '',
    area: '',
    size: '',
    coordinates: '',
    operating_hours: '',
    contact_info: {
      phone: '',
      email: '',
      website: ''
    },
    admission_fees: {
      adults: '',
      children: '',
      students: ''
    },
    rules_and_regulations: [] as string[],
    emergency_contacts: {
      ranger_station: '',
      emergency: '',
      medical: ''
    },
    photos: [] as string[]
  });

  // Form state for editing park entries
  const [entryForm, setEntryForm] = useState({
    name: '',
    entry_type: 'Entry' as 'Entry' | 'Exit',
    status: 'Secondary' as 'Primary' | 'Secondary' | 'Emergency',
    coordinates: '',
    description: '',
    facilities: [] as string[],
    is_accessible: true
  });

  useEffect(() => {
    if (park) {
      setParkForm({
        name: park.name || '',
        description: park.description || '',
        location: park.location || '',
        established: park.established || '',
        area: park.area || '',
        size: park.size || '',
        coordinates: park.coordinates || '',
        operating_hours: park.operating_hours || '',
        contact_info: {
          phone: park.contact_info?.phone || '',
          email: park.contact_info?.email || '',
          website: park.contact_info?.website || ''
        },
        admission_fees: {
          adults: park.admission_fees?.adults || '',
          children: park.admission_fees?.children || '',
          students: park.admission_fees?.students || ''
        },
        rules_and_regulations: park.rules_and_regulations || [],
        emergency_contacts: {
          ranger_station: park.emergency_contacts?.ranger_station || '',
          emergency: park.emergency_contacts?.emergency || '',
          medical: park.emergency_contacts?.medical || ''
        },
        photos: park.photos || []
      });
    }
  }, [park]);

  const handleSaveParkDetails = async () => {
    try {
      if (!park) return;
      
      await updatePark(parkForm);
      Alert.alert('Success', 'Park details updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving park details:', error);
      Alert.alert('Error', 'Failed to update park details');
    }
  };

  const handleSaveEntry = async () => {
    try {
      if (!selectedPark) return;
      
      const entryData = {
        park_id: selectedPark.id,
        name: entryForm.name,
        entry_type: entryForm.entry_type,
        status: entryForm.status,
        coordinates: entryForm.coordinates,
        description: entryForm.description,
        facilities: entryForm.facilities,
        is_accessible: entryForm.is_accessible
      };

      if (editingEntry) {
        await updateEntry(editingEntry.id, entryData);
      } else {
        await createEntry(entryData);
      }
      
      Alert.alert('Success', 'Park entry saved successfully!');
      setShowAddEntryModal(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving park entry:', error);
      Alert.alert('Error', 'Failed to save park entry');
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this park entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entryId);
              Alert.alert('Success', 'Park entry deleted successfully!');
            } catch (error) {
              console.error('Error deleting park entry:', error);
              Alert.alert('Error', 'Failed to delete park entry');
            }
          }
        }
      ]
    );
  };

  const openEditEntry = (entry: ParkEntry) => {
    setEditingEntry(entry);
    setEntryForm({
      name: entry.name,
      entry_type: entry.entry_type,
      status: entry.status,
      coordinates: entry.coordinates,
      description: entry.description || '',
      facilities: entry.facilities || [],
      is_accessible: entry.is_accessible
    });
    setShowAddEntryModal(true);
  };

  const openAddEntry = () => {
    setEditingEntry(null);
    setEntryForm({
      name: '',
      entry_type: 'Entry',
      status: 'Secondary',
      coordinates: '',
      description: '',
      facilities: [],
      is_accessible: true
    });
    setShowAddEntryModal(true);
  };

  // Photo handling functions
  const handleAddPhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        if (!park) return;
        
        try {
          const photoUrl = await parkService.addParkPhoto(park.id, result.assets[0].uri);
          setParkForm(prev => ({
            ...prev,
            photos: [...prev.photos, photoUrl]
          }));
          Alert.alert('Success', 'Photo added successfully!');
        } catch (error) {
          console.error('Error adding photo:', error);
          Alert.alert('Error', 'Failed to add photo');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    try {
      if (!park) return;
      
      await parkService.removeParkPhoto(park.id, photoUrl);
      setParkForm(prev => ({
        ...prev,
        photos: prev.photos.filter(url => url !== photoUrl)
      }));
      Alert.alert('Success', 'Photo removed successfully!');
    } catch (error) {
      console.error('Error removing photo:', error);
      Alert.alert('Error', 'Failed to remove photo');
    }
  };

  // Location capture function
  const handleCaptureLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is required to capture coordinates');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coordinates = parkService.formatCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      setEntryForm(prev => ({
        ...prev,
        coordinates: coordinates
      }));

      Alert.alert('Location Captured', `Coordinates: ${coordinates}`);
    } catch (error) {
      console.error('Error capturing location:', error);
      Alert.alert('Error', 'Failed to capture location');
    }
  };

  if (parkLoading || parkDetailsLoading || entriesLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <ThemedText style={styles.loadingText}>Loading park details...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (parkContextError || parkDetailsError || entriesError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#ff6b6b" />
          <ThemedText style={styles.errorTitle}>Error Loading Park</ThemedText>
          <ThemedText style={styles.errorText}>{parkContextError || parkDetailsError || entriesError}</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedPark || !park) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#ff6b6b" />
          <ThemedText style={styles.errorTitle}>No Park Selected</ThemedText>
          <ThemedText style={styles.errorText}>Please select a park to view details</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#666" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>Park Details</ThemedText>
            <ThemedText style={styles.headerSubtitle}>{park.name}</ThemedText>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <IconSymbol 
              name={isEditing ? "checkmark" : "pencil"} 
              size={20} 
              color={isEditing ? "#2E7D32" : "#666"} 
            />
          </TouchableOpacity>
        </View>

        {/* Park Information Card */}
        <View style={styles.parkCard}>
          <View style={styles.parkCardHeader}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.parkLogo}
              resizeMode="contain"
            />
            <View style={styles.parkInfo}>
              <ThemedText style={styles.parkName}>{park.name}</ThemedText>
              <ThemedText style={styles.parkLocation}>{park.location}</ThemedText>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Description</ThemedText>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={parkForm.description}
                onChangeText={(text) => setParkForm(prev => ({ ...prev, description: text }))}
                placeholder="Park description"
                multiline
                numberOfLines={3}
                editable={isEditing}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Established</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.established}
                  onChangeText={(text) => setParkForm(prev => ({ ...prev, established: text }))}
                  placeholder="Year established"
                  editable={isEditing}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Area</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.area}
                  onChangeText={(text) => setParkForm(prev => ({ ...prev, area: text }))}
                  placeholder="Park area"
                  editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Size (km²)</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.size}
                  onChangeText={(text) => setParkForm(prev => ({ ...prev, size: text }))}
                  placeholder="Park size in km²"
                  editable={isEditing}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Location</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.location}
                  onChangeText={(text) => setParkForm(prev => ({ ...prev, location: text }))}
                  placeholder="Park location"
                  editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Operating Hours</ThemedText>
              <TextInput
                style={styles.textInput}
                value={parkForm.operating_hours}
                onChangeText={(text) => setParkForm(prev => ({ ...prev, operating_hours: text }))}
                placeholder="Operating hours"
                editable={isEditing}
              />
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Phone</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.contact_info.phone}
                  onChangeText={(text) => setParkForm(prev => ({ 
                    ...prev, 
                    contact_info: { ...prev.contact_info, phone: text }
                  }))}
                  placeholder="Phone number"
                  editable={isEditing}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Email</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.contact_info.email}
                  onChangeText={(text) => setParkForm(prev => ({ 
                    ...prev, 
                    contact_info: { ...prev.contact_info, email: text }
                  }))}
                  placeholder="Email address"
                  editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Website</ThemedText>
              <TextInput
                style={styles.textInput}
                value={parkForm.contact_info.website}
                onChangeText={(text) => setParkForm(prev => ({ 
                  ...prev, 
                  contact_info: { ...prev.contact_info, website: text }
                }))}
                placeholder="Website URL"
                editable={isEditing}
              />
            </View>
          </View>

          {/* Admission Fees */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Admission Fees</ThemedText>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Adults</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.admission_fees.adults}
                  onChangeText={(text) => setParkForm(prev => ({ 
                    ...prev, 
                    admission_fees: { ...prev.admission_fees, adults: text }
                  }))}
                  placeholder="Adult fee"
                  editable={isEditing}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Children</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.admission_fees.children}
                  onChangeText={(text) => setParkForm(prev => ({ 
                    ...prev, 
                    admission_fees: { ...prev.admission_fees, children: text }
                  }))}
                  placeholder="Children fee"
                  editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Students</ThemedText>
              <TextInput
                style={styles.textInput}
                value={parkForm.admission_fees.students}
                onChangeText={(text) => setParkForm(prev => ({ 
                  ...prev, 
                  admission_fees: { ...prev.admission_fees, students: text }
                }))}
                placeholder="Student fee"
                editable={isEditing}
              />
            </View>
          </View>

          {/* Emergency Contacts */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Emergency Contacts</ThemedText>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Ranger Station</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.emergency_contacts.ranger_station}
                  onChangeText={(text) => setParkForm(prev => ({ 
                    ...prev, 
                    emergency_contacts: { ...prev.emergency_contacts, ranger_station: text }
                  }))}
                  placeholder="Ranger station contact"
                  editable={isEditing}
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Emergency</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={parkForm.emergency_contacts.emergency}
                  onChangeText={(text) => setParkForm(prev => ({ 
                    ...prev, 
                    emergency_contacts: { ...prev.emergency_contacts, emergency: text }
                  }))}
                  placeholder="Emergency contact"
                  editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Medical</ThemedText>
              <TextInput
                style={styles.textInput}
                value={parkForm.emergency_contacts.medical}
                onChangeText={(text) => setParkForm(prev => ({ 
                  ...prev, 
                  emergency_contacts: { ...prev.emergency_contacts, medical: text }
                }))}
                placeholder="Medical emergency contact"
                editable={isEditing}
              />
            </View>
          </View>

          {/* Park Photos Section */}
          <View style={styles.section}>
            <View style={styles.photosHeader}>
              <ThemedText style={styles.sectionTitle}>Park Photos</ThemedText>
              {isEditing && (
                <TouchableOpacity 
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                >
                  <IconSymbol name="camera.fill" size={16} color="#fff" />
                  <ThemedText style={styles.addPhotoText}>Add Photo</ThemedText>
                </TouchableOpacity>
              )}
            </View>
            
            {parkForm.photos.length > 0 ? (
              <View style={styles.photosGrid}>
                {parkForm.photos.map((photoUrl, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photoUrl }} style={styles.parkPhoto} />
                    {isEditing && (
                      <TouchableOpacity 
                        style={styles.removePhotoButton}
                        onPress={() => handleRemovePhoto(photoUrl)}
                      >
                        <IconSymbol name="xmark" size={12} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noPhotosContainer}>
                <IconSymbol name="photo" size={32} color="#ccc" />
                <ThemedText style={styles.noPhotosText}>No photos added yet</ThemedText>
              </View>
            )}
          </View>

          {/* Save Button */}
          {isEditing && (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveParkDetails}
              disabled={parkDetailsLoading}
            >
              <ThemedText style={styles.saveButtonText}>
                {parkDetailsLoading ? 'Saving...' : 'Save Changes'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Park Entries Section */}
        <View style={styles.entriesCard}>
          <View style={styles.entriesHeader}>
            <ThemedText style={styles.entriesTitle}>Park Entries & Exits</ThemedText>
            <View style={styles.entryButtonsContainer}>
              <TouchableOpacity 
                style={[styles.addEntryButton, styles.entryButton]}
                onPress={() => {
                  setEntryForm(prev => ({ ...prev, entry_type: 'Entry' }));
                  openAddEntry();
                }}
              >
                <IconSymbol name="arrow.right.circle.fill" size={16} color="#fff" />
                <ThemedText style={styles.addEntryText}>Add Entry</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.addEntryButton, styles.exitButton]}
                onPress={() => {
                  setEntryForm(prev => ({ ...prev, entry_type: 'Exit' }));
                  openAddEntry();
                }}
              >
                <IconSymbol name="arrow.left.circle.fill" size={16} color="#fff" />
                <ThemedText style={styles.addEntryText}>Add Exit</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {parkEntries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <ThemedText style={styles.entryName}>{entry.name}</ThemedText>
                  <View style={styles.entryBadges}>
                    <View style={[styles.entryBadge, entry.status === 'Primary' ? styles.primaryBadge : styles.secondaryBadge]}>
                      <ThemedText style={styles.entryBadgeText}>{entry.status}</ThemedText>
                    </View>
                    <View style={[styles.entryBadge, styles.typeBadge]}>
                      <ThemedText style={styles.entryBadgeText}>{entry.entry_type}</ThemedText>
                    </View>
                  </View>
                </View>
                <View style={styles.entryActions}>
                  <TouchableOpacity 
                    style={styles.editEntryButton}
                    onPress={() => openEditEntry(entry)}
                  >
                    <IconSymbol name="pencil" size={16} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteEntryButton}
                    onPress={() => handleDeleteEntry(entry.id)}
                  >
                    <IconSymbol name="trash" size={16} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <ThemedText style={styles.entryDescription}>{entry.description}</ThemedText>
              
              <View style={styles.entryDetails}>
                <View style={styles.entryDetail}>
                  <IconSymbol name="location.fill" size={12} color="#666" />
                  <ThemedText style={styles.entryDetailText}>{entry.coordinates}</ThemedText>
                </View>
                <View style={styles.entryDetail}>
                  <IconSymbol name="checkmark.circle.fill" size={12} color={entry.is_accessible ? "#4CAF50" : "#ff6b6b"} />
                  <ThemedText style={styles.entryDetailText}>
                    {entry.is_accessible ? 'Accessible' : 'Not Accessible'}
                  </ThemedText>
                </View>
              </View>

              {entry.facilities && entry.facilities.length > 0 && (
                <View style={styles.facilitiesContainer}>
                  {entry.facilities.map((facility, index) => (
                    <View key={index} style={styles.facilityTag}>
                      <ThemedText style={styles.facilityText}>{facility}</ThemedText>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add/Edit Entry Modal */}
      <Modal
        visible={showAddEntryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowAddEntryModal(false)}
            >
              <IconSymbol name="xmark" size={20} color="#666" />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>
              {editingEntry ? 'Edit Entry' : 'Add New Entry'}
            </ThemedText>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={handleSaveEntry}
              disabled={entriesLoading}
            >
              <ThemedText style={styles.modalSaveText}>
                {entriesLoading ? 'Saving...' : 'Save'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Entry Name</ThemedText>
              <TextInput
                style={styles.textInput}
                value={entryForm.name}
                onChangeText={(text) => setEntryForm(prev => ({ ...prev, name: text }))}
                placeholder="Entry point name"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Type</ThemedText>
                <TouchableOpacity style={styles.dropdownButton}>
                  <ThemedText style={styles.dropdownText}>{entryForm.entry_type}</ThemedText>
                  <IconSymbol name="chevron.down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Status</ThemedText>
                <TouchableOpacity style={styles.dropdownButton}>
                  <ThemedText style={styles.dropdownText}>{entryForm.status}</ThemedText>
                  <IconSymbol name="chevron.down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.coordinatesContainer}>
                <ThemedText style={styles.inputLabel}>Coordinates</ThemedText>
                <TouchableOpacity 
                  style={styles.captureLocationButton}
                  onPress={handleCaptureLocation}
                >
                  <IconSymbol name="location.fill" size={16} color="#fff" />
                  <ThemedText style={styles.captureLocationText}>Capture Location</ThemedText>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textInput}
                value={entryForm.coordinates}
                onChangeText={(text) => setEntryForm(prev => ({ ...prev, coordinates: text }))}
                placeholder="GPS coordinates will be captured automatically"
                editable={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Description</ThemedText>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={entryForm.description}
                onChangeText={(text) => setEntryForm(prev => ({ ...prev, description: text }))}
                placeholder="Entry description"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Accessible</ThemedText>
              <TouchableOpacity 
                style={[styles.toggleButton, entryForm.is_accessible && styles.toggleButtonActive]}
                onPress={() => setEntryForm(prev => ({ ...prev, is_accessible: !prev.is_accessible }))}
              >
                <ThemedText style={[styles.toggleText, entryForm.is_accessible && styles.toggleTextActive]}>
                  {entryForm.is_accessible ? 'Yes' : 'No'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  parkCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parkCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  parkLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  parkInfo: {
    flex: 1,
  },
  parkName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  parkLocation: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f8f8f8',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  entriesCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  entryButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  entryButton: {
    backgroundColor: '#2E7D32',
  },
  exitButton: {
    backgroundColor: '#ff6b6b',
  },
  addEntryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  photosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  addPhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  parkPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPhotosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noPhotosText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  captureLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  captureLocationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  entryCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  entryBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  entryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  primaryBadge: {
    backgroundColor: '#2E7D32',
  },
  secondaryBadge: {
    backgroundColor: '#666',
  },
  typeBadge: {
    backgroundColor: '#007aff',
  },
  entryBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editEntryButton: {
    padding: 8,
  },
  deleteEntryButton: {
    padding: 8,
  },
  entryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  entryDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  entryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  entryDetailText: {
    fontSize: 12,
    color: '#666',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  facilityTag: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  facilityText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  modalSaveButton: {
    padding: 8,
  },
  modalSaveText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
});
