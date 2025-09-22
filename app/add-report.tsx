import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePark } from '@/contexts/ParkContext';
import { supabase } from '@/lib/supabase';
import { locationService } from '@/services/locationService';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddReportScreen() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Open');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Get selected park from context
  const { selectedPark } = usePark();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [touristsAffected, setTouristsAffected] = useState('');
  const [tourOperator, setTourOperator] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [transport, setTransport] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [tags, setTags] = useState('');
  const [photos, setPhotos] = useState<{ uri: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Load current GPS on mount
  useState(() => {
    (async () => {
      const loc = await locationService.getCurrentLocation();
      if (loc) setCurrentLocation(loc);
    })();
  });

  const categories = [
    'Tourists',
    'Medical',
    'Security',
    'Infrastructure',
    'Wildlife',
    'Vehicle',
    'Environmental'
  ];

  const severityLevels = [
    'Critical',
    'High',
    'Medium',
    'Low'
  ];

  const statusOptions = [
    'Open',
    'In Progress',
    'Resolved',
    'Escalated'
  ];

  const handleBack = () => {
    router.push('/(tabs)/reports');
  };

  const handleAddPhoto = async () => {
    if (photos.length >= 3) {
      Alert.alert('Photo Limit', 'You can only add up to 3 photos.');
      return;
    }

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to add photos.');
      return;
    }

    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo:',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const photoName = `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
      setPhotos([...photos, { uri: asset.uri, name: photoName }]);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const photoName = `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
      setPhotos([...photos, { uri: asset.uri, name: photoName }]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const uploadPhotosToSupabase = async (photos: { uri: string; name: string }[]) => {
    if (photos.length === 0) return [];

    setIsUploadingPhotos(true);
    const uploadedUrls: string[] = [];

    try {
      for (const photo of photos) {
        const response = await fetch(photo.uri);
        const contentType = response.headers.get('Content-Type') || 'image/jpeg';
        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        const extMatch = photo.name.match(/\.([a-zA-Z0-9]+)$/);
        const ext = (extMatch ? extMatch[1] : (contentType.split('/')?.[1] || 'jpg')).toLowerCase();
        const objectPath = `incidents/${Date.now()}_${photo.name.replace(/[^a-zA-Z0-9_.-]/g, '')}.${ext}`;

        const { data, error } = await supabase.storage
          .from('incident-photos')
          .upload(objectPath, bytes, { contentType, upsert: false });

        if (error) {
          console.error('Error uploading photo:', error);
          throw new Error(`Failed to upload ${photo.name}: ${error.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('incident-photos')
          .getPublicUrl(data.path);

        if (urlData?.publicUrl) uploadedUrls.push(urlData.publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw error;
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedCategory || !selectedSeverity || !title || !description) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        Alert.alert('Error', 'Please log in to submit a report.');
        setIsSubmitting(false);
        return;
      }

      // Upload photos to Supabase storage
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        try {
          photoUrls = await uploadPhotosToSupabase(photos);
        } catch (error) {
          Alert.alert('Photo Upload Error', 'Failed to upload photos. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Map UI selections to DB enums
      const statusMap: Record<string, 'Reported' | 'In Progress' | 'Resolved'> = {
        'Open': 'Reported',
        'In Progress': 'In Progress',
        'Resolved': 'Resolved',
        'Escalated': 'Reported'
      };
      const severityMap: Record<string, 'Critical' | 'High' | 'Medium' | 'Resolved'> = {
        'Critical': 'Critical',
        'High': 'High',
        'Medium': 'Medium',
        'Low': 'Medium'
      };

      // Coordinates formatting (matches DB constraint)
      const formatCoordinates = (lat: number, lon: number) => {
        const latAbs = Math.abs(lat).toFixed(6);
        const lonAbs = Math.abs(lon).toFixed(6);
        const latHem = lat >= 0 ? 'N' : 'S';
        const lonHem = lon >= 0 ? 'E' : 'W';
        return `${latAbs}° ${latHem}, ${lonAbs}° ${lonHem}`;
      };
      const coordinates: string | null = currentLocation
        ? formatCoordinates(currentLocation.latitude, currentLocation.longitude)
        : null;

      const parseIntOrNull = (v: string) => {
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : null;
      };

      const incidentInsert = {
        park_id: selectedPark?.id as string,
        reported_by: user.id,
        category: selectedCategory || 'Incident',
        title: title || selectedCategory || 'Incident',
        description,
        // Optional incident details
        tourists_affected: parseIntOrNull(touristsAffected),
        operator: tourOperator || null,
        transport: transport || null,
        medical_condition: medicalCondition || null,
        location: selectedPark?.name || null,
        coordinates: coordinates, // keep null to satisfy constraint
        severity: severityMap[selectedSeverity] ?? 'Medium',
        status: statusMap[selectedStatus] ?? 'Reported'
      };

      const { data, error } = await supabase
        .from('incidents')
        .insert(incidentInsert)
        .select()
        .single();

      if (error) {
        console.error('Error saving report:', error);
        Alert.alert('Error', `Failed to save report: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      // Clear form on success
      setSelectedCategory('');
      setSelectedSeverity('');
      setSelectedStatus('Open');
      setTitle('');
      setDescription('');
      setTouristsAffected('');
      setTourOperator('');
      setContactInfo('');
      setTransport('');
      setMedicalCondition('');
      setTags('');
      setPhotos([]);

      Alert.alert('Report Submitted', `Successfully submitted ${selectedCategory} incident report.`, [
        { text: 'OK', onPress: () => router.push('/(tabs)/reports') }
      ]);
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'An unexpected error occurred while submitting the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tourists': return 'person.2.fill';
      case 'Medical': return 'bolt.fill';
      case 'Security': return 'bell.fill';
      case 'Infrastructure': return 'exclamationmark.triangle.fill';
      case 'Wildlife': return 'pawprint.fill';
      case 'Vehicle': return 'car.fill';
      case 'Environmental': return 'leaf.fill';
      default: return 'exclamationmark.triangle.fill';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tourists': return '#ff6b6b';
      case 'Medical': return '#ff6b6b';
      case 'Security': return '#ff6b6b';
      case 'Infrastructure': return '#ff9500';
      case 'Wildlife': return '#ff9500';
      case 'Vehicle': return '#ffcc00';
      case 'Environmental': return '#4caf50';
      default: return '#666';
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
          <View style={styles.titleBarContent}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.titleBarLogo}
              resizeMode="contain"
            />
            <ThemedText style={styles.titleBarText}>Add Incident Report</ThemedText>
          </View>
          <View style={styles.placeholder} />
        </View>
        
        {/* Park Indicator */}
        {selectedPark && (
          <View style={styles.parkIndicator}>
            <IconSymbol name="location.fill" size={12} color="#2E7D32" />
            <ThemedText style={styles.parkIndicatorText}>Reporting for: {selectedPark.name}</ThemedText>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Report New Incident</ThemedText>
          <ThemedText style={styles.subtitle}>
            Document security, wildlife, or infrastructure incidents in {selectedPark?.name || 'the selected park'}
          </ThemedText>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Category *</ThemedText>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <View style={styles.dropdownContent}>
              {selectedCategory ? (
                <View style={styles.selectedOption}>
                  <IconSymbol 
                    name={getCategoryIcon(selectedCategory)} 
                    size={16} 
                    color={getCategoryColor(selectedCategory)} 
                  />
                  <ThemedText style={styles.dropdownText}>{selectedCategory}</ThemedText>
                </View>
              ) : (
                <ThemedText style={styles.placeholderText}>Select incident category</ThemedText>
              )}
            </View>
            <IconSymbol name="chevron.down" size={16} color="#666" />
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={styles.dropdown}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <View style={styles.optionContent}>
                    <IconSymbol 
                      name={getCategoryIcon(category)} 
                      size={16} 
                      color={getCategoryColor(category)} 
                    />
                    <ThemedText style={styles.optionText}>{category}</ThemedText>
                  </View>
                  {selectedCategory === category && (
                    <IconSymbol name="checkmark" size={16} color="#2E7D32" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Severity Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Severity *</ThemedText>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowSeverityDropdown(!showSeverityDropdown)}
          >
            <ThemedText style={styles.dropdownText}>
              {selectedSeverity || 'Select severity level'}
            </ThemedText>
            <IconSymbol name="chevron.down" size={16} color="#666" />
          </TouchableOpacity>
          
          {showSeverityDropdown && (
            <View style={styles.dropdown}>
              {severityLevels.map((severity) => (
                <TouchableOpacity
                  key={severity}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedSeverity(severity);
                    setShowSeverityDropdown(false);
                  }}
                >
                  <ThemedText style={styles.optionText}>{severity}</ThemedText>
                  {selectedSeverity === severity && (
                    <IconSymbol name="checkmark" size={16} color="#2E7D32" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Status Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Status</ThemedText>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <ThemedText style={styles.dropdownText}>
              {selectedStatus || 'Select status'}
            </ThemedText>
            <IconSymbol name="chevron.down" size={16} color="#666" />
          </TouchableOpacity>
          
          {showStatusDropdown && (
            <View style={styles.dropdown}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedStatus(status);
                    setShowStatusDropdown(false);
                  }}
                >
                  <ThemedText style={styles.optionText}>{status}</ThemedText>
                  {selectedStatus === status && (
                    <IconSymbol name="checkmark" size={16} color="#2E7D32" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Title *</ThemedText>
          <TextInput
            style={styles.textInput}
            placeholder="Brief description of the incident"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Description *</ThemedText>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            placeholder="Detailed description of what happened..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>


        {/* Tourist-related fields (conditional) */}
        {(selectedCategory === 'Tourists' || selectedCategory === 'Medical') && (
          <>
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Tourists Affected</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Number of tourists affected"
                value={touristsAffected}
                onChangeText={setTouristsAffected}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Tour Operator</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Tour operator or company name"
                value={tourOperator}
                onChangeText={setTourOperator}
              />
            </View>
            
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Phone number or email"
                value={contactInfo}
                onChangeText={setContactInfo}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Transport</ThemedText>
              <TextInput
                style={styles.textInput}
                placeholder="Type of transport (safari van, on foot, etc.)"
                value={transport}
                onChangeText={setTransport}
              />
            </View>
          </>
        )}

        {/* Medical condition (for Medical category) */}
        {selectedCategory === 'Medical' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Medical Condition</ThemedText>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Describe the medical condition or symptoms..."
              value={medicalCondition}
              onChangeText={setMedicalCondition}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Tags Input */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tags</ThemedText>
          <TextInput
            style={styles.textInput}
            placeholder="Comma-separated tags (e.g., stuck vehicle, rescue required)"
            value={tags}
            onChangeText={setTags}
          />
        </View>

        {/* Photo Upload Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Photos (Optional)</ThemedText>
          <ThemedText style={styles.photoSubtitle}>Add up to 3 photos to document the incident</ThemedText>
          
          <View style={styles.photoContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: photo.uri }} style={styles.photoImage} />
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

        {/* GPS Coordinates */}
        <View style={styles.gpsSection}>
          <View style={styles.gpsContainer}>
            <IconSymbol name="location.fill" size={16} color="#FF9800" />
            <ThemedText style={styles.gpsText}>GPS: -1.5053°, 35.1442° (Current Location)</ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleSubmitReport}
            disabled={isSubmitting}
          >
            <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#fff" />
            <ThemedText style={styles.submitButtonText}>
              {isSubmitting ? (isUploadingPhotos ? 'Uploading Photos...' : 'Submitting...') : 'Submit Report'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <ThemedText style={styles.loadingTextOverlay}>{isUploadingPhotos ? 'Uploading photos...' : 'Submitting report...'}</ThemedText>
        </View>
      )}
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  backButton: {
    padding: 4,
  },
  titleBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'center',
  },
  titleBarLogo: {
    width: 32,
    height: 32,
  },
  titleBarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 28,
  },
  parkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#e8f5e8',
    borderBottomWidth: 1,
    borderBottomColor: '#d4edda',
  },
  parkIndicatorText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  dropdownContent: {
    flex: 1,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
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
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
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
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
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
  gpsSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  gpsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    gap: 8,
  },
  gpsText: {
    fontSize: 14,
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    marginTop: 8,
    paddingBottom: 100,
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
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTextOverlay: {
    marginTop: 12,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
