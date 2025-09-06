import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppConfig } from '../config/appConfig';
import { ThemedText } from './ThemedText';

interface AuthStatusIndicatorProps {
  isAuthenticated: boolean;
  user?: any;
}

export function AuthStatusIndicator({ isAuthenticated, user }: AuthStatusIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <ThemedText style={styles.label}>Service:</ThemedText>
        <ThemedText style={[styles.value, styles.serviceValue]}>
          {AppConfig.USE_SUPABASE ? 'Supabase' : 'Mock'}
        </ThemedText>
      </View>
      
      <View style={styles.statusRow}>
        <ThemedText style={styles.label}>Status:</ThemedText>
        <ThemedText style={[
          styles.value, 
          isAuthenticated ? styles.authenticated : styles.unauthenticated
        ]}>
          {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </ThemedText>
      </View>
      
      {user && (
        <View style={styles.statusRow}>
          <ThemedText style={styles.label}>User:</ThemedText>
          <ThemedText style={styles.value}>{user.name}</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
  },
  serviceValue: {
    color: '#2E7D32',
  },
  authenticated: {
    color: '#4caf50',
  },
  unauthenticated: {
    color: '#ff6b6b',
  },
});
