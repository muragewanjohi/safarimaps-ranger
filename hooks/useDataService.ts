import { useCallback, useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { ApiResponse } from '../types';

// Generic hook for API calls
export function useApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Specific hooks for different data types
export function useRangerData() {
  return useApiCall(() => dataService.getRangerData());
}

export function useParkData() {
  return useApiCall(() => dataService.getParkData());
}

export function useDashboardStats(parkId?: string) {
  return useApiCall(() => dataService.getDashboardStats(parkId), [parkId]);
}

export function useEmergencyAlerts(parkId?: string) {
  return useApiCall(() => dataService.getEmergencyAlerts(parkId), [parkId]);
}

export function useRecentIncidents(parkId?: string) {
  return useApiCall(() => dataService.getRecentIncidents(parkId), [parkId]);
}

export function useRecentLocations(parkId?: string) {
  return useApiCall(() => dataService.getRecentLocations(parkId), [parkId]);
}

export function useReports() {
  return useApiCall(() => dataService.getReports());
}

export function useReport(id: number) {
  return useApiCall(() => dataService.getReportById(id), [id]);
}

export function useImpactStats() {
  return useApiCall(() => dataService.getImpactStats());
}

export function useAchievements() {
  return useApiCall(() => dataService.getAchievements());
}

// Hook for adding locations
export function useAddLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLocation = useCallback(async (locationData: any, parkId?: string) => {
    try {
      console.log('useAddLocation: Starting addLocation with data:', locationData);
      console.log('useAddLocation: Park ID:', parkId);
      setLoading(true);
      setError(null);
      const response = await dataService.addLocation(locationData, parkId);
      
      console.log('useAddLocation: Received response:', response);
      
      if (response.success) {
        console.log('useAddLocation: Success, returning data:', response.data);
        return response.data;
      } else {
        console.log('useAddLocation: Failed, error:', response.error);
        setError(response.error || 'Failed to add location');
        return null;
      }
    } catch (err) {
      console.error('useAddLocation: Exception caught:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addLocation, loading, error };
}
