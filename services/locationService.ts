import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.LocationPermissionResponse['status'];
}

export class LocationService {
  private static instance: LocationService;
  private currentLocation: Location.LocationObject | null = null;
  private watchId: Location.LocationSubscription | null = null;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions
   */
  async requestPermissions(): Promise<LocationPermissionStatus> {
    try {
      // Web fallback - always return granted
      if (Platform.OS === 'web') {
        return {
          granted: true,
          canAskAgain: false,
          status: 'granted'
        };
      }

      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'SafariMap needs access to your location to track wildlife and navigate parks.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.openSettingsAsync() }
          ]
        );
      }

      return {
        granted: status === 'granted',
        canAskAgain,
        status
      };
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return {
        granted: false,
        canAskAgain: false,
        status: 'denied'
      };
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<LocationCoordinates | null> {
    try {
      // Web fallback - return default Masai Mara location
      if (Platform.OS === 'web') {
        return {
          latitude: -1.2921,
          longitude: 35.5739,
        };
      }

      const permission = await this.requestPermissions();
      if (!permission.granted) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      });

      this.currentLocation = location;
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      // Return default location on error
      return {
        latitude: -1.2921,
        longitude: 35.5739,
      };
    }
  }

  /**
   * Watch location changes
   */
  async watchLocation(
    callback: (location: LocationCoordinates) => void,
    options?: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    }
  ): Promise<boolean> {
    try {
      const permission = await this.requestPermissions();
      if (!permission.granted) {
        return false;
      }

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || Location.Accuracy.High,
          timeInterval: options?.timeInterval || 1000,
          distanceInterval: options?.distanceInterval || 1,
        },
        (location) => {
          this.currentLocation = location;
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      return true;
    } catch (error) {
      console.error('Error watching location:', error);
      return false;
    }
  }

  /**
   * Stop watching location
   */
  stopWatchingLocation(): void {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  /**
   * Get last known location
   */
  getLastKnownLocation(): LocationCoordinates | null {
    if (this.currentLocation) {
      return {
        latitude: this.currentLocation.coords.latitude,
        longitude: this.currentLocation.coords.longitude,
      };
    }
    return null;
  }

  /**
   * Calculate distance between two points (in meters)
   */
  calculateDistance(
    point1: LocationCoordinates,
    point2: LocationCoordinates
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(coordinates: LocationCoordinates): string {
    const lat = coordinates.latitude.toFixed(6);
    const lng = coordinates.longitude.toFixed(6);
    return `${lat}°N, ${lng}°E`;
  }

  /**
   * Check if location is within park boundaries
   */
  isWithinPark(
    location: LocationCoordinates,
    parkBoundaries: LocationCoordinates[]
  ): boolean {
    // Simple polygon containment check
    // For production, use a proper geospatial library
    let inside = false;
    for (let i = 0, j = parkBoundaries.length - 1; i < parkBoundaries.length; j = i++) {
      if (
        parkBoundaries[i].longitude > location.longitude !==
          parkBoundaries[j].longitude > location.longitude &&
        location.latitude <
          ((parkBoundaries[j].latitude - parkBoundaries[i].latitude) *
            (location.longitude - parkBoundaries[i].longitude)) /
            (parkBoundaries[j].longitude - parkBoundaries[i].longitude) +
            parkBoundaries[i].latitude
      ) {
        inside = !inside;
      }
    }
    return inside;
  }

  /**
   * Get address from coordinates (reverse geocoding)
   */
  async getAddressFromCoordinates(
    coordinates: LocationCoordinates
  ): Promise<string | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        return `${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.country || ''}`.trim();
      }

      return null;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  }

  /**
   * Get coordinates from address (geocoding)
   */
  async getCoordinatesFromAddress(address: string): Promise<LocationCoordinates | null> {
    try {
      const locations = await Location.geocodeAsync(address);
      
      if (locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting coordinates from address:', error);
      return null;
    }
  }
}

// Export singleton instance
export const locationService = LocationService.getInstance();
