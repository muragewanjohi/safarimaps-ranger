import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useIncidents } from '@/hooks/useIncidents';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All Incidents');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Load incidents from Supabase
  const { incidents, loading, error, refreshIncidents } = useIncidents();

  const filterOptions = [
    'All Incidents',
    'Visitor Emergencies',
    'Poaching Only',
    'Conflicts Only',
    'Infrastructure Only',
    'Injuries Only',
    'Open Cases',
    'In Progress'
  ];

  // Ensure incidents is always an array and not null/undefined
  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  
  // Don't render if incidents is not properly initialized
  if (!Array.isArray(incidents)) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <ThemedText style={styles.loadingText}>Initializing...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }
  
  // Calculate stats from incidents data
  const incidentStats = {
    critical: safeIncidents.filter(incident => incident.severity === 'Critical').length,
    high: safeIncidents.filter(incident => incident.severity === 'High').length,
    medium: safeIncidents.filter(incident => incident.severity === 'Medium').length,
    resolved: safeIncidents.filter(incident => incident.status === 'Resolved').length
  };

  const handleNewReport = () => {
    router.push('/add-report');
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowFilterDropdown(false);
  };

  const handleUpdateStatus = (incidentId: number) => {
    Alert.alert('Update Status', `Update status for incident ${incidentId} - Feature coming soon!`);
  };

  const handleAddNote = (incidentId: number) => {
    Alert.alert('Add Note', `Add note for incident ${incidentId} - Feature coming soon!`);
  };

  const handleEscalate = (incidentId: number) => {
    Alert.alert('Escalate', `Escalate incident ${incidentId} - Feature coming soon!`);
  };

  const handleRouteInfo = (incidentId: number) => {
    Alert.alert('Route Info', `Show route information for incident ${incidentId} - Feature coming soon!`);
  };

  // Show loading state
  if (loading || !Array.isArray(incidents)) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <ThemedText style={styles.loadingText}>Loading incidents...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#ff6b6b" />
          <ThemedText style={styles.errorTitle}>Failed to Load Incidents</ThemedText>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={refreshIncidents}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <View style={styles.titleRow}>
              <ThemedText style={styles.title}>Incident Reports</ThemedText>
              <TouchableOpacity style={styles.notificationBell}>
                <IconSymbol name="bell.fill" size={20} color="#ff6b6b" />
                <View style={styles.notificationBadge}>
                  <ThemedText style={styles.notificationBadgeText}>3</ThemedText>
                </View>
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.subtitle}>
              Security, wildlife, and infrastructure incidents in Masai Mara National Reserve
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.newReportButton} onPress={handleNewReport}>
            <IconSymbol name="plus" size={16} color="#fff" />
            <ThemedText style={styles.newReportText}>New Report</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Filter and Summary Bar */}
        <View style={styles.filterBar}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <IconSymbol name="doc.text.fill" size={16} color="#666" />
            <ThemedText style={styles.filterText}>{selectedFilter}</ThemedText>
            <IconSymbol name="chevron.down" size={14} color="#666" />
          </TouchableOpacity>
          
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <ThemedText style={[styles.summaryNumber, { color: '#ff6b6b' }]}>{incidentStats.critical}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Critical</ThemedText>
            </View>
            <View style={styles.summaryCard}>
              <ThemedText style={[styles.summaryNumber, { color: '#ff9500' }]}>{incidentStats.high}</ThemedText>
              <ThemedText style={styles.summaryLabel}>High</ThemedText>
            </View>
            <View style={styles.summaryCard}>
              <ThemedText style={[styles.summaryNumber, { color: '#ffcc00' }]}>{incidentStats.medium}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Medium</ThemedText>
            </View>
            <View style={styles.summaryCard}>
              <ThemedText style={[styles.summaryNumber, { color: '#4caf50' }]}>{incidentStats.resolved}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Resolved</ThemedText>
            </View>
          </View>
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

        {/* Incidents List */}
        <View style={styles.incidentsSection}>
          {safeIncidents.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="exclamationmark.triangle" size={48} color="#ccc" />
              <ThemedText style={styles.emptyStateTitle}>No Incidents Found</ThemedText>
              <ThemedText style={styles.emptyStateText}>
                No incidents match your current filter. Try adjusting your filter or check back later.
              </ThemedText>
            </View>
          ) : (
            safeIncidents.map((incident) => {
              // Ensure tags and photos are always arrays
              const safeTags = Array.isArray(incident.tags) ? incident.tags : [];
              const safePhotos = Array.isArray(incident.photos) ? incident.photos : [];
              
              return (
                <View key={incident.id} style={styles.incidentCard}>
                {/* SOS Badge and Title */}
                <View style={styles.incidentHeader}>
                  <View style={styles.sosBadge}>
                    <ThemedText style={styles.sosText}>SOS</ThemedText>
                  </View>
                  <View style={styles.incidentTitleContainer}>
                    <ThemedText style={styles.incidentTitle}>{incident.title}</ThemedText>
                    <View style={styles.incidentTags}>
                      <View style={[
                        styles.severityBadge, 
                        incident.severity === 'Critical' ? styles.criticalBadge : 
                          incident.severity === 'High' ? styles.highBadge : 
                          incident.severity === 'Medium' ? styles.mediumBadge : styles.lowBadge
                      ]}>
                        <ThemedText style={styles.severityText}>{incident.severity}</ThemedText>
                      </View>
                      <View style={[
                        styles.statusBadge,
                          incident.status === 'In Progress' ? styles.inProgressBadge : 
                          incident.status === 'Resolved' ? styles.resolvedBadge : styles.openBadge
                      ]}>
                        <ThemedText style={styles.statusText}>{incident.status}</ThemedText>
                      </View>
                      {safeTags.map((tag, index) => (
                        <View key={index} style={styles.tagBadge}>
                          <ThemedText style={styles.tagText}>{tag}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Description */}
                <ThemedText style={styles.incidentDescription}>{incident.description}</ThemedText>

                {/* Key Details Section */}
                {(incident.tourists_affected || incident.tour_operator || incident.transport || incident.contact_info || incident.medical_condition) && (
                  <View style={styles.keyDetailsSection}>
                    {incident.tourists_affected && (
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Tourists Affected:</ThemedText>
                        <View style={styles.detailBadges}>
                          <View style={styles.affectedBadge}>
                            <ThemedText style={styles.affectedText}>{incident.tourists_affected} people</ThemedText>
                          </View>
                          <View style={styles.rescueBadge}>
                            <IconSymbol name="person.2.fill" size={12} color="#fff" />
                            <ThemedText style={styles.rescueText}>Rescue Required</ThemedText>
                          </View>
                        </View>
                      </View>
                    )}
                    
                    {incident.tour_operator && (
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Tour Operator:</ThemedText>
                        <ThemedText style={styles.detailValue}>{incident.tour_operator}</ThemedText>
                      </View>
                    )}
                    
                    {incident.transport && (
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Transport:</ThemedText>
                        <ThemedText style={styles.detailValue}>{incident.transport}</ThemedText>
                      </View>
                    )}
                    
                    {incident.contact_info && (
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Contact Info:</ThemedText>
                        <ThemedText style={styles.detailValue}>{incident.contact_info}</ThemedText>
                      </View>
                    )}
                    
                    {incident.medical_condition && (
                      <View style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Medical Condition:</ThemedText>
                        <ThemedText style={styles.detailValue}>{incident.medical_condition}</ThemedText>
                      </View>
                    )}
                  </View>
                )}

                {/* Photos Section */}
                {safePhotos.length > 0 && (
                  <View style={styles.photosSection}>
                    <ThemedText style={styles.photosTitle}>Photos ({safePhotos.length})</ThemedText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScrollView}>
                      {safePhotos.map((photoUrl, index) => (
                        <Image key={index} source={{ uri: photoUrl }} style={styles.incidentPhoto} />
                      ))}
                    </ScrollView>
                </View>
              )}

                {/* Metadata */}
                <View style={styles.incidentMetadata}>
                  <View style={styles.metadataItem}>
                    <IconSymbol name="location.fill" size={12} color="#666" />
                    <ThemedText style={styles.metadataText}>{incident.coordinates}</ThemedText>
                  </View>
                  <View style={styles.metadataItem}>
                    <IconSymbol name="clock.fill" size={12} color="#666" />
                    <ThemedText style={styles.metadataText}>
                      {new Date(incident.created_at).toLocaleString()}
                    </ThemedText>
                  </View>
                  <View style={styles.metadataItem}>
                    <IconSymbol name="person.fill" size={12} color="#666" />
                    <ThemedText style={styles.metadataText}>
                      by {incident.reported_by_name}
                    </ThemedText>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleUpdateStatus(incident.id)}
                  >
                    <ThemedText style={styles.actionButtonText}>Update Status</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleAddNote(incident.id)}
                  >
                    <ThemedText style={styles.actionButtonText}>Add Note</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.escalateButton]}
                    onPress={() => handleEscalate(incident.id)}
                  >
                    <ThemedText style={styles.escalateButtonText}>Escalate</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
              );
            })
          )}
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
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  titleBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  titleBarLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 6,
  },
  titleBarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationBell: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  newReportButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  newReportText: {
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
  summaryCards: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 10,
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
  incidentsSection: {
    padding: 20,
    paddingBottom: 100,
  },
  incidentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sosBadge: {
    backgroundColor: '#ff6b6b',
    width: 32,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sosText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  incidentTitleContainer: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  incidentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  criticalBadge: {
    backgroundColor: '#ff6b6b',
  },
  highBadge: {
    backgroundColor: '#ff9500',
  },
  mediumBadge: {
    backgroundColor: '#ffcc00',
  },
  severityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inProgressBadge: {
    backgroundColor: '#000',
  },
  openBadge: {
    backgroundColor: '#ff6b6b',
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  tagBadge: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  incidentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  keyDetailsSection: {
    backgroundColor: '#fce4ec',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    marginRight: 8,
    minWidth: 100,
  },
  detailValue: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  detailBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  affectedBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  affectedText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  rescueBadge: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rescueText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  severityLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  criticalLevelBadge: {
    backgroundColor: '#ff6b6b',
  },
  majorLevelBadge: {
    backgroundColor: '#000',
  },
  severityLevelText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  accessBadge: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accessText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  incidentMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metadataText: {
    fontSize: 11,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  escalateButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  escalateButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
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
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  lowBadge: {
    backgroundColor: '#4caf50',
  },
  resolvedBadge: {
    backgroundColor: '#4caf50',
  },
  photosSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  photosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  photosScrollView: {
    flexDirection: 'row',
  },
  incidentPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
});
