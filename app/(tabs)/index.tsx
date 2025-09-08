import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  useDashboardStats,
  useEmergencyAlerts,
  useParkData,
  useRangerData,
  useRecentIncidents,
  useRecentLocations
} from '@/hooks/useDataService';
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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isOffline] = useState(false); // Mock offline state
  const [pressedCard, setPressedCard] = useState<string | null>(null);
  const [pendingSyncItems] = useState(2); // Mock pending sync items
  
  // Use data service hooks
  const { data: rangerData, loading: rangerLoading, error: rangerError } = useRangerData();
  const { data: parkData, loading: parkLoading, error: parkError } = useParkData();
  const { data: dashboardStats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { data: emergencyAlerts, loading: alertsLoading, error: alertsError } = useEmergencyAlerts();
  const { data: recentIncidents, loading: incidentsLoading, error: incidentsError } = useRecentIncidents();
  const { data: recentLocations, loading: locationsLoading, error: locationsError } = useRecentLocations();

  // Show loading state if any critical data is loading
  const isLoading = rangerLoading || parkLoading || statsLoading;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Report Incident':
        // Navigate to reports screen for incident reporting
        router.push('/(tabs)/reports');
        break;
      case 'Update Location':
        // Navigate to add-location screen for location updates
        router.push('/(tabs)/add-location');
        break;
      case 'Track Assets':
        // Navigate to explore screen to view tracked assets
        router.push('/(tabs)/explore');
        break;
      case 'Emergency Alert':
        // Show emergency alert options
        Alert.alert(
          'Emergency Alert',
          'Choose emergency type:',
          [
            { text: 'Wildlife Emergency', onPress: () => handleEmergencyAlert('Wildlife') },
            { text: 'Visitor Emergency', onPress: () => handleEmergencyAlert('Visitor') },
            { text: 'Security Alert', onPress: () => handleEmergencyAlert('Security') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        break;
      case 'Add Attraction':
        // Navigate to add-location with attraction pre-selected
        router.push('/(tabs)/add-location');
        break;
      case 'Add Accommodation':
        // Navigate to add-location with accommodation pre-selected
        router.push('/(tabs)/add-location');
        break;
      default:
        Alert.alert('Quick Action', `${action} feature coming soon!`);
    }
  };

  const handleEmergencyAlert = (type: string) => {
    Alert.alert(
      'Emergency Alert Sent',
      `${type} emergency alert has been sent to all rangers and emergency services.`,
      [
        { text: 'OK', onPress: () => console.log(`Emergency alert sent: ${type}`) }
      ]
    );
  };

  const handleEmergencyAction = (action: string) => {
    Alert.alert(
      'Emergency Response',
      `${action} - Emergency response initiated. All nearby rangers have been notified.`,
      [
        { text: 'OK', onPress: () => console.log(`Emergency response: ${action}`) }
      ]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <ThemedText style={styles.loadingText}>Loading dashboard...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if critical data failed to load
  if (rangerError || parkError || statsError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#ff6b6b" />
          <ThemedText style={styles.errorTitle}>Failed to Load Data</ThemedText>
          <ThemedText style={styles.errorText}>
            {rangerError || parkError || statsError}
          </ThemedText>
          <TouchableOpacity style={styles.retryButton}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Early return if data is not available
  if (!rangerData || !parkData || !dashboardStats) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
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

        {/* Offline Status Banner */}
        {isOffline && (
          <View style={styles.offlineBanner}>
            <IconSymbol name="wifi.slash" size={16} color="#fff" />
            <ThemedText style={styles.offlineText}>
              You are offline - {pendingSyncItems} items waiting to sync
            </ThemedText>
          </View>
        )}

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
            <TouchableOpacity 
              style={styles.parkDropdown}
              onPress={() => {
                Alert.alert(
                  'Park Selection',
                  'Choose a different park:',
                  [
                    { text: 'Masai Mara National Reserve', onPress: () => console.log('Park switched to Masai Mara') },
                    { text: 'Amboseli National Park', onPress: () => console.log('Park switched to Amboseli') },
                    { text: 'Tsavo National Park', onPress: () => console.log('Park switched to Tsavo') },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }}
            >
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
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => router.push('/(tabs)/reports')}
            >
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#ff6b6b" />
              <ThemedText style={styles.statNumber}>{dashboardStats.activeIncidents}</ThemedText>
              <ThemedText style={styles.statLabel}>Active Incidents</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <IconSymbol name="location.fill" size={24} color="#ff9500" />
              <ThemedText style={styles.statNumber}>{dashboardStats.wildlifeTracked}</ThemedText>
              <ThemedText style={styles.statLabel}>Wildlife Tracked</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <IconSymbol name="eye.fill" size={24} color="#ffcc00" />
              <ThemedText style={styles.statNumber}>{dashboardStats.touristLocations}</ThemedText>
              <ThemedText style={styles.statLabel}>Tourist Locations</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => {
                Alert.alert(
                  'Active Rangers',
                  `Currently ${dashboardStats.rangersActive} rangers are active in the field.`,
                  [{ text: 'OK' }]
                );
              }}
            >
              <IconSymbol name="person.2.fill" size={24} color="#34c759" />
              <ThemedText style={styles.statNumber}>{dashboardStats.rangersActive}</ThemedText>
              <ThemedText style={styles.statLabel}>Rangers Active</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <IconSymbol name="building.2.fill" size={24} color="#32d74b" />
              <ThemedText style={styles.statNumber}>{dashboardStats.hotelsLodges}</ThemedText>
              <ThemedText style={styles.statLabel}>Hotels & Lodges</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => router.push('/(tabs)/reports')}
            >
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
          
          {emergencyAlerts?.map((alert) => (
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
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/reports')}
            >
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.recentIncidentsSubtitle}>
            Latest security and wildlife alerts in {parkData.name}
          </ThemedText>
          
          {recentIncidents?.map((incident) => (
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
            <TouchableOpacity 
              style={styles.viewMapButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <ThemedText style={styles.viewMapText}>View Map</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.recentLocationsSubtitle}>
            Latest wildlife sightings and points of interest in {parkData.name}
        </ThemedText>
          
          {recentLocations?.map((location) => (
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

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          Alert.alert(
            'Quick Actions',
            'Choose an action:',
            [
              { text: 'Add Location', onPress: () => router.push('/(tabs)/add-location') },
              { text: 'Report Incident', onPress: () => router.push('/(tabs)/reports') },
              { text: 'View Map', onPress: () => router.push('/(tabs)/explore') },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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
  offlineBanner: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  offlineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'column',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    letterSpacing: 0.3,
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
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  parkDetailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    letterSpacing: 0.3,
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
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
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
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#fff',
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
});
