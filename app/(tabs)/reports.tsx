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

export default function ReportsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All Incidents');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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

  const incidentStats = {
    critical: 3,
    high: 7,
    medium: 12,
    resolved: 8
  };

  const incidents = [
    {
      id: 1,
      title: 'Tour Van Stuck in Mud - 8 Tourists',
      category: 'Tourists',
      description: 'Safari tour van with 8 German tourists got stuck in deep mud after heavy rains. Vehicle unable to move, tourists getting anxious.',
      severity: 'High',
      status: 'Open',
      tags: ['Stuck Vehicle', '8 tourists'],
      touristsAffected: 8,
      tourOperator: 'Adventure Safari Tours',
      transport: 'safari van',
      contactInfo: '+49-89-123-4567 (Tour Leader: Hans Mueller)',
      location: 'Swamp Trail Junction',
      dateTime: '2024-01-20 17:45',
      reportedBy: 'Sarah Johnson',
      hasPhotos: true,
      icon: 'exclamationmark.triangle.fill',
      iconColor: '#ff6b6b'
    },
    {
      id: 2,
      title: 'Missing Tourist Family - Lost on Trail',
      category: 'Tourists',
      description: 'Family of 4 (2 adults, 2 children aged 8 and 12) failed to return from guided nature walk. Last seen 3 hours ago heading toward waterfall.',
      severity: 'Critical',
      status: 'In Progress',
      tags: ['Lost Tourists', '4 tourists'],
      touristsAffected: 4,
      tourOperator: 'Nature Walks Kenya',
      transport: 'on foot',
      contactInfo: 'johnsmith@email.com +1-555-123-4567',
      lastSeen: '2024-01-20 14:30',
      location: 'Elephant Valley Trail',
      dateTime: '2024-01-20 17:30',
      reportedBy: 'Ranger Smith',
      hasPhotos: false,
      icon: 'person.2.fill',
      iconColor: '#ff6b6b'
    },
    {
      id: 3,
      title: 'Medical Emergency - Heart Attack',
      category: 'Medical',
      description: 'Elderly tourist (male, 68) collapsed with suspected heart attack. First aid administered, helicopter evacuation requested.',
      severity: 'Critical',
      status: 'In Progress',
      tags: ['Medical Emergency'],
      touristsAffected: 1,
      transport: 'on foot',
      medicalCondition: 'Suspected myocardial infarction, conscious but chest pain',
      location: 'Lion Rock Viewpoint',
      dateTime: '2024-01-20 16:15',
      reportedBy: 'Ranger Wilson',
      hasPhotos: false,
      icon: 'bolt.fill',
      iconColor: '#ff6b6b'
    },
    {
      id: 4,
      title: 'Poaching Alert',
      category: 'Security',
      description: 'Suspicious vehicle spotted near rhino sanctuary. Multiple individuals with hunting equipment observed.',
      severity: 'Critical',
      status: 'In Progress',
      tags: ['Poaching'],
      location: 'Sector A-12',
      dateTime: '2024-01-20 16:30',
      reportedBy: 'Sarah Johnson',
      hasPhotos: true,
      icon: 'bell.fill',
      iconColor: '#ff6b6b'
    },
    {
      id: 5,
      title: 'Road Closure - Main Safari Route',
      category: 'Infrastructure',
      description: 'Heavy rains have caused road collapse. Large section of tarmac has sunk, making passage impossible for vehicles.',
      severity: 'High',
      status: 'Open',
      tags: ['Road Closure'],
      severityLevel: 'Major',
      access: 'No Access',
      repairTime: '3-5 days',
      alternativeRoute: 'Use Northern Loop Road via Gate B',
      location: 'Main Safari Route KM 15',
      dateTime: '2024-01-20 14:15',
      reportedBy: 'Ranger Smith',
      hasPhotos: true,
      icon: 'exclamationmark.triangle.fill',
      iconColor: '#ff9500'
    },
    {
      id: 6,
      title: 'Bridge Damage - Mara River Crossing',
      category: 'Infrastructure',
      description: 'Wooden planks on tourist viewing bridge are loose and unsafe. Risk of injury to visitors.',
      severity: 'Critical',
      status: 'In Progress',
      tags: ['Bridge Issue'],
      severityLevel: 'Critical',
      access: 'No Access',
      repairTime: '1-2 days',
      alternativeRoute: 'Direct visitors to Eastern Crossing Point',
      location: 'Mara River Bridge',
      dateTime: '2024-01-20 12:30',
      reportedBy: 'Sarah Johnson',
      hasPhotos: true,
      icon: 'exclamationmark.triangle.fill',
      iconColor: '#ff6b6b'
    },
    {
      id: 7,
      title: 'Human-Wildlife Conflict',
      category: 'Wildlife',
      description: 'Elephants have broken through village fence and are destroying crops. Community requesting immediate assistance.',
      severity: 'High',
      status: 'Open',
      tags: ['Wildlife Conflict'],
      location: 'Village Border East',
      dateTime: '2024-01-20 11:45',
      reportedBy: 'Ranger Wilson',
      hasPhotos: false,
      icon: 'bolt.fill',
      iconColor: '#ff9500'
    }
  ];

  const handleNewReport = () => {
    Alert.alert('New Report', 'Create new incident report feature coming soon!');
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
          {incidents.map((incident) => (
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
                      incident.severity === 'High' ? styles.highBadge : styles.mediumBadge
                    ]}>
                      <ThemedText style={styles.severityText}>{incident.severity}</ThemedText>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      incident.status === 'In Progress' ? styles.inProgressBadge : styles.openBadge
                    ]}>
                      <ThemedText style={styles.statusText}>{incident.status}</ThemedText>
                    </View>
                    {incident.tags.map((tag, index) => (
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
              {(incident.touristsAffected || incident.tourOperator || incident.transport || incident.contactInfo || incident.lastSeen || incident.medicalCondition) && (
                <View style={styles.keyDetailsSection}>
                  {incident.touristsAffected && (
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Tourists Affected:</ThemedText>
                      <View style={styles.detailBadges}>
                        <View style={styles.affectedBadge}>
                          <ThemedText style={styles.affectedText}>{incident.touristsAffected} people</ThemedText>
                        </View>
                        <View style={styles.rescueBadge}>
                          <IconSymbol name="person.2.fill" size={12} color="#fff" />
                          <ThemedText style={styles.rescueText}>Rescue Required</ThemedText>
                        </View>
                      </View>
                    </View>
                  )}
                  
                  {incident.tourOperator && (
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Tour Operator:</ThemedText>
                      <ThemedText style={styles.detailValue}>{incident.tourOperator}</ThemedText>
                    </View>
                  )}
                  
                  {incident.transport && (
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Transport:</ThemedText>
                      <ThemedText style={styles.detailValue}>{incident.transport}</ThemedText>
                    </View>
                  )}
                  
                  {incident.contactInfo && (
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Contact Info:</ThemedText>
                      <ThemedText style={styles.detailValue}>{incident.contactInfo}</ThemedText>
                    </View>
                  )}
                  
                  {incident.lastSeen && (
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Last Seen:</ThemedText>
                      <ThemedText style={styles.detailValue}>{incident.lastSeen}</ThemedText>
                    </View>
                  )}
                  
                  {incident.medicalCondition && (
                    <View style={styles.detailRow}>
                      <ThemedText style={styles.detailLabel}>Medical Condition:</ThemedText>
                      <ThemedText style={styles.detailValue}>{incident.medicalCondition}</ThemedText>
                    </View>
                  )}
                  
                  {(incident.severityLevel || incident.access || incident.repairTime || incident.alternativeRoute) && (
                    <>
                      {incident.severityLevel && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Severity:</ThemedText>
                          <View style={[
                            styles.severityLevelBadge,
                            incident.severityLevel === 'Critical' ? styles.criticalLevelBadge : styles.majorLevelBadge
                          ]}>
                            <ThemedText style={styles.severityLevelText}>{incident.severityLevel}</ThemedText>
                          </View>
                        </View>
                      )}
                      
                      {incident.access && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Access:</ThemedText>
                          <View style={styles.accessBadge}>
                            <ThemedText style={styles.accessText}>{incident.access}</ThemedText>
                          </View>
                        </View>
                      )}
                      
                      {incident.repairTime && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Est. Repair Time:</ThemedText>
                          <ThemedText style={styles.detailValue}>{incident.repairTime}</ThemedText>
                        </View>
                      )}
                      
                      {incident.alternativeRoute && (
                        <View style={styles.detailRow}>
                          <ThemedText style={styles.detailLabel}>Alternative Route:</ThemedText>
                          <ThemedText style={styles.detailValue}>{incident.alternativeRoute}</ThemedText>
                        </View>
                      )}
                    </>
                  )}
                </View>
              )}

              {/* Metadata */}
              <View style={styles.incidentMetadata}>
                <View style={styles.metadataItem}>
                  <IconSymbol name="location.fill" size={12} color="#666" />
                  <ThemedText style={styles.metadataText}>{incident.location}</ThemedText>
                </View>
                <View style={styles.metadataItem}>
                  <IconSymbol name="clock.fill" size={12} color="#666" />
                  <ThemedText style={styles.metadataText}>{incident.dateTime}</ThemedText>
                </View>
                <View style={styles.metadataItem}>
                  <IconSymbol name="camera.fill" size={12} color="#666" />
                  <ThemedText style={styles.metadataText}>
                    {incident.hasPhotos ? 'Photos' : 'No Photos'} by {incident.reportedBy}
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
                {incident.category === 'Infrastructure' && incident.alternativeRoute && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleRouteInfo(incident.id)}
                  >
                    <IconSymbol name="location.fill" size={14} color="#000" />
                    <ThemedText style={styles.actionButtonText}>Route Info</ThemedText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.actionButton, styles.escalateButton]}
                  onPress={() => handleEscalate(incident.id)}
                >
                  <ThemedText style={styles.escalateButtonText}>Escalate</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
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
});
