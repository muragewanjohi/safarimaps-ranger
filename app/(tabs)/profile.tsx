import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { usePark } from '@/contexts/ParkContext';
import { dataService } from '@/services/dataService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActionSheetIOS,
    Alert,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { selectedPark, setSelectedPark, availableParks } = usePark();
  const insets = useSafeAreaInsets();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [stats, setStats] = useState<{ incidentsReported: number; wildlifeTracked: number; patrolsCompleted: number; daysActive: number }>({
    incidentsReported: 0,
    wildlifeTracked: 0,
    patrolsCompleted: 0,
    daysActive: 0,
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Current user profile
        const rangerResp = await dataService.getRangerData();
        if (!isMounted) return;
        if (rangerResp.success) {
          setProfile(rangerResp.data);
        } else {
          setError(rangerResp.error || 'Failed to load profile');
        }
        // Impact stats (reuse dashboard stats for now)
        const statsResp = await dataService.getDashboardStats(selectedPark?.id);
        if (!isMounted) return;
        if (statsResp.success) {
          setStats({
            incidentsReported: statsResp.data.reportsToday,
            wildlifeTracked: statsResp.data.wildlifeTracked,
            patrolsCompleted: statsResp.data.touristLocations,
            daysActive: 0,
          });
        }
      } catch (e) {
        if (isMounted) setError('Failed to load profile');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedPark?.id]);

  // Build user data from DB profile
  const userData = profile ? {
    name: profile.name,
    role: profile.role,
    rangerId: profile.rangerId || profile.ranger_id || 'N/A',
    team: profile.team || 'N/A',
    joinDate: profile.joinDate || profile.joinDate || profile.join_date || 'N/A',
    currentLocation: selectedPark?.name || 'N/A',
    avatar: (profile.name?.split(' ').map((s: string) => s[0]).join('') || 'RG').toUpperCase()
  } : {
    name: user?.name || 'Ranger',
    role: user?.role || 'Ranger',
    rangerId: user?.rangerId || 'N/A',
    team: user?.team || 'N/A',
    joinDate: user?.joinDate || 'N/A',
    currentLocation: selectedPark?.name || 'N/A',
    avatar: (user?.name?.split(' ').map((s: string) => s[0]).join('') || 'RG').toUpperCase()
  };

  const parkData = selectedPark ? {
    name: selectedPark.name,
    description: selectedPark.description,
    location: selectedPark.location,
    area: selectedPark.area,
    established: selectedPark.established
  } : {
    name: "No Park Selected",
    description: "Please select a park to view details",
    location: "N/A",
    area: "N/A",
    established: "N/A"
  };

  const impactStats = stats;

  const achievements = [
    {
      id: 1,
      title: "Wildlife Guardian",
      description: "500+ wildlife sightings logged",
      icon: "pawprint.fill",
      iconColor: "#666",
      badgeIcon: "star.fill",
      badgeColor: "#FFD700"
    },
    {
      id: 2,
      title: "Emergency Responder",
      description: "Quick response to 50+ incidents",
      icon: "exclamationmark.triangle.fill",
      iconColor: "#ff6b6b",
      badgeIcon: "star.fill",
      badgeColor: "#FFD700"
    },
    {
      id: 3,
      title: "Team Leader",
      description: "Leading conservation efforts",
      icon: "person.2.fill",
      iconColor: "#4caf50",
      badgeIcon: "star.fill",
      badgeColor: "#FFD700"
    },
    {
      id: 4,
      title: "Tech Pioneer",
      description: "Early adopter of SafariMap",
      icon: "bolt.fill",
      iconColor: "#9c27b0",
      badgeIcon: "star.fill",
      badgeColor: "#FFD700"
    }
  ];

  const openProfileMenu = () => {
    const onSignOut = async () => {
      const response = await logout();
      if (response.success) router.replace('/login');
      else Alert.alert('Error', 'Failed to sign out. Please try again.');
    };

    const items = ['Edit Profile', 'App Preferences', 'Notification Settings', 'Park Transfer Request', 'Sign Out', 'Cancel'];
    const handlers = [
      () => Alert.alert('Edit Profile', 'Edit profile information feature coming soon!'),
      () => Alert.alert('App Preferences', 'App preferences feature coming soon!'),
      () => Alert.alert('Notifications', 'Notification settings feature coming soon!'),
      () => Alert.alert('Park Transfer', 'Park transfer request feature coming soon!'),
      () => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: onSignOut }
      ])
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: items,
          cancelButtonIndex: items.length - 1,
          destructiveButtonIndex: items.length - 2,
          userInterfaceStyle: 'light'
        },
        (index) => {
          if (index >= 0 && index < handlers.length) handlers[index]!();
        }
      );
    } else {
      Alert.alert('Menu', 'Choose an option', [
        { text: 'Edit Profile', onPress: handlers[0] },
        { text: 'App Preferences', onPress: handlers[1] },
        { text: 'Notification Settings', onPress: handlers[2] },
        { text: 'Park Transfer Request', onPress: handlers[3] },
        { text: 'Sign Out', style: 'destructive', onPress: handlers[4] },
        { text: 'Cancel', style: 'cancel' }
      ]);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'android' ? 90 + insets.bottom : 110
        }}
      >
        {/* Title Bar with overflow menu */}
        <View style={styles.titleBar}>
          <View style={styles.titleBarContent}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.titleBarLogo}
              resizeMode="contain"
            />
            <ThemedText style={styles.titleBarText}>SafariMap GameWarden</ThemedText>
          </View>
          <TouchableOpacity onPress={openProfileMenu} style={styles.menuButton}>
            <IconSymbol name="ellipsis" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            {loading ? 'Loading profile...' : (error ? 'Failed to load profile' : 'Your ranger account and settings')}
          </ThemedText>
        </View>

        {/* Assigned Park Section */}
        <View style={styles.assignedParkCard}>
          <View style={styles.assignedParkHeader}>
            <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#ff9500" />
            <ThemedText style={styles.assignedParkTitle}>Current Park</ThemedText>
            <View style={styles.parkStatusIndicator}>
              <View style={styles.activeIndicator} />
              <ThemedText style={styles.activeText}>Active</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.assignedParkSubtitle}>Your current conservation assignment</ThemedText>
          
          <View style={styles.parkDetailsCard}>
            <ThemedText style={styles.parkName}>{parkData.name}</ThemedText>
            <ThemedText style={styles.parkDescription}>{parkData.description}</ThemedText>
            <View style={styles.parkInfoGrid}>
              <View style={styles.parkInfoItem}>
                <IconSymbol name="location.fill" size={12} color="#666" />
                <ThemedText style={styles.parkInfoText}>{parkData.location}</ThemedText>
              </View>
              <View style={styles.parkInfoItem}>
                <ThemedText style={styles.parkInfoText}>Area: {parkData.area}</ThemedText>
              </View>
              <View style={styles.parkInfoItem}>
                <ThemedText style={styles.parkInfoText}>Est. {parkData.established}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Park Switching Section */}
        <View style={styles.parkSwitchingCard}>
          <View style={styles.parkSwitchingHeader}>
            <IconSymbol name="arrow.triangle.2.circlepath" size={20} color="#2E7D32" />
            <ThemedText style={styles.parkSwitchingTitle}>Switch Park</ThemedText>
          </View>
          <ThemedText style={styles.parkSwitchingSubtitle}>Change your operating park assignment</ThemedText>
          
          <TouchableOpacity 
            style={styles.switchParkButton}
            onPress={() => {
              console.log('Profile - Available parks:', availableParks.length);
              console.log('Profile - Available parks data:', JSON.stringify(availableParks, null, 2));
              console.log('Profile - Selected park ID:', selectedPark?.id);
              
              const otherParks = availableParks.filter(park => park.id !== selectedPark?.id);
              console.log('Profile - Other parks (filtered):', otherParks.length);
              console.log('Profile - Other parks data:', JSON.stringify(otherParks, null, 2));
              
              // Create a simple park selection
              if (otherParks.length === 0) {
                Alert.alert('No Other Parks', 'No other parks available to switch to.');
                return;
              }
              
              // For now, let's try with just the first two parks to test
              const parksToShow = otherParks.slice(0, 2);
              const remainingCount = otherParks.length - 2;
              
              const alertButtons = [
                ...parksToShow.map(park => ({
                  text: park.name,
                  onPress: () => {
                    console.log('Profile - Switching to park:', park.name);
                    setSelectedPark(park);
                    Alert.alert(
                      'Park Switched',
                      `Now operating in ${park.name}`,
                      [{ text: 'OK' }]
                    );
                  }
                })),
                ...(remainingCount > 0 ? [{
                  text: `+${remainingCount} more parks...`,
                  onPress: () => {
                    // For now, just show the first additional park
                    if (otherParks[2]) {
                      setSelectedPark(otherParks[2]);
                      Alert.alert(
                        'Park Switched',
                        `Now operating in ${otherParks[2].name}`,
                        [{ text: 'OK' }]
                      );
                    }
                  }
                }] : []),
                { text: 'Cancel', style: 'cancel' as const }
              ];
              
              console.log('Profile - Alert buttons created:', alertButtons.length);
              console.log('Profile - Alert button texts:', alertButtons.map(btn => btn.text));
              
              Alert.alert(
                'Switch Park',
                `Currently operating in ${selectedPark?.name || 'No Park'}. Choose a different park:`,
                alertButtons
              );
            }}
          >
            <View style={styles.switchParkContent}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={20} color="#2E7D32" />
              <View style={styles.switchParkText}>
                <ThemedText style={styles.switchParkTitle}>Switch to Another Park</ThemedText>
                <ThemedText style={styles.switchParkSubtitle}>
                  {Math.max(0, availableParks.length - 1)} other parks available
                </ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* User Profile Section */}
        <View style={styles.userProfileCard}>
          <View style={styles.userProfileHeader}>
            <View style={styles.avatarContainer}>
              <ThemedText style={styles.avatarText}>{userData.avatar}</ThemedText>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>{userData.name}</ThemedText>
              <ThemedText style={styles.userRole}>{userData.role}</ThemedText>
              <View style={styles.userBadges}>
                <View style={styles.userBadge}>
                  <ThemedText style={styles.userBadgeText}>{userData.rangerId}</ThemedText>
                </View>
                <View style={styles.userBadge}>
                  <ThemedText style={styles.userBadgeText}>{userData.team}</ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.settingsButton}>
                <IconSymbol name="gear" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <ThemedText style={styles.editButtonText}>Edit</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.userMetadata}>
            <View style={styles.metadataItem}>
              <IconSymbol name="calendar" size={14} color="#666" />
              <ThemedText style={styles.metadataText}>Joined {userData.joinDate}</ThemedText>
            </View>
            <View style={styles.metadataItem}>
              <IconSymbol name="location.fill" size={14} color="#666" />
              <ThemedText style={styles.metadataText}>Currently in {userData.currentLocation}</ThemedText>
            </View>
          </View>
        </View>

        {/* Your Impact Section */}
        <View style={styles.impactSection}>
          <ThemedText style={styles.impactTitle}>Your Impact at {parkData.name}</ThemedText>
          <ThemedText style={styles.impactSubtitle}>Conservation statistics and contributions</ThemedText>
          
          <View style={styles.impactGrid}>
            <View style={styles.impactCard}>
              <ThemedText style={styles.impactNumber}>{impactStats.incidentsReported}</ThemedText>
              <ThemedText style={styles.impactLabel}>Incidents Reported</ThemedText>
            </View>
            <View style={styles.impactCard}>
              <ThemedText style={styles.impactNumber}>{impactStats.wildlifeTracked}</ThemedText>
              <ThemedText style={styles.impactLabel}>Wildlife Tracked</ThemedText>
            </View>
            <View style={styles.impactCard}>
              <ThemedText style={styles.impactNumber}>{impactStats.patrolsCompleted}</ThemedText>
              <ThemedText style={styles.impactLabel}>Patrols Completed</ThemedText>
            </View>
            <View style={styles.impactCard}>
              <ThemedText style={styles.impactNumber}>{impactStats.daysActive}</ThemedText>
              <ThemedText style={styles.impactLabel}>Days Active</ThemedText>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <ThemedText style={styles.achievementsTitle}>Achievements</ThemedText>
          <ThemedText style={styles.achievementsSubtitle}>Recognition for outstanding conservation work</ThemedText>
          
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <IconSymbol name={achievement.icon} size={24} color={achievement.iconColor} />
              </View>
              <View style={styles.achievementInfo}>
                <ThemedText style={styles.achievementTitle}>{achievement.title}</ThemedText>
                <ThemedText style={styles.achievementDescription}>{achievement.description}</ThemedText>
              </View>
              <View style={styles.achievementBadge}>
                <IconSymbol name={achievement.badgeIcon} size={16} color={achievement.badgeColor} />
              </View>
            </View>
          ))}
        </View>

        {/* App Preferences Section */}
        <View style={styles.settingsSection}>
          <ThemedText style={styles.settingsTitle}>App Preferences</ThemedText>
          <ThemedText style={styles.settingsSubtitle}>Customize your SafariMap experience</ThemedText>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="bell.fill" size={20} color="#666" />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingTitle}>Push Notifications</ThemedText>
                  <ThemedText style={styles.settingDescription}>Receive alerts for incidents and updates</ThemedText>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#e5e5e5', true: '#4caf50' }}
                thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="location.fill" size={20} color="#666" />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingTitle}>Location Sharing</ThemedText>
                  <ThemedText style={styles.settingDescription}>Share your location with team members</ThemedText>
                </View>
              </View>
              <Switch
                value={locationSharing}
                onValueChange={setLocationSharing}
                trackColor={{ false: '#e5e5e5', true: '#4caf50' }}
                thumbColor={locationSharing ? '#fff' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="wifi.slash" size={20} color="#666" />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingTitle}>Offline Mode</ThemedText>
                  <ThemedText style={styles.settingDescription}>Enable offline data collection</ThemedText>
                </View>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#e5e5e5', true: '#4caf50' }}
                thumbColor={offlineMode ? '#fff' : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="arrow.clockwise" size={20} color="#666" />
                <View style={styles.settingText}>
                  <ThemedText style={styles.settingTitle}>Auto-Sync</ThemedText>
                  <ThemedText style={styles.settingDescription}>Automatically sync data when online</ThemedText>
                </View>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: '#e5e5e5', true: '#4caf50' }}
                thumbColor={autoSync ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Menu replaces Quick Actions */}
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
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderBottomWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    flex: 1,
  },
  titleBarLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 4,
  },
  titleBarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  menuButton: {
    padding: 8,
    marginLeft: 12,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
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
  assignedParkCard: {
    backgroundColor: '#f8f8f8',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assignedParkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  assignedParkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  parkStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  activeText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  assignedParkSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  parkDetailsCard: {
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
  },
  parkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  parkDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  parkInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  parkInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: '45%',
  },
  parkInfoText: {
    fontSize: 11,
    color: '#666',
  },
  parkSwitchingCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parkSwitchingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  parkSwitchingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  parkSwitchingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  switchParkButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  switchParkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchParkText: {
    flex: 1,
  },
  switchParkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  switchParkSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  userProfileCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userProfileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  userBadge: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userBadgeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  profileActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  settingsButton: {
    padding: 8,
  },
  editButton: {
    backgroundColor: '#e5e5e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  userMetadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
  },
  impactSection: {
    margin: 20,
    marginTop: 0,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  impactSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  impactCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  impactNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  achievementsSection: {
    margin: 20,
    marginTop: 0,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  achievementsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
  },
  achievementBadge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsSection: {
    margin: 20,
    marginTop: 0,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  quickActionsSection: {
    margin: 20,
    marginTop: 0,
    marginBottom: 100,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  quickActionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  quickActionText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 12,
    fontWeight: '500',
  },
  destructiveText: {
    color: '#ff6b6b',
  },
});
