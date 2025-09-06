import { useAuth } from '@/contexts/AuthContext';
import { router, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'forgot-password';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not on auth pages, redirect to login
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but on auth pages, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <ThemedText style={{
          marginTop: 16,
          fontSize: 16,
          color: '#666'
        }}>
          Loading...
        </ThemedText>
      </View>
    );
  }

  return <>{children}</>;
}
