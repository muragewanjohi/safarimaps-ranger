import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const userData = {
    name: "Sarah Johnson",
    role: "Senior Wildlife Ranger",
    rangerId: "RGR-001",
    team: "Alpha Team",
    joinDate: "2019-03-15",
    currentLocation: "Sector A-12",
    avatar: "SJ"
  };

  const parkData = {
    name: "Masai Mara National Reserve",
    description: "World-renowned safari destination in Kenya, famous for the Great Migration",
    location: "Narok County, Kenya",
    area: "1,510 km²",
    established: "1961"
  };

  const impactStats = {
    incidentsReported: 247,
    wildlifeTracked: 1342,
    patrolsCompleted: 156,
    daysActive: 1847
  };

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

  const quickActions = [
    {
      id: 1,
      title: "Edit Profile Information",
      icon: "person.fill",
      iconColor: "#666",
      action: () => Alert.alert('Edit Profile', 'Edit profile information feature coming soon!')
    },
    {
      id: 2,
      title: "App Preferences",
      icon: "gear",
      iconColor: "#666",
      action: () => Alert.alert('App Preferences', 'App preferences feature coming soon!')
    },
    {
      id: 3,
      title: "Notification Settings",
      icon: "bell.fill",
      iconColor: "#666",
      action: () => Alert.alert('Notifications', 'Notification settings feature coming soon!')
    },
    {
      id: 4,
      title: "Park Transfer Request",
      icon: "exclamationmark.triangle.fill",
      iconColor: "#ff9500",
      action: () => Alert.alert('Park Transfer', 'Park transfer request feature coming soon!')
    },
    {
      id: 5,
      title: "Sign Out",
      icon: "person.fill",
      iconColor: "#ff6b6b",
      isDestructive: true,
      action: () => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Sign out') }
      ])
    }
  ];

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Profile</ThemedText>
          <ThemedText style={styles.subtitle}>Your ranger account and settings</ThemedText>
        </View>

        {/* Assigned Park Section */}
        <View style={styles.assignedParkCard}>
          <View style={styles.assignedParkHeader}>
            <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#ff9500" />
            <ThemedText style={styles.assignedParkTitle}>Assigned Park</ThemedText>
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

        {/* App Settings Section */}
        <View style={styles.settingsSection}>
          <ThemedText style={styles.settingsTitle}>App Settings</ThemedText>
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

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <ThemedText style={styles.quickActionsTitle}>Quick Actions</ThemedText>
          
          <View style={styles.quickActionsCard}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={action.action}
              >
                <IconSymbol name={action.icon} size={20} color={action.iconColor} />
                <ThemedText style={[
                  styles.quickActionText,
                  action.isDestructive && styles.destructiveText
                ]}>
                  {action.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
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
    gap: 8,
    marginBottom: 4,
  },
  assignedParkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
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
