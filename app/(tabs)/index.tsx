import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isOffline] = useState(false); // Mock offline state
  const [pressedCard, setPressedCard] = useState<string | null>(null);
  
  // Mock data - in real app this would come from API/state management
  const rangerData = {
    name: "Sarah Johnson",
    team: "Alpha Team",
    park: "Masai Mara National Reserve",
    role: "Senior Wildlife Ranger"
  };

  const parkData = {
    name: "Masai Mara National Reserve",
    description: "World-renowned safari destination in Kenya, famous for the Great Migration",
    location: "Narok County, Kenya",
    established: "1961",
    area: "1,510 km²",
    coordinates: "-1.5053°, 35.1442°"
  };

  const dashboardStats = {
    activeIncidents: 7,
    wildlifeTracked: 234,
    touristLocations: 42,
    rangersActive: 12,
    hotelsLodges: 8,
    reportsToday: 18
  };

  const emergencyAlerts = [
    {
      id: 1,
      type: "Tour Van Stuck",
      severity: "High",
      description: "8 Tourists",
      location: "Swamp Trail Junction",
      timeAgo: "15 min ago",
      status: "Active"
    },
    {
      id: 2,
      type: "Missing Family",
      severity: "Critical",
      description: "Lost on Trail",
      location: "Elephant Valley Trail",
      timeAgo: "25 min ago",
      status: "Active",
      urgent: true
    }
  ];

  const recentIncidents = [
    {
      id: 1,
      type: "Tour Van Stuck",
      description: "8 Tourists",
      location: "Swamp Trail Junction",
      timeAgo: "15 min ago",
      severity: "High",
      status: "Active"
    },
    {
      id: 2,
      type: "Missing Family",
      description: "Lost on Trail",
      location: "Elephant Valley Trail",
      timeAgo: "25 min ago",
      severity: "Critical",
      status: "Active"
    },
    {
      id: 3,
      type: "Road Closure",
      description: "Main Safari Route",
      location: "Main Safari Route KM",
      timeAgo: "30 min",
      severity: "High",
      status: "Active"
    }
  ];

  const recentLocations = [
    {
      id: 1,
      type: "African Elephant",
      count: "12",
      location: "Grid C-8",
      timeAgo: "1 hour ago",
      reportedBy: "Sarah Johnson"
    },
    {
      id: 2,
      type: "Baby Hippo Feeding Area",
      location: "Tourist Zone A",
      timeAgo: "2 hours ago",
      reportedBy: "Park Management"
    },
    {
      id: 3,
      type: "Black Rhino",
      count: "3",
      location: "Grid D-3",
      timeAgo: "3 hours ago",
      reportedBy: "Ranger Smith"
    },
    {
      id: 4,
      type: "Safari Lodge & Spa",
      location: "Accommodation Zone",
      timeAgo: "1 day ago",
      reportedBy: "Park Management"
    }
  ];

  const handleQuickAction = (action: string) => {
    Alert.alert('Quick Action', `${action} feature coming soon!`);
  };

  const handleEmergencyAction = (action: string) => {
    Alert.alert('Emergency Action', `${action} - Feature in development`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Bar */}
        <View style={styles.titleBar}>
          <ThemedText style={styles.titleBarText}>SafariMap GameWarden</ThemedText>
        </View>

        {/* Header Card - Ranger Profile and Park Selector */}
        <View style={styles.headerCard}>
          <View style={styles.rangerSection}>
            <ThemedText style={styles.rangerName}>{rangerData.name}</ThemedText>
            <View style={styles.rangerDetails}>
              <ThemedText style={styles.rangerRole}>{rangerData.role}</ThemedText>
              <View style={styles.teamBadge}>
                <ThemedText style={styles.teamText}>{rangerData.team}</ThemedText>
              </View>
            </View>
          </View>
          <View style={styles.parkSelector}>
            <ThemedText style={styles.currentParkLabel}>Current Park</ThemedText>
            <TouchableOpacity style={styles.parkDropdown}>
              <ThemedText style={styles.parkName}>{parkData.name}</ThemedText>
              <IconSymbol name="chevron.down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Park Details Card */}
        <View style={styles.parkDetailsCard}>
          <ThemedText style={styles.parkDetailsTitle}>{parkData.name}</ThemedText>
          <ThemedText style={styles.parkDescription}>{parkData.description}</ThemedText>
          <View style={styles.parkInfoGrid}>
            <View style={styles.parkInfoItem}>
              <IconSymbol name="location.fill" size={12} color="#666" />
              <ThemedText style={styles.parkInfoText}>{parkData.location}</ThemedText>
            </View>
            <View style={styles.parkInfoItem}>
              <ThemedText style={styles.parkInfoText}>Est. {parkData.established}</ThemedText>
            </View>
            <View style={styles.parkInfoItem}>
              <ThemedText style={styles.parkInfoText}>{parkData.area}</ThemedText>
            </View>
            <View style={styles.parkInfoItem}>
              <ThemedText style={styles.parkInfoText}>{parkData.coordinates}</ThemedText>
            </View>
          </View>
        </View>

        {/* Dashboard Stats - 6 Cards in 2x3 Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.statCard}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#ff6b6b" />
              <ThemedText style={styles.statNumber}>{dashboardStats.activeIncidents}</ThemedText>
              <ThemedText style={styles.statLabel}>Active Incidents</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statCard}>
              <IconSymbol name="location.fill" size={24} color="#ff9500" />
              <ThemedText style={styles.statNumber}>{dashboardStats.wildlifeTracked}</ThemedText>
              <ThemedText style={styles.statLabel}>Wildlife Tracked</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statCard}>
              <IconSymbol name="eye.fill" size={24} color="#ffcc00" />
              <ThemedText style={styles.statNumber}>{dashboardStats.touristLocations}</ThemedText>
              <ThemedText style={styles.statLabel}>Tourist Locations</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statCard}>
              <IconSymbol name="person.2.fill" size={24} color="#34c759" />
              <ThemedText style={styles.statNumber}>{dashboardStats.rangersActive}</ThemedText>
              <ThemedText style={styles.statLabel}>Rangers Active</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statCard}>
              <IconSymbol name="building.2.fill" size={24} color="#32d74b" />
              <ThemedText style={styles.statNumber}>{dashboardStats.hotelsLodges}</ThemedText>
              <ThemedText style={styles.statLabel}>Hotels & Lodges</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statCard}>
              <IconSymbol name="camera.fill" size={24} color="#ffcc00" />
              <ThemedText style={styles.statNumber}>{dashboardStats.reportsToday}</ThemedText>
              <ThemedText style={styles.statLabel}>Reports Today</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Visitor Emergencies Section */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyTitleContainer}>
              <View style={styles.sosIcon}>
                <ThemedText style={styles.sosText}>SOS</ThemedText>
              </View>
              <ThemedText style={styles.emergencyTitle}>Visitor Emergencies</ThemedText>
            </View>
            <View style={styles.emergencyBadge}>
              <ThemedText style={styles.emergencyBadgeText}>2 Active</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.emergencySubtitle}>
            Active tourist emergencies requiring immediate attention
          </ThemedText>
          
          {emergencyAlerts.map((alert) => (
            <View key={alert.id} style={styles.emergencyCard}>
              <View style={styles.emergencyCardHeader}>
                <ThemedText style={styles.emergencyCardTitle}>
                  {alert.type} - {alert.description}
                </ThemedText>
                <View style={styles.emergencyCardMeta}>
                  <View style={styles.emergencyCardLocation}>
                    <IconSymbol name="location.fill" size={12} color="#666" />
                    <ThemedText style={styles.emergencyLocationText}>{alert.location}</ThemedText>
                  </View>
                  <View style={styles.emergencyCardTime}>
                    <IconSymbol name="clock.fill" size={12} color="#666" />
                    <ThemedText style={styles.emergencyTimeText}>{alert.timeAgo}</ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.emergencyCardFooter}>
                <View style={styles.severityBadges}>
                  <View style={[styles.severityBadge, alert.severity === 'Critical' ? styles.criticalBadge : styles.highBadge]}>
                    <ThemedText style={styles.severityText}>{alert.severity}</ThemedText>
                  </View>
                  {alert.urgent && (
                    <View style={styles.urgentBadge}>
                      <ThemedText style={styles.urgentText}>URGENT</ThemedText>
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  style={[styles.respondButton, alert.severity === 'Critical' ? styles.criticalRespondButton : styles.highRespondButton]}
                  onPress={() => handleEmergencyAction('Respond')}
                >
                  <ThemedText style={styles.respondButtonText}>Respond</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Incidents Section */}
        <View style={styles.recentIncidentsSection}>
          <View style={styles.recentIncidentsHeader}>
            <ThemedText style={styles.recentIncidentsTitle}>Recent Incidents</ThemedText>
            <TouchableOpacity style={styles.viewAllButton}>
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.recentIncidentsSubtitle}>
            Latest security and wildlife alerts in {parkData.name}
          </ThemedText>
          
          {recentIncidents.map((incident) => (
            <View key={incident.id} style={styles.incidentCard}>
              <View style={styles.incidentCardHeader}>
                <ThemedText style={styles.incidentCardTitle}>
                  {incident.type} - {incident.description}
        </ThemedText>
                <View style={styles.incidentCardMeta}>
                  <View style={styles.incidentCardLocation}>
                    <IconSymbol name="location.fill" size={12} color="#666" />
                    <ThemedText style={styles.incidentLocationText}>{incident.location}</ThemedText>
                  </View>
                  <View style={styles.incidentCardTime}>
                    <IconSymbol name="clock.fill" size={12} color="#666" />
                    <ThemedText style={styles.incidentTimeText}>{incident.timeAgo}</ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.incidentCardFooter}>
                <View style={styles.incidentBadges}>
                  <View style={[styles.severityBadge, incident.severity === 'Critical' ? styles.criticalBadge : styles.highBadge]}>
                    <ThemedText style={styles.severityText}>{incident.severity}</ThemedText>
                  </View>
                  <View style={styles.statusBadge}>
                    <ThemedText style={styles.statusText}>{incident.status}</ThemedText>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Locations Section */}
        <View style={styles.recentLocationsSection}>
          <View style={styles.recentLocationsHeader}>
            <ThemedText style={styles.recentLocationsTitle}>Recent Locations</ThemedText>
            <TouchableOpacity style={styles.viewMapButton}>
              <ThemedText style={styles.viewMapText}>View Map</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.recentLocationsSubtitle}>
            Latest wildlife sightings and points of interest in {parkData.name}
        </ThemedText>
          
          {recentLocations.map((location) => (
            <View key={location.id} style={styles.locationCard}>
              <View style={styles.locationCardHeader}>
                <ThemedText style={styles.locationCardTitle}>{location.type}</ThemedText>
                {location.count && (
                  <ThemedText style={styles.locationCount}>Count: {location.count}</ThemedText>
                )}
              </View>
              <View style={styles.locationCardMeta}>
                <View style={styles.locationCardLocation}>
                  <IconSymbol name="location.fill" size={12} color="#666" />
                  <ThemedText style={styles.locationLocationText}>{location.location}</ThemedText>
                </View>
                <View style={styles.locationCardTime}>
                  <IconSymbol name="clock.fill" size={12} color="#666" />
                  <ThemedText style={styles.locationTimeText}>{location.timeAgo}</ThemedText>
                </View>
                <ThemedText style={styles.locationReportedBy}>by {location.reportedBy}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <ThemedText style={styles.quickActionsTitle}>Quick Actions</ThemedText>
          <ThemedText style={styles.quickActionsSubtitle}>
            Common ranger tasks for {parkData.name}
        </ThemedText>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[
                styles.quickActionCard,
                pressedCard === 'report' && styles.quickActionCardPressed
              ]}
              onPressIn={() => setPressedCard('report')}
              onPressOut={() => setPressedCard(null)}
              onPress={() => handleQuickAction('Report Incident')}
              activeOpacity={0.8}
            >
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#ff6b6b" />
              <ThemedText style={styles.quickActionLabel}>Report Incident</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionCard,
                pressedCard === 'location' && styles.quickActionCardPressed
              ]}
              onPressIn={() => setPressedCard('location')}
              onPressOut={() => setPressedCard(null)}
              onPress={() => handleQuickAction('Update Location')}
              activeOpacity={0.8}
            >
              <IconSymbol name="location.fill" size={24} color="#ff9500" />
              <ThemedText style={styles.quickActionLabel}>Update Location</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionCard,
                pressedCard === 'assets' && styles.quickActionCardPressed
              ]}
              onPressIn={() => setPressedCard('assets')}
              onPressOut={() => setPressedCard(null)}
              onPress={() => handleQuickAction('Track Assets')}
              activeOpacity={0.8}
            >
              <IconSymbol name="person.2.fill" size={24} color="#4ecdc4" />
              <ThemedText style={styles.quickActionLabel}>Track Assets</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionCard,
                pressedCard === 'emergency' && styles.quickActionCardPressed
              ]}
              onPressIn={() => setPressedCard('emergency')}
              onPressOut={() => setPressedCard(null)}
              onPress={() => handleQuickAction('Emergency Alert')}
              activeOpacity={0.8}
            >
              <IconSymbol name="bolt.fill" size={24} color="#007aff" />
              <ThemedText style={styles.quickActionLabel}>Emergency Alert</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionCard,
                pressedCard === 'attraction' && styles.quickActionCardPressed
              ]}
              onPressIn={() => setPressedCard('attraction')}
              onPressOut={() => setPressedCard(null)}
              onPress={() => handleQuickAction('Add Attraction')}
              activeOpacity={0.8}
            >
              <IconSymbol name="eye.fill" size={24} color="#ffcc00" />
              <ThemedText style={styles.quickActionLabel}>Add Attraction</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionCard,
                pressedCard === 'accommodation' && styles.quickActionCardPressed
              ]}
              onPressIn={() => setPressedCard('accommodation')}
              onPressOut={() => setPressedCard(null)}
              onPress={() => handleQuickAction('Add Accommodation')}
              activeOpacity={0.8}
            >
              <IconSymbol name="building.2.fill" size={24} color="#ff9500" />
              <ThemedText style={styles.quickActionLabel}>Add Accommodation</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  headerCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'column',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rangerSection: {
    width: '100%',
  },
  parkSelector: {
    width: '100%',
  },
  currentParkLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  parkDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parkName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rangerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  rangerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rangerRole: {
    fontSize: 12,
    color: '#666',
  },
  teamBadge: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  teamText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  parkDetailsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parkDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  parkDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  parkInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  parkInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: '45%',
  },
  parkInfoText: {
    fontSize: 12,
    color: '#666',
  },
  statsSection: {
    margin: 20,
    marginTop: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  emergencySection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emergencyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosIcon: {
    backgroundColor: '#ff6b6b',
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  emergencyBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emergencySubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  emergencyCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  emergencyCardHeader: {
    marginBottom: 8,
  },
  emergencyCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  emergencyCardMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  emergencyCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emergencyLocationText: {
    fontSize: 11,
    color: '#666',
  },
  emergencyCardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emergencyTimeText: {
    fontSize: 11,
    color: '#666',
  },
  emergencyCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  severityBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  criticalBadge: {
    backgroundColor: '#ff6b6b',
  },
  highBadge: {
    backgroundColor: '#000',
  },
  severityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  urgentBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  respondButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  criticalRespondButton: {
    backgroundColor: '#ff6b6b',
  },
  highRespondButton: {
    backgroundColor: '#000',
  },
  respondButtonText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  recentIncidentsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentIncidentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recentIncidentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllButton: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewAllText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  recentIncidentsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  incidentCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  incidentCardHeader: {
    marginBottom: 8,
  },
  incidentCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  incidentCardMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  incidentCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  incidentLocationText: {
    fontSize: 11,
    color: '#666',
  },
  incidentCardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  incidentTimeText: {
    fontSize: 11,
    color: '#666',
  },
  incidentCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  incidentBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  recentLocationsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentLocationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recentLocationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  viewMapButton: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewMapText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  recentLocationsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  locationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  locationCount: {
    fontSize: 12,
    color: '#666',
  },
  locationCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationLocationText: {
    fontSize: 11,
    color: '#666',
  },
  locationCardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationTimeText: {
    fontSize: 11,
    color: '#666',
  },
  locationReportedBy: {
    fontSize: 11,
    color: '#666',
  },
  quickActionsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    marginBottom: 100,
    borderRadius: 12,
    padding: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  quickActionsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
    color: '#000',
  },
  quickActionCardPressed: {
    backgroundColor: '#f0f0f0',
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
    elevation: 4,
  },
});
